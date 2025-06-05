import { createContext } from "react";

interface Transaction {
  id: string;
  date: string;
  description: string;
  value: number;
  type: "Credit" | "Debit";
}

interface CreateTransactionData {
  date: Date | null;
  description: string;
  value: string;
  type: "Credit" | "Debit";
}

interface TransactionContextType {
  transactions: Transaction[];
  createTransaction: (data: CreateTransactionData) => Promise<void>;
}

export const TransactionContext = createContext<TransactionContextType>({} as TransactionContextType);
