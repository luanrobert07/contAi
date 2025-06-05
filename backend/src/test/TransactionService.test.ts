import { describe, it, expect, beforeEach, vi } from "vitest";
import { TransactionService } from "../services/TransactionService";
import { TransactionType } from "../entities/transaction";

describe("TransactionService", () => {
  let service: TransactionService;

  const mockRepository = {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
  };

  beforeEach(() => {
    service = new TransactionService();
    (service as any).transactionRepository = mockRepository;

    vi.clearAllMocks();
  });

  it("should create a transaction", async () => {
    const inputData = {
      date: "15/06/2025",
      description: "Test transaction",
      value: 100,
      type: TransactionType.CREDIT,
    };

    const savedTransaction = {
      id: 1,
      date: new Date(2025, 5, 15),
      description: inputData.description,
      value: inputData.value,
      type: inputData.type,
    };

    mockRepository.create.mockReturnValue(savedTransaction);
    mockRepository.save.mockResolvedValue(savedTransaction);

    const result = await service.create(inputData);

    expect(mockRepository.create).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual(savedTransaction);
  });

  it("should list all transactions", async () => {
    const transactionsList = [
      {
        id: 1,
        date: new Date(2025, 5, 15),
        description: "Transaction 1",
        value: 50,
        type: TransactionType.DEBIT,
      },
      {
        id: 2,
        date: new Date(2025, 5, 20),
        description: "Transaction 2",
        value: 200,
        type: TransactionType.CREDIT,
      },
    ];

    mockRepository.find.mockResolvedValue(transactionsList);

    const result = await service.findAll();

    expect(mockRepository.find).toHaveBeenCalled();
    expect(result).toEqual(transactionsList);
  });
});
