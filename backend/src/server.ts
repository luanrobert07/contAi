<<<<<<< HEAD
import express from "express"
import { myDataSource } from "./app-data-source"

myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

const app = express()
app.use(express.json())

app.listen(3000)
=======
import 'reflect-metadata';
import express from 'express';


const app = express();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
>>>>>>> 8ab6821b92a0fe2447ff3a7334a3103afd7cb80a
