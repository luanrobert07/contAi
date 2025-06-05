"use client"

import { useContext, useState, useMemo, useCallback } from "react"
import { TransactionTable } from "./transactionTable"
import { ChevronUp, Filter } from 'lucide-react'
import { TransactionContext } from "@/contexts/transactionContext"

interface Transaction {
  id: string
  date: string
  description: string
  value: number
  type: "Credit" | "Debit"
}

const months = [
  { value: "01",  labelPt: "Janeiro" },
  { value: "02",  labelPt: "Fevereiro" },
  { value: "03",  labelPt: "Março" },
  { value: "04",  labelPt: "Abril" },
  { value: "05",  labelPt: "Maio" },
  { value: "06",  labelPt: "Junho" },
  { value: "07",  labelPt: "Julho" },
  { value: "08",  labelPt: "Agosto" },
  { value: "09",  labelPt: "Setembro" },
  { value: "10",  labelPt: "Outubro" },
  { value: "11",  labelPt: "Novembro" },
  { value: "12",  labelPt: "Dezembro" },
] as const

const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/

export function TransactionHistory() {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error("TransactionHistory must be used within a TransactionProvider")
  }
  const { transactions } = context

  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>("all")
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>("all")
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({})

  const toggleExpanded = useCallback((monthKey: string) => {
    setExpandedMonths(prev => ({
      ...prev,
      [monthKey]: !prev[monthKey]
    }))
  }, [])

  const years = useMemo(() => {
    const uniqueYears = new Set<string>()
    transactions.forEach(({ date }) => {
      if (dateRegex.test(date)) {
        const year = date.split("/")[2]
        uniqueYears.add(year)
      }
    })
    return Array.from(uniqueYears).sort((a, b) => parseInt(b) - parseInt(a))
  }, [transactions])

  const allMonthKeys = useMemo(() => {
    const yearsToShow = selectedYearFilter !== "all" ? [selectedYearFilter] : (years.length > 0 ? years : [new Date().getFullYear().toString()])
    const keys: string[] = []
    yearsToShow.forEach(year => {
      months.forEach(month => {
        keys.push(`${month.value}-${year}`)
      })
    })

    return keys.sort((a, b) => {
      const [aMonth, aYear] = a.split("-").map(Number)
      const [bMonth, bYear] = b.split("-").map(Number)
      if (bYear !== aYear) return bYear - aYear
      return bMonth - aMonth
    })
  }, [years, selectedYearFilter])

  const groupedTransactions = useMemo(() => {
    return transactions.reduce((groups, transaction) => {
      if (!transaction.date || !dateRegex.test(transaction.date)) {
        console.warn("Transação com data inválida:", transaction)
        return groups
      }
      const [, month, year] = transaction.date.split("/")
      const key = `${month}-${year}`
      if (!groups[key]) groups[key] = []
      groups[key].push(transaction)
      return groups
    }, {} as Record<string, Transaction[]>)
  }, [transactions])

  const filteredMonthKeys = useMemo(() => {
    if (selectedMonthFilter === "all") return allMonthKeys
    return allMonthKeys.filter(key => key.startsWith(selectedMonthFilter))
  }, [selectedMonthFilter, allMonthKeys])

  const monthFilterOptions = useMemo(() => [
    { value: "all", label: "Todos os meses" },
    ...months.map(month => ({ value: month.value, label: month.labelPt }))
  ], [])

  const yearFilterOptions = useMemo(() => [
    { value: "all", label: "Todos os anos" },
    ...years.map(year => ({ value: year, label: year }))
  ], [years])

  return (
    <div className="mt-3 md:mr-10 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            Histórico de Transações
          </h2>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <label htmlFor="month-filter" className="sr-only">Filtrar por mês</label>
              <select
                id="month-filter"
                className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white"
                value={selectedMonthFilter}
                onChange={(e) => setSelectedMonthFilter(e.target.value)}
                aria-label="Filtrar transações por mês"
              >
                {monthFilterOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 flex items-center gap-2">
              <label htmlFor="year-filter" className="sr-only">Filtrar por ano</label>
              <select
                id="year-filter"
                className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white"
                value={selectedYearFilter}
                onChange={(e) => setSelectedYearFilter(e.target.value)}
                aria-label="Filtrar transações por ano"
              >
                {yearFilterOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
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
              <p>Nenhuma transação disponível</p>
            </div>
          ) : (
            filteredMonthKeys.map((monthKey) => {
              const monthTransactions = groupedTransactions[monthKey] || []
              const isExpanded = expandedMonths[monthKey] ?? false
              
              const isDisabled = monthTransactions.length === 0

              const [monthValue, yearValue] = monthKey.split("-")
              const monthObj = months.find(m => m.value === monthValue)
              const monthLabel = monthObj ? monthObj.labelPt : monthValue

              return (
                <div key={monthKey}>
                  <button
                    onClick={() => !isDisabled && toggleExpanded(monthKey)}
                    className={`flex items-center justify-between w-full p-2 rounded
                      ${isDisabled ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}
                    `}
                    aria-expanded={isExpanded}
                    disabled={isDisabled}
                  >
                    <span className="font-medium text-gray-900">
                      {monthLabel} {yearValue}
                      {isDisabled && (
                        <span className="text-sm text-gray-400 font-normal ml-2">(Sem transações)</span>
                      )}
                    </span>
                    {!isDisabled && (
                      <ChevronUp
                        size={20}
                        className={`text-gray-400 transition-transform ${isExpanded ? "rotate-0" : "rotate-180"}`}
                        aria-hidden="true"
                      />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-2">
                      <TransactionTable transactions={monthTransactions} month={`${monthLabel} ${yearValue}`} />
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
