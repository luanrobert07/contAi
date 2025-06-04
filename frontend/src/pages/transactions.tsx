import { OverviewMonthly } from "@/components/overviewMonthly";
import { Header } from "../components/header";

export function Transactions() {
  return (
    <div>
      <Header />
      <div className="w-[1280px]">
        <OverviewMonthly />
      </div>
      
    </div>
  )
}