import type { Request, Response } from "express"
import { TransactionService } from "../services/TransactionService"
import { TransactionType } from "../entities/transaction"
import z from "zod"
import { createTransactionSchema } from "../dto/transactionDTO"

export class TransactionController {
  private transactionService: TransactionService

  constructor() {
    this.transactionService = new TransactionService()
  }

  async create(req: Request, res: Response) {
    try {
      const parsedData = createTransactionSchema.parse(req.body)
  
      const newTransaction = await this.transactionService.create(parsedData)
  
      res.status(201).json({
        message: "Transaction created successfully",
        data: newTransaction,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors,
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

  async listMonthlyTotals(req: Request, res: Response) {
    try {
      const result = await this.transactionService.getMonthlyTotals()
      res.json({
        message: "Monthly totals listed successfully",
        data: result,
      })
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }
}
