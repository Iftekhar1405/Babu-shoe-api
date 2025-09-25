import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ReverseTransactionDto } from './dto/reverse-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionsService: TransactionService) { }

  @Post()
  async create(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.createTransaction(dto);
  }

  @Post('reverse')
  async reverse(@Body() dto: ReverseTransactionDto) {
    return this.transactionsService.reverseTransaction(dto);
  }

  @Get('customer/:customerId/ledger')
  async ledger(@Param('customerId') customerId: string, @Query('limit') limit?: string) {
    return this.transactionsService.getLedger(customerId, { limit: limit ? parseInt(limit, 10) : undefined });
  }

  @Get()
  async list(@Query() q: any) {
    return this.transactionsService.listTransactions(q);
  }
}

