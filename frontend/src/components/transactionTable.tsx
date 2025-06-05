import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

interface Transaction {
  id: string;
  date: string;
  description: string;
  value: number;
  type: "Credit" | "Debit";
}

interface Totals {
  credits: number;
  debits: number;
  net: number;
}

interface TransactionTableProps {
  transactions: Transaction[];
  month: string;
}

const monthMap: Record<string, number> = {
  Janeiro: 1,
  Fevereiro: 2,
  Março: 3,
  Abril: 4,
  Maio: 5,
  Junho: 6,
  Julho: 7,
  Agosto: 8,
  Setembro: 9,
  Outubro: 10,
  Novembro: 11,
  Dezembro: 12,
};


function getMonthYearFromString(monthYear: string): { month: number; year: number } | undefined {
  const [monthName, yearStr] = monthYear.split(" ");
  const month = monthMap[monthName];
  const year = Number(yearStr);
  if (!month || isNaN(year)) return undefined;
  return { month, year };
}

export function TransactionTable({ transactions, month }: TransactionTableProps) {
  const [totals, setTotals] = useState<Totals>({ credits: 0, debits: 0, net: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTotals() {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get("transaction/monthly/totals");

        interface MonthTotals {
          month: number;
          credits: number;
          debits: number;
          balance: number;
          year: number;
        }

        const monthYear = getMonthYearFromString(month);

        if (!monthYear) {
          setTotals({ credits: 0, debits: 0, net: 0 });
          setError("Formato de mês inválido");
          setLoading(false);
          return;
        }

        const monthTotals = response.data.data.find(
          (item: MonthTotals) =>
            item.month === monthYear.month && item.year === monthYear.year
        );

        if (monthTotals) {
          setTotals({
            credits: monthTotals.credits,
            debits: monthTotals.debits,
            net: monthTotals.balance,
          });
        } else {
          setTotals({ credits: 0, debits: 0, net: 0 });
        }
      } catch (err) {
        setError("Erro ao buscar os totais");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTotals();
  }, [month]);

  return (
    <div className="mt-2">
      <div className="grid grid-cols-4 gap-4 py-2 px-4 bg-gray-50 rounded text-sm font-medium text-gray-600">
        <div>Data</div>
        <div>Descrição</div>
        <div>Valor</div>
        <div>Tipo</div>
      </div>

      {transactions.length === 0 && !loading && !error && (
        <p className="text-sm text-gray-500 px-4 py-2">
          Nenhuma transação encontrada para este mês.
        </p>
      )}

      <div className="max-h-96 overflow-y-auto">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="grid grid-cols-4 gap-4 py-3 px-4 border-b border-gray-100"
          >
            <div className="text-sm text-gray-900">
              {new Date(transaction.date).toLocaleDateString("pt-BR")}
            </div>
            <div className="text-sm text-gray-900">{transaction.description}</div>
            <div
              className={`text-sm font-medium ${
                transaction.type === "Credit" ? "text-green-600" : "text-red-600"
              }`}
            >
              {transaction.value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <div>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.type === "Credit"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {transaction.type === "Credit" ? "Crédito" : "Débito"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded mt-2">
        {loading ? (
          <p>Carregando totais...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <div className="flex gap-6">
              <span className="text-sm text-green-600 font-medium">
                Créditos: +{totals.credits.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
              <span className="text-sm text-red-600 font-medium">
                Débitos: -{totals.debits.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
            <span
              className={`text-sm font-medium ${
                totals.net >= 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              Saldo: {totals.net.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
