"use client"

import { useEffect, useState } from "react"
import { TransactionTable } from "./transactionTable"
import { ChevronUp, Filter } from 'lucide-react'

interface Transaction {
  id: string
  date: string 
  description: string
  value: number
  type: "Credit" | "Debit"
}

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
]

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({})

  const toggleExpanded = (monthKey: string) => {
    setExpandedMonths(prev => ({
      ...prev,
      [monthKey]: !prev[monthKey]
    }))
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("http://localhost:3000/transaction")
        const json = await res.json()

        const formatted = json.data.map((t: { id: number; date: string; description: string; value: string; type: "Credit" | "Debit" }): Transaction => {
          const [year, month, day  ] = t.date.split("-")
          return {
            id: String(t.id),
            date: `${day}/${month}/${year}`,
            description: t.description,
            value: parseFloat(t.value),
            type: t.type,
          }
        })

        setTransactions(formatted)

      } catch (err) {
        console.error("Erro ao carregar transações:", err)
      }
    }

    fetchTransactions()
  }, [])

  const years = Array.from(
    new Set(transactions.map((t) => t.date.split("/")[2]))
  ).sort((a, b) => parseInt(b) - parseInt(a))

  const getAllMonthKeys = () => {
    const allKeys: string[] = []
    
    const yearsToShow = years.length > 0 ? years : [new Date().getFullYear().toString()]
    
    yearsToShow.forEach(year => {
      months.forEach(month => {
        allKeys.push(`${month.label} ${year}`)
      })
    })
    
    return allKeys.sort((a, b) => {
      const [monthA, yearA] = a.split(" ")
      const [monthB, yearB] = b.split(" ")
    
      if (yearA !== yearB) {
        return parseInt(yearA) - parseInt(yearB)
      }
    
      const monthIndexA = months.findIndex(m => m.label === monthA)
      const monthIndexB = months.findIndex(m => m.label === monthB)
    
      return monthIndexA - monthIndexB 
    })    
  }

  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const [, month, year] = transaction.date.split("/")
    const monthLabel = months.find(m => m.value === month)?.label || ""
    const key = `${monthLabel} ${year}`

    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(transaction)
    
    return groups
  }, {} as Record<string, Transaction[]>)

  const allMonthKeys = getAllMonthKeys()

  const getFilteredMonthKeys = () => {
    if (selectedFilter === "all") {
      return allMonthKeys
    }
    
    const selectedMonthLabel = months.find(m => m.value === selectedFilter)?.label
    if (!selectedMonthLabel) return allMonthKeys
    
    return allMonthKeys.filter(key => key.startsWith(selectedMonthLabel))
  }

  const filteredMonthKeys = getFilteredMonthKeys()

  const filterOptions = [
    { value: "all", label: "All" },
    ...months.map(month => ({ value: month.value, label: month.label }))
  ]

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
            <div className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <span>Filter by:</span>
              <select
                className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {filteredMonthKeys.map((monthKey) => {
            const monthTransactions = groupedTransactions[monthKey] || []
            const isExpanded = expandedMonths[monthKey] ?? false

            return (
              <div key={monthKey}>
                <button
                  onClick={() => toggleExpanded(monthKey)}
                  className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded"
                >
                  <span className="font-medium text-gray-900">
                    {monthKey} {monthTransactions.length === 0 && (
                      <span className="text-sm text-gray-400 font-normal">
                        (No transactions)
                      </span>
                    )}
                  </span>
                  <ChevronUp
                    size={20}
                    className={`text-gray-400 transition-transform duration-200 ${
                      isExpanded ? "rotate-0" : "rotate-180"
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="mt-2">
                    {monthTransactions.length > 0 ? (
                      <TransactionTable
                        transactions={monthTransactions}
                        month={monthKey}
                      />
                    ) : (
                      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        <p>No transactions for this month.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
