import { Router, Request, Response, NextFunction } from "express"
import { TransactionController } from "../controllers/TransactionController"

const router = Router()
const transactionController = new TransactionController()

const asyncHandler = (fn: (req: Request, res: Response) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res).catch(next)

router.post("/", asyncHandler((req, res) => 
  transactionController.create(req, res)
))

router.get("/", asyncHandler((req, res) => 
  transactionController.listAll(req, res)
))

router.get("/:year/:month", asyncHandler((req, res) => 
  transactionController.listByMonth(req, res)
))

export { router as transactionRoutes }
