import * as z from "zod"

export const transactionFormSchema = z.object({
  date: z.date({ required_error: "Data é obrigatória" }),
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z
    .number({ invalid_type_error: "Valor deve ser um número" })
    .positive("Valor deve ser maior que zero"),
  type: z.enum(["Credit", "Debit"], { required_error: "Tipo é obrigatório" }),
})
