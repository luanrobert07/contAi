"use client"

import { useContext, useState, useMemo } from "react"
import { TransactionTable } from "./transactionTable"
import { ChevronUp, Filter } from 'lucide-react'
import { TransactionContext } from "@/contexts/transactionsCOntext" 

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
] as const

export function TransactionHistory() {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error("TransactionHistory must be used within a TransactionProvider")
  }
  const { transactions } = context

  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({})

  const toggleExpanded = (monthKey: string) => {
    setExpandedMonths(prev => ({
      ...prev,
      [monthKey]: !prev[monthKey]
    }))
  }

  const years = useMemo(() => {
    const uniqueYears = new Set<string>()
    
    transactions.forEach(transaction => {
      if (transaction.date) {
        const parts = transaction.date.split("/")
        if (parts.length >= 3 && parts[2]) {
          uniqueYears.add(parts[2])
        }
      }
    })
    
    return Array.from(uniqueYears).sort((a, b) => parseInt(b) - parseInt(a))
  }, [transactions])

  const allMonthKeys = useMemo(() => {
    const keys: string[] = []
    const yearsToShow = years.length > 0 ? years : [new Date().getFullYear().toString()]
    
    yearsToShow.forEach(year => {
      months.forEach(month => {
        keys.push(`${month.label} ${year}`)
      })
    })
    
    return keys.sort((a, b) => {
      const [aMonth, aYear] = a.split(" ")
      const [bMonth, bYear] = b.split(" ")
      
      const yearDiff = parseInt(bYear) - parseInt(aYear)
      if (yearDiff !== 0) return yearDiff
      
      const aMonthIndex = months.findIndex(m => m.label === aMonth)
      const bMonthIndex = months.findIndex(m => m.label === bMonth)
      return aMonthIndex - bMonthIndex
    })
  }, [years])

  const groupedTransactions = useMemo(() => {
    return transactions.reduce((groups, transaction) => {
      if (!transaction.date || typeof transaction.date !== "string") {
        console.warn("Transação com data inválida:", transaction)
        return groups
      }
      
      const dateParts = transaction.date.split("/")
      if (dateParts.length < 3 || !dateParts[1] || !dateParts[2]) {
        console.warn("Formato de data inválido:", transaction.date)
        return groups
      }
      
      const monthValue = dateParts[1]
      const year = dateParts[2]
      const month = months.find(m => m.value === monthValue)
      
      if (!month) {
        console.warn("Mês inválido na transação:", monthValue)
        return groups
      }
      
      const key = `${month.label} ${year}`
      if (!groups[key]) groups[key] = []
      groups[key].push(transaction)
      
      return groups
    }, {} as Record<string, Transaction[]>)
  }, [transactions])

  const filteredMonthKeys = useMemo(() => {
    if (selectedFilter === "all") return allMonthKeys
    
    const selectedMonth = months.find(m => m.value === selectedFilter)
    if (!selectedMonth) return allMonthKeys
    
    return allMonthKeys.filter(key => key.startsWith(selectedMonth.label))
  }, [selectedFilter, allMonthKeys])

  const filterOptions = useMemo(() => [
    { value: "all", label: "All" },
    ...months.map(month => ({ value: month.value, label: month.label }))
  ], [])

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
                aria-label="Filter transactions by month"
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
          {filteredMonthKeys.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No transactions available</p>
            </div>
          ) : (
            filteredMonthKeys.map((monthKey) => {
              const monthTransactions = groupedTransactions[monthKey] || []
              const isExpanded = expandedMonths[monthKey] ?? false

              return (
                <div key={monthKey}>
                  <button
                    onClick={() => toggleExpanded(monthKey)}
                    className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded"
                    aria-expanded={isExpanded}
                  >
                    <span className="font-medium text-gray-900">
                      {monthKey}
                      {monthTransactions.length === 0 && (
                        <span className="text-sm text-gray-400 font-normal ml-2">
                          (No transactions)
                        </span>
                      )}
                    </span>
                    <ChevronUp
                      size={20}
                      className={`text-gray-400 transition-transform ${isExpanded ? "rotate-0" : "rotate-180"}`}
                      aria-hidden="true"
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-2">
                      {monthTransactions.length > 0 ? (
                        <TransactionTable transactions={monthTransactions} month={monthKey} />
                      ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                          <p>No transactions for this period</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}