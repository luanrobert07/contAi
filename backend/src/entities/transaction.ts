import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"
import { IsNotEmpty, IsPositive, IsIn, IsDateString } from "class-validator"

export enum TransactionType {
  CREDIT = "Credit",
  DEBIT = "Debit",
}

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: "date" })
  @IsNotEmpty({ message: "Transaction data is required" })
  @IsDateString({}, { message: "Date must be in valid format" })
  date!: Date

  @Column({ type: "varchar", length: 500 })
  @IsNotEmpty({ message: "Description is required" })
  description!: string

  @Column({ type: "decimal", precision: 10, scale: 2 })
  @IsPositive({ message: "Value must be a positive number" })
  value!: number

  @Column({
    type: "enum",
    enum: TransactionType,
  })
  @IsIn([TransactionType.CREDIT, TransactionType.DEBIT], {
    message: "Type must be either Credit or Debit",
  })
  type!: TransactionType

  @CreateDateColumn()
  createAt!: Date
}
