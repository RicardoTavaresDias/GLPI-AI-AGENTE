import { Request, Response, NextFunction } from "express";
import { Container } from "@/container";

const container = new Container()

export async function Authenticated (request: Request, response: Response, next: NextFunction) {
  const sessionExist = container.session.getSessionToken()

  if (sessionExist === "") {
    const login = await container.authRepository.login()

    if(Array.isArray(login)) {
      return response.status(500).json({ message: login[1] })
    }

    container.session.setSessionToken(login.session_token)
  }

  next()
}