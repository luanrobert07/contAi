import { Repository } from "typeorm"
import { validate } from "class-validator"
import { Transaction } from "../entities/transaction"
import { TransactionType } from "../entities/transaction"
import { myDataSource } from "../database/database"
import { CreateTransactionDTO } from "../dto/transactionDTO"

export class TransactionService {
  private transactionRepository: Repository<Transaction>

  constructor() {
    this.transactionRepository = myDataSource.getRepository(Transaction)
  }

  async create(data: CreateTransactionDTO): Promise<Transaction> {
    const dto = Object.assign(new CreateTransactionDTO(), data)

    const errors = await validate(dto)
    if (errors.length > 0) {
      const messages = errors.map((error) => ({
        field: error.property,
        messages: Object.values(error.constraints || {}),
      }))
      throw new Error(`Validation failed: ${JSON.stringify(messages)}`)
    }

    const transaction = this.transactionRepository.create({
      date: dto.date,
      description: dto.description,
      value: dto.value,
      type: dto.type,
    })

    return await this.transactionRepository.save(transaction)
  }

  async findAll(): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      order: { date: "DESC" },
    })
  }

  async findByMonthAndYear(
    year: number,
    month: number
  ): Promise<{
    transactions: Transaction[]
    totals: {
      credits: number
      debits: number
      balance: number
    }
    period: {
      year: number
      month: number
    }
  }> {
    const transactions = await this.transactionRepository
      .createQueryBuilder("transaction")
      .where("EXTRACT(YEAR FROM transaction.date) = :year", { year })
      .andWhere("EXTRACT(MONTH FROM transaction.date) = :month", { month })
      .orderBy("transaction.date", "ASC")
      .getMany()

    const totals = this.calculateTotals(transactions)

    return {
      transactions,
      totals,
      period: { year, month },
    }
  }

  private calculateTotals(transactions: Transaction[]) {
    const totalCredits = transactions
      .filter((t) => t.type === TransactionType.CREDIT)
      .reduce((sum, t) => sum + Number(t.value), 0)

    const totalDebits = transactions
      .filter((t) => t.type === TransactionType.DEBIT)
      .reduce((sum, t) => sum + Number(t.value), 0)

    return {
      credits: totalCredits,
      debits: totalDebits,
      balance: totalCredits - totalDebits,
    }
  }

  async isValidPeriod(year: number, month: number): Promise<boolean> {
    return year >= 1900 && year <= 2100 && month >= 1 && month <= 12
  }
}
