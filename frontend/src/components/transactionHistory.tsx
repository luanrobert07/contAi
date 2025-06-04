"use client"

import { useState } from "react"
import { TransactionTable } from "./transactionTable"
import { Calendar, ChevronUp, Filter } from "lucide-react";

interface Transaction {
  id: string
  date: string
  description: string
  value: number
  type: "Credit" | "Debit"
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "15/12/2024",
    description: "Client Payment - Invoice #1234",
    value: 2500.0,
    type: "Credit",
  },
  {
    id: "2",
    date: "12/12/2024",
    description: "Office Supplies Purchase",
    value: -150.0,
    type: "Debit",
  },
  {
    id: "3",
    date: "10/12/2024",
    description: "Software Subscription",
    value: -99.0,
    type: "Debit",
  },
  {
    id: "4",
    date: "28/11/2024",
    description: "Monthly Service Revenue",
    value: 3200.0,
    type: "Credit",
  },
  {
    id: "5",
    date: "25/11/2024",
    description: "Rent Payment",
    value: -1200.0,
    type: "Debit",
  },
]

export function TransactionHistory() {
  const [expandedMonths, setExpandedMonths] = useState<Record<"December 2024" | "November 2024", boolean>>({
    "December 2024": true,
    "November 2024": true,
  })

  const toggleMonth = (month: "December 2024" | "November 2024") => {
    setExpandedMonths((prev) => ({
      ...prev,
      [month]: !prev[month],
    }))
  }

  const getTransactionsByMonth = (month: string) => {
    if (month === "December 2024") {
      return mockTransactions.filter((t) => t.date.includes("/12/2024"))
    }
    if (month === "November 2024") {
      return mockTransactions.filter((t) => t.date.includes("/11/2024"))
    }
    return []
  }

  return (
    <div className="mt-3 mr-10 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            Transaction History
          </h2>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 flex items-center">
              <Filter size={24}  className="text-gray-400"  />
              Filter by:
            </button>
            <div className="flex items-center gap-2 text-gray-400 px-3 py-1.5 border border-gray-300 rounded-md">
              <span>--------- ----</span>
              <Calendar
              size={16}
              className=" text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <button
              onClick={() => toggleMonth("December 2024")}
              className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded"
            >
              <span className="font-medium text-gray-900">December 2024</span>
              <ChevronUp size={20} className="text-gray-400" />
            </button>

            {expandedMonths["December 2024"] && (
              <TransactionTable transactions={getTransactionsByMonth("December 2024")} month="December 2024" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
