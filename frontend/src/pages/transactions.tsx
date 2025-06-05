import { Header } from "@/components/header";
import { TransactionForm } from "@/components/transactionForm";
import { TransactionHistory } from "@/components/transactionHistory";

export function Transactions() {
  return (
    <main>
      <Header userName={"Luanrobert"} userAvatarUrl="https://github.com/luanrobert07.png" />
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-label="Transaction area">
        <aside className="lg:col-span-1">
          <TransactionForm />
        </aside>
        <section className="lg:col-span-2">
          <TransactionHistory />
        </section>
      </section>
    </main>
  )
}
