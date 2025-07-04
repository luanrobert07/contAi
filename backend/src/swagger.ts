import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import { Express } from "express"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Transaction API",
      version: "1.0.0",
      description: "API to manage financial transactions",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
}

const swaggerSpec = swaggerJSDoc(options)

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
