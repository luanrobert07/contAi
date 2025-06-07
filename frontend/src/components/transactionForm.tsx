"use client"

import { useContext } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TransactionContext } from "@/contexts/transactionContext"
import DatePicker from "react-datepicker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import "react-datepicker/dist/react-datepicker.css"
import { z } from "zod"
import { transactionFormSchema } from "@/schemas/transactionFormSchema"

type TransactionFormInputs = z.infer<typeof transactionFormSchema>

export function TransactionForm() {
  const { createTransaction } = useContext(TransactionContext)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TransactionFormInputs>({
    resolver: zodResolver(transactionFormSchema),
  })

  const onSubmit = async (data: TransactionFormInputs) => {
    try {
      await createTransaction({
        date: data.date,
        description: data.description,
        value: data.amount.toString(),
        type: data.type,
      })
      reset()
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

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-600 flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            Data da Transação
          </label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                placeholderText="dd/mm/aaaa"
                selected={field.value}
                onChange={field.onChange}
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
                  ${errors.date ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
              />
            )}
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-600 flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            Descrição
          </label>
          <textarea
            {...register("description")}
            placeholder="Descrição da transação"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-none min-h-[80px]
              ${errors.description ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-600 flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            Valor
          </label>
          <input
            {...register("amount", { valueAsNumber: true })}
            type="number"
            placeholder="0.00"
            min={0.01}
            step={0.01}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
              ${errors.amount ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-600 flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            Tipo de Transação
          </label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value || ""}
              >
                <SelectTrigger
                  className={`w-full border rounded-md
                    ${errors.type ? "border-red-500" : "border-gray-300"}`}
                >
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Credit">Crédito</SelectItem>
                  <SelectItem value="Debit">Débito</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md flex items-center justify-center transition-colors
            ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
        >
          <Plus size={20} className="mr-2" />
          {isSubmitting ? "Adicionando..." : "Adicionar Transação"}
        </button>
      </form>
    </div>
  )
}
