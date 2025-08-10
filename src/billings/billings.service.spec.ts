import { Test, TestingModule } from '@nestjs/testing';
import { BillService } from './billings.service';


describe('BillingsService', () => {
  let service: BillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillService],
    }).compile();

    service = module.get<BillService>(BillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
