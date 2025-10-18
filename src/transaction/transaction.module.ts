import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { Customer, CustomerSchema } from 'src/customer/schema/customer.schema';
import { Order, OrderSchema } from 'src/order/schemas/order.schema';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    EventEmitterModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService]
})
export class TransactionModule { }



/* -------------------------------------------------------------------------- */
// Notes:
// 1) This module intentionally keeps most "business logic" in the service, not in schema hooks,
//    so you can orchestrate multi-document updates inside a Mongoose session.
// 2) Idempotency: compound index (customerId + idempotencyKey) prevents duplicate creation
// 3) Reconciliation: service exposes reconcileCustomerBalance to verify and optionally fix balances
// 4) Event-driven: emits 'transaction.created' and 'transaction.reversed' so other parts (notifications, analytics, accounting exports)
//    can react asynchronously (e.g., push to a queue)
// 5) Running balance in ledger: uses $setWindowFields — only available on MongoDB >= 5.0. If your cluster is older,
//    compute running balances in the app by scanning ordered transactions.
// 6) Extensibility: metadata map exists for future integrations (gateway IDs, bank refs, UPI txn id etc.)

// Next steps you may request:
// - Add unit/integration tests for service methods (examples with in-memory MongoDB)
// - Add GraphQL support or WebSocket events
// - Add background job to apply orphan payments to oldest due orders (for automatic allocation)
// - Add tenant awareness (multitenancy) if you operate multiple shops in the same database


