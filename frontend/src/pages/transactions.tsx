import { OverviewMonthly } from "@/components/overviewMonthly";
import { Header } from "../components/header";
import { TransactionForm } from "@/components/transactionForm";

export function Transactions() {
  return (
    <div>
      <Header />
      <div className="w-[1280px]">
        <OverviewMonthly />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TransactionForm />
          </div>
          {/* <div className="lg:col-span-2">
            <TransactionHistory />
          </div> */}
        </div>
      
    </div>
  )
}