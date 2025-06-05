import { Router, Request, Response, NextFunction } from "express"
import { TransactionController } from "../controllers/TransactionController"

const router = Router()
const transactionController = new TransactionController()

const asyncHandler = (fn: (req: Request, res: Response) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res).catch(next)

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateTransactionDTO:
 *       type: object
 *       required:
 *         - date
 *         - description
 *         - value
 *         - type
 *       properties:
 *         date:
 *           type: string
 *           example: "10-10-2025"
 *           description: Date in DD/MM/YYYY format
 *         description:
 *           type: string
 *           example: "Grocery shopping"
 *         value:
 *           type: number
 *           example: 250.75
 *         type:
 *           type: string
 *           enum: [Credit, Debit]
 *           example: Debit
 *     Transaction:
 *       allOf:
 *         - $ref: '#/components/schemas/CreateTransactionDTO'
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "123"
 *             date:
 *               type: string
 *               format: date-time
 *               example: "2025-10-10"
 */

/**
 * @swagger
 * /transaction:
 *   post:
 *     summary: Create a new transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTransactionDTO'
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Validation error
 *
 *   get:
 *     summary: Get all transactions
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */

/**
 * @swagger
 * /transaction/monthly/totals:
 *   get:
 *     summary: Get monthly totals of credits, debits and balance
 *     responses:
 *       200:
 *         description: Monthly totals grouped by year and month
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   year:
 *                     type: integer
 *                     example: 2025
 *                   month:
 *                     type: integer
 *                     example: 6
 *                   credits:
 *                     type: number
 *                     example: 5000
 *                   debits:
 *                     type: number
 *                     example: 1500
 *                   balance:
 *                     type: number
 *                     example: 3500
 */

router.post("/", asyncHandler((req, res) => 
  transactionController.create(req, res)
))

router.get("/", asyncHandler((req, res) => 
  transactionController.listAll(req, res)
))

router.get("/monthly/totals", asyncHandler((req, res) =>
  transactionController.listMonthlyTotals(req, res)
))

export { router as transactionRoutes }
