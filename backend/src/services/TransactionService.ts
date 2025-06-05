import { Between, Repository } from "typeorm"
import { validate } from "class-validator"
import { Transaction } from "../entities/transaction"
import { TransactionType } from "../entities/transaction"
import { myDataSource } from "../database/database"
import { CreateTransactionDTO } from "../dto/transactionDTO"
import dayjs from "dayjs"

export class TransactionService {
  private transactionRepository: Repository<Transaction>

  constructor() {
    this.transactionRepository = myDataSource.getRepository(Transaction)
  }

  private parseDateDDMMYYYY(dateStr: string): Date {
    const [day, month, year] = dateStr.split("/").map(Number)
    return new Date(year, month - 1, day)
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
      date: this.parseDateDDMMYYYY(dto.date),
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

  async getMonthlyTotals(): Promise<
    {
      month: number
      year: number
      credits: number
      debits: number
      balance: number
    }[]
  > {
    const transactions = await this.transactionRepository.find({
      order: { date: "ASC" },
    })

    const grouped = new Map<string, Transaction[]>()

    for (const transaction of transactions) {
      const date = dayjs(transaction.date)
      const key = `${date.year()}-${String(date.month() + 1).padStart(2, "0")}` // ex: 2025-03

      if (!grouped.has(key)) {
        grouped.set(key, [])
      }

      grouped.get(key)!.push(transaction)
    }

    const results = Array.from(grouped.entries()).map(([key, txs]) => {
      const [yearStr, monthStr] = key.split("-")
      const year = parseInt(yearStr)
      const month = parseInt(monthStr)

      const totals = this.calculateTotals(txs)

      return {
        year,
        month,
        credits: totals.credits,
        debits: totals.debits,
        balance: totals.balance,
      }
    })

    return results
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
