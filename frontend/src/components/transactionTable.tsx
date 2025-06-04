interface Transaction {
  id: string
  date: string
  description: string
  value: number
  type: "Credit" | "Debit"
}

interface TransactionTableProps {
  transactions: Transaction[]
  month: string
}

export function TransactionTable({ transactions }: TransactionTableProps) {

  return (
    <div className="mt-2">
      <div className="grid grid-cols-4 gap-4 py-2 px-4 bg-gray-50 rounded text-sm font-medium text-gray-600">
        <div>Date</div>
        <div>Description</div>
        <div>Amount</div>
        <div>Type</div>
      </div>

      {transactions.map((transaction) => (
        <div key={transaction.id} className="grid grid-cols-4 gap-4 py-3 px-4 border-b border-gray-100">
          <div className="text-sm text-gray-900">{transaction.date}</div>
          <div className="text-sm text-gray-900">{transaction.description}</div>
          <div className={`text-sm font-medium ${transaction.type === "Credit" ? "text-green-600" : "text-red-600"}`}>
            {transaction.value}
          </div>
          <div>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                transaction.type === "Credit" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {transaction.type}
            </span>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded mt-2">
        <div className="flex gap-6">
          <span className="text-sm text-green-600 font-medium">
            Credits: +$
          </span>
          <span className="text-sm text-red-600 font-medium">
            Debits: -$
          </span>
        </div>
        <span className="text-sm font-medium text-gray-900">
          Net: +$
        </span>
      </div>
    </div>
  )
}
