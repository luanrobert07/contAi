import { IsDateString, IsEnum, IsNotEmpty, IsNumber } from "class-validator"
import { TransactionType } from "../entities/transaction"

export class CreateTransactionDTO {
  @IsDateString({}, { message: "Date must be a valid ISO 8601 string." })
  date!: string

  @IsNotEmpty({ message: "Description should not be empty." })
  description!: string

  @IsNumber({}, { message: "Value must be a number." })
  value!: number

  @IsEnum(TransactionType, { message: "Type must be either 'Credit' or 'Debit'." })
  type!: TransactionType
}