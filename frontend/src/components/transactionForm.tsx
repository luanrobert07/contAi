"use client"

import { useState } from "react"
import DatePicker from "react-datepicker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus } from "lucide-react"
import "react-datepicker/dist/react-datepicker.css"

export function TransactionForm() {
  const [date, setDate] = useState<Date | null>(null)
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState("")

  const [errors, setErrors] = useState({
    date: false,
    description: false,
    amount: false,
    type: false,
  })

  function formatDateToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const handleSubmit = async () => {
    const newErrors = {
      date: !date,
      description: description.trim() === "",
      amount: amount.trim() === "",
      type: type === "",
    }

    const parsedValue = parseFloat(amount)
    if (isNaN(parsedValue) || parsedValue <= 0) {
      newErrors.amount = true
    }

    setErrors(newErrors)

    const hasError = Object.values(newErrors).some(Boolean)
    if (hasError) return

    try {
      const response = await fetch("http://localhost:3000/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: date ? formatDateToDDMMYYYY(date) : null,
          description,
          value: parsedValue,
          type,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Error response from backend:", data)
        return
      }

      console.log("Success response from backend:", data)

      setDate(null)
      setDescription("")
      setAmount("")
      setType("")
      setErrors({ date: false, description: false, amount: false, type: false })

    } catch (error) {
      console.error("Network error:", error)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm md:ml-20 mt-3">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Plus size={20} color="blue" className="title-icon" />
          Register Transaction
        </h2>
      </div>
      <div className="p-6 space-y-4">

        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-600 flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            Transaction Date
          </label>
          <div className="relative flex items-center">
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-blue-500 pr-10
                ${errors.date ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500"}
              `}
            />
            <Calendar
              size={16}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
          </div>
          {errors.date && <p className="text-red-500 text-sm mt-1">Please select a date.</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-600 flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            Description
          </label>
          <textarea
            placeholder="Enter transaction description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-blue-500 min-h-[80px] resize-none
              ${errors.description ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500"}
            `}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">Description cannot be empty.</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-600 flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            Amount
          </label>
          <input
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-blue-500
              ${errors.amount ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500"}
            `}
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">Amount cannot be empty or invalid.</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-600 flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            Transaction Type
          </label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger
              className={`w-full border rounded-md
                ${errors.type ? "border-red-500" : "border-gray-300"}
              `}
            >
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Credit">Credit</SelectItem>
              <SelectItem value="Debit">Debit</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-red-500 text-sm mt-1">Please select a transaction type.</p>}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
        >
          <Plus size={20} color="white" className="title-icon" />
        </button>
      </div>
    </div>
  )
}
