import { Request, Response, NextFunction } from "express";
import { AppError } from "@/shared/utils/AppError";

export function ErrorHandling (error: any, request: Request, response: Response, next: NextFunction) {
   if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message })
  }

  if (error.status === 429) {
    return response.status(429).json({ message: `Agente AI: ${error.message}` })
  }

  response.status(500).json({ message: error.message, error: error.meta })
}