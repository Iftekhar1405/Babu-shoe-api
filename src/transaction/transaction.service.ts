import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import { Transaction, TransactionDocument, TransactionType } from './schema/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ReverseTransactionDto } from './dto/reverse-transaction.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Customer, CustomerDocument } from 'src/customer/schema/customer.schema';
import { Order, OrderDocument } from 'src/order/schemas/order.schema';

@Injectable()
export class TransactionService {
    constructor(
        @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
        @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>, // replace any with your customer document type
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        @InjectConnection() private readonly connection: Connection,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    private getSignedAmount(type: TransactionType, amount: number, metadata?: Record<string, any>): number {
        // By convention in this codebase:
        // - CHARGE increases customer's outstanding balance (+)
        // - PAYMENT reduces outstanding balance (-)
        // - REFUND reduces outstanding balance (-)
        // - ADJUSTMENT uses signedAmount from metadata if present, otherwise 0
        // - REVERSAL will be handled by reversing original transaction (service builds signedAmount)

        switch (type) {
            case TransactionType.CHARGE:
                return Math.abs(amount);
            case TransactionType.PAYMENT:
            case TransactionType.REFUND:
                return -Math.abs(amount);
            case TransactionType.ADJUSTMENT:
                if (metadata && typeof metadata.signedAmount === 'number') return metadata.signedAmount;
                return 0;
            default:
                return 0;
        }
    }

    /**
     * Create transaction in an atomic/transactional way.
     * - idempotencyKey supported per customer
     * - updates customer.currentBalance atomically
     * - updates order paid/due when orderId provided
     */
    async createTransaction(dto: CreateTransactionDto, performedBy?: string) {
        const session = await this.connection.startSession();
        try {
            let createdTx: TransactionDocument | null = null;

            await session.withTransaction(async () => {
                // Idempotency: if key provided, try to return the existing transaction created earlier
                if (dto.idempotencyKey) {
                    const existing = await this.transactionModel.findOne({
                        customerId: dto.customerId,
                        idempotencyKey: dto.idempotencyKey,
                    }).session(session);
                    if (existing) {
                        createdTx = existing;
                        return;
                    }
                }

                // compute signed amount
                const signedAmount = this.getSignedAmount(dto.type, dto.amount, dto.metadata);

                // update customer balance atomically and fetch new balance
                const customerUpdate = await this.customerModel.findOneAndUpdate(
                    { _id: new Types.ObjectId(dto.customerId) },
                    { $inc: { currentBalance: signedAmount } },
                    { new: true, session },
                );

                if (!customerUpdate) throw new NotFoundException('Customer not found');

                // enforce creditLimit if you want (optional):
                // if (customerUpdate.creditLimit && customerUpdate.currentBalance > customerUpdate.creditLimit) {
                //   throw new BadRequestException('Credit limit exceeded');
                // }

                // create transaction doc
                const txObj: Partial<Transaction> = {
                    customerId: new Types.ObjectId(dto.customerId),
                    orderId: dto.orderId ? new Types.ObjectId(dto.orderId) : undefined,
                    type: dto.type,
                    amount: dto.amount,
                    signedAmount,
                    balanceAfter: customerUpdate.currentBalance,
                    paymentMethod: dto.paymentMethod,
                    remarks: dto.remarks,
                    idempotencyKey: dto.idempotencyKey,
                    metadata: dto.metadata,
                };

                const [txDoc] = await this.transactionModel.create([txObj], { session });
                createdTx = txDoc;

                // if orderId and it's a PAYMENT or CHARGE, update the order's paid/due amounts
                if (dto.orderId) {
                    await this.applyToOrderInSession(dto.orderId, dto.type, dto.amount, session);
                }

                // emit event for listeners (analytics, notifications, integrations)
                this.eventEmitter.emit('transaction.created', {
                    transaction: createdTx.toObject(),
                    performedBy,
                });
            });

            return createdTx;
        } finally {
            session.endSession();
        }
    }

    /**
     * Helper to update a single order inside an existing session
     * This updates order.paidAmount and order.dueAmount and paymentStatus.
     */
    private async applyToOrderInSession(orderId: string | Types.ObjectId, txType: TransactionType, amount: number, session: any) {
        // Only handle common cases: if txType == PAYMENT -> increment paidAmount
        if (txType === TransactionType.PAYMENT) {
            const order = await this.orderModel.findOneAndUpdate(
                { _id: new Types.ObjectId(orderId) },
                { $inc: { paidAmount: amount } },
                { new: true, session },
            );
            if (!order) throw new NotFoundException('Order not found');

            // recompute due and status
            const due = (order.totalAmount || 0) - (order.paidAmount || 0);
            const status = due <= 0 ? 'Paid' : (order.paidAmount > 0 ? 'Partial' : 'Due');

            await this.orderModel.updateOne({ _id: order._id }, { $set: { dueAmount: due, paymentStatus: status } }, { session });
        }

        if (txType === TransactionType.CHARGE) {
            // if CHARGE and order exists maybe increase order.totalAmount (depends on your flow)
            // keep conservative: do not change order's totals here unless it's intended
        }
    }

    /**
     * Reverse a transaction (atomic)
     * - creates a reversal transaction that negates the original's signedAmount
     * - marks original as reversed
     */
    async reverseTransaction(dto: ReverseTransactionDto, performedBy?: string) {
        const session = await this.connection.startSession();
        try {
            let reversalTx: TransactionDocument | null = null;

            await session.withTransaction(async () => {
                const original = await this.transactionModel.findById(dto.transactionId).session(session);
                if (!original) throw new NotFoundException('Original transaction not found');
                if (original.isReversed) return; // idempotent: already reversed

                // optional idempotency check for reversals
                if (dto.idempotencyKey) {
                    const existing = await this.transactionModel.findOne({ customerId: original.customerId, idempotencyKey: dto.idempotencyKey }).session(session);
                    if (existing) {
                        reversalTx = existing;
                        return;
                    }
                }

                const reversalSigned = -original.signedAmount;

                // update customer balance
                const customerUpdate = await this.customerModel.findOneAndUpdate(
                    { _id: original.customerId },
                    { $inc: { currentBalance: reversalSigned } },
                    { new: true, session },
                );
                if (!customerUpdate) throw new NotFoundException('Customer not found');

                // create reversal transaction
                const txObj: Partial<Transaction> = {
                    customerId: original.customerId,
                    orderId: original.orderId,
                    type: TransactionType.REVERSAL,
                    amount: original.amount,
                    signedAmount: reversalSigned,
                    balanceAfter: customerUpdate.currentBalance,
                    remarks: `Reversal of ${original._id}. ${dto.reason || ''}`,
                    metadata: { reversedTransaction: original._id, reason: dto.reason },
                    idempotencyKey: dto.idempotencyKey,
                    reversedFrom: original._id as Types.ObjectId,
                };

                const [txDoc] = await this.transactionModel.create([txObj], { session });
                reversalTx = txDoc;

                // mark original as reversed
                await this.transactionModel.updateOne({ _id: original._id }, { $set: { isReversed: true } }, { session });

                // update order (if reversal relates to a payment on order)
                if (original.orderId && original.type === TransactionType.PAYMENT) {
                    // reduce paidAmount by original.amount
                    await this.orderModel.updateOne({ _id: original.orderId }, { $inc: { paidAmount: -original.amount } }, { session });
                    // recompute due/status -- fetch order
                    const order = await this.orderModel.findById(original.orderId).session(session);
                    if (order) {
                        const due = (order.totalAmount || 0) - (order.paidAmount || 0);
                        const status = due <= 0 ? 'Paid' : (order.paidAmount > 0 ? 'Partial' : 'Due');
                        await this.orderModel.updateOne({ _id: order._id }, { $set: { dueAmount: due, paymentStatus: status } }, { session });
                    }
                }

                this.eventEmitter.emit('transaction.reversed', { originalId: original._id, reversal: reversalTx.toObject(), performedBy });
            });

            return reversalTx;
        } finally {
            session.endSession();
        }
    }

    /**
     * Get paginated transactions for a customer with optional running balance (using setWindowFields)
     * Note: running balance requires MongoDB >= 5.0 which supports $setWindowFields
     */
    async getLedger(customerId: string, options: { limit?: number; afterId?: string; from?: Date; to?: Date; types?: TransactionType[] } = {}) {
        const match: any = { customerId: new Types.ObjectId(customerId) };
        if (options.from || options.to) match.createdAt = {};
        if (options.from) match.createdAt.$gte = options.from;
        if (options.to) match.createdAt.$lte = options.to;
        if (options.types && options.types.length) match.type = { $in: options.types };

        // For pagination we implement simple skip-limit for clarity here
        const pipeline: any[] = [
            { $match: match },
            { $sort: { createdAt: 1, _id: 1 } },
            // running balance using window function
            {
                $setWindowFields: {
                    partitionBy: '$customerId',
                    sortBy: { createdAt: 1, _id: 1 },
                    output: {
                        runningBalance: { $sum: '$signedAmount', window: { documents: ['unbounded', 'current'] } },
                    },
                },
            },
            { $sort: { createdAt: -1 } },
            { $limit: options.limit || 50 },
        ];

        const rows = await this.transactionModel.aggregate(pipeline).exec();
        return rows;
    }

    /**
     * Sanity/reconciliation helper: recompute customer's balance from transactions and optionally fix
     */
    async reconcileCustomerBalance(customerId: string, options: { fixIfMismatch?: boolean } = { fixIfMismatch: false }) {
        // sum all signedAmount for a customer
        const agg = await this.transactionModel.aggregate([
            { $match: { customerId: new Types.ObjectId(customerId) } },
            { $group: { _id: '$customerId', computedBalance: { $sum: '$signedAmount' } } },
        ]);

        const computed = agg.length ? agg[0].computedBalance : 0;
        const customer = await this.customerModel.findById(customerId);
        if (!customer) throw new NotFoundException('Customer not found');

        const current = customer.currentBalance || 0;
        if (Math.abs(current - computed) < 1e-6) return { matched: true, current };

        if (options.fixIfMismatch) {
            // create an adjustment transaction to correct the difference
            const diff = computed - current; // signed amount we need to apply to customer to match computed
            const session = await this.connection.startSession();
            try {
                let adjustTx: TransactionDocument | null = null;
                await session.withTransaction(async () => {
                    await this.customerModel.updateOne({ _id: new Types.ObjectId(customerId) }, { $set: { currentBalance: computed } }, { session });
                    const [txDoc] = await this.transactionModel.create([
                        {
                            customerId: new Types.ObjectId(customerId),
                            type: TransactionType.ADJUSTMENT,
                            amount: Math.abs(diff),
                            signedAmount: diff,
                            balanceAfter: computed,
                            remarks: 'Auto reconciliation adjustment',
                            metadata: { autoReconciled: true },
                        },
                    ], { session });
                    adjustTx = txDoc;
                });
                return { matched: false, fixed: true, computed, adjustment: adjustTx };
            } finally {
                session.endSession();
            }
        }

        return { matched: false, current, computed };
    }

    /**
     * Lightweight listing API with filters (paginated)
     */
    async listTransactions(filter: { customerId?: string; type?: TransactionType; from?: Date; to?: Date; limit?: number; page?: number } = {}) {
        const q: any = {};
        if (filter.customerId) q.customerId = new Types.ObjectId(filter.customerId);
        if (filter.type) q.type = filter.type;
        if (filter.from || filter.to) q.createdAt = {};
        if (filter.from) q.createdAt.$gte = filter.from;
        if (filter.to) q.createdAt.$lte = filter.to;

        const page = Math.max(1, filter.page || 1);
        const limit = Math.min(200, filter.limit || 50);
        const skip = (page - 1) * limit;

        const [rows, total] = await Promise.all([
            this.transactionModel.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            this.transactionModel.countDocuments(q),
        ]);

        return { rows, total, page, limit };
    }
}
