import { Repository } from "typeorm"
import { Transaction } from "../entities/transaction"
import { TransactionType } from "../entities/transaction"
import { myDataSource } from "../database/database"
import dayjs from "dayjs"
import type { CreateTransactionInput } from "../dto/transactionDTO"

export class TransactionService {
  private transactionRepository: Repository<Transaction>

  constructor() {
    this.transactionRepository = myDataSource.getRepository(Transaction)
  }

  private parseDateDDMMYYYY(dateStr: string): Date {
    const [day, month, year] = dateStr.split("/").map(Number)
    return new Date(year, month - 1, day)
  }

  async create(data: CreateTransactionInput): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      date: this.parseDateDDMMYYYY(data.date),
      description: data.description,
      value: data.value,
      type: data.type,
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
      const key = `${date.year()}-${String(date.month() + 1).padStart(2, "0")}`

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
}
