<h1 align="center">
    💰 ContAI
</h1>

<h4 align="center"> 
	🚀 Accounting Entry Management System 📊 Completed with Docker, Deployment & Validations ✅
</h4>

---

## 💻 About the Project

📘 **ContAI** is a **fullstack** application developed as a technical challenge, aimed at optimizing the process of recording and viewing accounting entries.  
The platform registers financial transactions and displays them in a table organized by month, enabling efficient financial management.  
Features include data validation, database persistence, and monthly summaries for accounting analysis and strategic decisions.

**Technologies:**
- **Frontend:** React + TypeScript
- **Backend:** Express + TypeScript + TypeORM
- **Database:** PostgreSQL with Docker
- **Deployment:** Vercel (Frontend) + Render (Backend)
- **Design:** Figma
- **Documentation:** Swagger

---

## ⚙️ Features

- [x] Financial transaction registration
- [x] Comprehensive field validations
- [x] Transaction table grouped by month/year
- [x] Monthly credit/debit totals
- [x] Dockerized PostgreSQL database
- [x] Frontend deployment (Vercel)
- [x] Backend deployment (Render)
- [x] Modular, clean, documented code
- [x] Complete README

---

## 🌐 Live Demo

Access the deployed application:
- **Frontend:** [https://cont-ai.vercel.app/](https://cont-ai-five.vercel.app/)
- **Backend API:** [https://cont-ai.onrender.com](https://contai.onrender.com)

---

## 📷 Interface Design
View the complete design on [Figma](https://www.figma.com/design/bC3YtUpQGiN1Jh3P1PeDq5/contaAi?node-id=1-669&t=4sDoM81IHIUYuSgX-0)

---

## 🛠 Prerequisites

- [Node.js ≥16](https://nodejs.org/)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) or [Yarn](https://yarnpkg.com/getting-started/install)
- [Docker](https://docs.docker.com/get-docker/)
- [Git](https://git-scm.com/downloads)

---

## 📚 Documentação da API

A documentação está disponível via Swagger.  
➡️ [Acesse aqui o Swagger UI](http://localhost:3000/api-docs)

> Certifique-se de que o servidor está rodando antes de acessar.


## 🚀 Local Installation

### 1. Clone repository
```bash
git clone https://github.com/luanrobert07/contAi.git
```

### 2. Install deppendency backend
```bash
cd backend
npm install
```

### 3. Start Database, run migrations and start backend server
```bash
docker-compose up -d
npm run migration:run
npm run dev
```

### 4. Install deppendency frontend
```bash
cd ../frontend
npm install
npm start 
```
