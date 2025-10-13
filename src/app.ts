import express from "express"
import cors from "cors"
import { router } from "./infrastructure/http/routers"
import { ErrorHandling } from "./infrastructure/http/middlewares/ErrorHandling" 

export const app = express()
app.use(cors())
app.use(express.json())
app.use(router)
app.use(ErrorHandling)