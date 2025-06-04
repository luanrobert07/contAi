import { IsEnum, IsNotEmpty, IsNumber, Matches } from "class-validator"
import { TransactionType } from "../entities/transaction"

export class CreateTransactionDTO {
  @Matches(
    /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
    { message: "Date must be in the format DD/MM/YYYY." }
  )
  date!: string

  @IsNotEmpty({ message: "Description should not be empty." })
  description!: string

  @IsNumber({}, { message: "Value must be a number." })
  value!: number

  @IsEnum(TransactionType, { message: "Type must be either 'Credit' or 'Debit'." })
  type!: TransactionType
}