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
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

function getMonthNumberFromString(monthYear: string): number | undefined {
  const monthName = monthYear.split(" ")[0]; 
  return monthMap[monthName]; 
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

        const monthNumber = getMonthNumberFromString(month);

        if (monthNumber === undefined) {
          setTotals({ credits: 0, debits: 0, net: 0 });
          setError("Invalid month format");
          setLoading(false);
          return;
        }

        const monthTotals = response.data.data.find(
          (item: MonthTotals) => item.month === monthNumber
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
        setError("Failed to fetch totals");
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
        <div>Date</div>
        <div>Description</div>
        <div>Amount</div>
        <div>Type</div>
      </div>

      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="grid grid-cols-4 gap-4 py-3 px-4 border-b border-gray-100"
        >
          <div className="text-sm text-gray-900">{transaction.date}</div>
          <div className="text-sm text-gray-900">{transaction.description}</div>
          <div
            className={`text-sm font-medium ${
              transaction.type === "Credit" ? "text-green-600" : "text-red-600"
            }`}
          >
            {transaction.value.toFixed(2)}
          </div>
          <div>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                transaction.type === "Credit"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {transaction.type}
            </span>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded mt-2">
        {loading ? (
          <p>Loading totals...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <div className="flex gap-6">
              <span className="text-sm text-green-600 font-medium">
                Credits: +${totals.credits.toFixed(2)}
              </span>
              <span className="text-sm text-red-600 font-medium">
                Debits: -${totals.debits.toFixed(2)}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              Balance: ${totals.net.toFixed(2)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}