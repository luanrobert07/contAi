import React, { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { TransactionContext } from "./transactionContext";
import { formatDateToDDMMYYYY } from "@/utils/date";  // <-- aqui a importação

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

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  async function createTransaction(data: CreateTransactionData) {
    const { date, description, value, type } = data;

    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue) || parsedValue <= 0) {
      console.error("Valor inválido:", value);
      return;
    }

    try {
      const response = await api.post("transaction", {
        date: date ? formatDateToDDMMYYYY(date) : null,
        description,
        value: parsedValue,
        type,
      });

      const resJson = response.data;

      if (!resJson.data) {
        console.error("Resposta da API não contém dados da transação:", resJson);
        return;
      }

      const newTransactionFromAPI = resJson.data;

      const dateObj = new Date(newTransactionFromAPI.date);
      const formattedDate = formatDateToDDMMYYYY(dateObj);

      const newTransaction: Transaction = {
        id: String(newTransactionFromAPI.id),
        date: formattedDate,
        description: newTransactionFromAPI.description,
        value: newTransactionFromAPI.value,
        type: newTransactionFromAPI.type,
      };

      setTransactions((state) => [...state, newTransaction]);
    } catch (error) {
      console.error("Erro na requisição de criação:", error);
    }
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      console.log("Buscando transações...");

      try {
        const response = await api.get("transaction");
        const json = response.data;

        if (!json.data || !Array.isArray(json.data)) {
          console.error("Resposta inesperada do servidor:", json);
          return;
        }

        const formatted = json.data.map(
          (t: {
            id: number;
            date: string;
            description: string;
            value: string;
            type: "Credit" | "Debit";
          }): Transaction => {
            const [year, month, day] = t.date.split("-");
            return {
              id: String(t.id),
              date: `${day}/${month}/${year}`,
              description: t.description,
              value: parseFloat(t.value),
              type: t.type,
            };
          }
        );

        setTransactions(formatted);
        console.log("Transações carregadas:", formatted);
      } catch (err) {
        console.error("Erro ao carregar transações:", err);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <TransactionContext.Provider value={{ transactions, createTransaction }}>
      {children ?? <p>Nenhum conteúdo carregado.</p>}
    </TransactionContext.Provider>
  );
}
