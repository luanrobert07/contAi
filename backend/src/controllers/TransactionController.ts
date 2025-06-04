import type { Request, Response } from "express"
import { TransactionService } from "../services/TransactionService"
import { TransactionType } from "../entities/transaction"

export class TransactionController {
  private transactionService: TransactionService

  constructor() {
    this.transactionService = new TransactionService()
  }

  async create(req: Request, res: Response) {
    try {
      const { date, description, value, type } = req.body

      const newTransaction = await this.transactionService.create({
        date,
        description,
        value: parseFloat(value),
        type: type as TransactionType,
      })

      res.status(201).json({
        message: "Transaction created successfully",
        data: newTransaction,
      })
    } catch (error) {
      if (error instanceof Error && error.message.includes("Validation failed")) {
        return res.status(400).json({
          message: "Invalid data",
          error: error.message,
        })
      }

      res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  async listAll(req: Request, res: Response) {
    try {
      const transactions = await this.transactionService.findAll()
      res.json({
        message: "Transactions listed successfully",
        data: transactions,
        total: transactions.length,
      })
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  async listByMonth(req: Request, res: Response) {
    try {
      const { year, month } = req.params
      const yearNum = parseInt(year)
      const monthNum = parseInt(month)

      const isValid = await this.transactionService.isValidPeriod(yearNum, monthNum)
      if (!isValid) {
        return res.status(400).json({
          message: "Invalid period. Year must be between 1900-2100 and month between 1-12",
        })
      }

      const result = await this.transactionService.findByMonthAndYear(yearNum, monthNum)
      res.json({
        message: "Transactions for the period listed successfully",
        data: result,
      })
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  // Uncomment if you want to use monthly summary
  /*
  async monthlySummary(req: Request, res: Response) {
    try {
      const summary = await this.transactionService.getMonthlySummary()
      res.json({
        message: "Monthly summary retrieved successfully",
        data: summary,
      })
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }
  */
}
