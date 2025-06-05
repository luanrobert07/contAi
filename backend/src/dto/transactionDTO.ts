import { z } from "zod"
import { TransactionType } from "../entities/transaction"

export const createTransactionSchema = z.object({
  date: z.string().regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: "Date must be in the format DD/MM/YYYY.",
  }),
  description: z.string().min(1, "Description should not be empty."),
  value: z.number({ invalid_type_error: "Value must be a number." }),
  type: z.enum([TransactionType.CREDIT, TransactionType.DEBIT]),
})

// Para tipar os dados validados
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>

