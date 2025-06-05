import express from "express"
import { json } from "body-parser"
import { transactionRoutes } from "./routes/routes"
import cors from "cors";
import { setupSwagger } from "./swagger";

export const app = express()
app.use(cors());

app.use(json())

app.use("/transaction", transactionRoutes)
setupSwagger(app)
app.get("/", (req, res) => {
  res.send("API is running")
})
