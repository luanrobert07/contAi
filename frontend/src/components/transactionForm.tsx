"use client"

import { useContext, useState } from "react"
import DatePicker from "react-datepicker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import "react-datepicker/dist/react-datepicker.css"
import { TransactionContext } from "@/contexts/transactionsCOntext"

export function TransactionForm() {
  const { createTransaction } = useContext(TransactionContext)
  
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

    if (Object.values(newErrors).some(Boolean)) return

    try {
      await createTransaction({
        date,
        description,
        value: parsedValue.toString(),
        type: type as "Credit" | "Debit",
      })

      setDate(null)
      setDescription("")
      setAmount("")
      setType("")
      setErrors({ date: false, description: false, amount: false, type: false })

    } catch (error) {
      console.error("Erro ao criar transação:", error)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm md:ml-20 mt-3">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Plus size={20} color="blue" />
          Registrar Transação
        </h2>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-600 flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            Data da Transação
          </label>
          <div className="relative flex items-center">
            <DatePicker
              selected={date}
              onChange={setDate}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/aaaa"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10
                ${errors.date 
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}
              `}
            />
          </div>
          {errors.date && <p className="text-red-500 text-sm mt-1">Selecione uma data.</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-600 flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            Descrição
          </label>
          <textarea
            placeholder="Descrição da transação"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 min-h-[80px] resize-none
              ${errors.description 
                ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}
            `}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">Descrição é obrigatória.</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-600 flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            Valor
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
              ${errors.amount 
                ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}
            `}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">
              {amount.trim() === "" 
                ? "Valor é obrigatório" 
                : "Valor deve ser maior que zero"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-600 flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            Tipo de Transação
          </label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger
              className={`w-full border rounded-md
                ${errors.type ? "border-red-500" : "border-gray-300"}
              `}
            >
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Credit">Crédito</SelectItem>
              <SelectItem value="Debit">Débito</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-red-500 text-sm mt-1">Selecione um tipo.</p>}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Adicionar Transação
        </button>
      </div>
    </div>
  )
}