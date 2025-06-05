import { Header } from "../components/header";
import { TransactionForm } from "@/components/transactionForm";
import { TransactionHistory } from "@/components/transactionHistory";

export function Transactions() {
  return (
    <div>
      <Header />
      {/* <section className="max-w-[1280px] mx-auto">
        <OverviewMonthly />
      </section> */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TransactionForm />
          </div>
          <div className="lg:col-span-2">
            <TransactionHistory />
          </div>
      </div>
    </div>
  )
}