import { TransactionProvider } from "./contexts/transactionProvider";
import { Transactions } from "./pages/transactions";

export function App() {
  return (
    <TransactionProvider>
      <div className="min-h-screen bg-gray-50">
        <Transactions />
      </div>
    </TransactionProvider>
  );
}
