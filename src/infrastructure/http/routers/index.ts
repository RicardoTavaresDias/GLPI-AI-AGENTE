import { Router } from "express";
import { Container } from "@/container";
import { Authenticated } from "../middlewares/Authenticated";

const container = new Container()
export const router = Router()

router.post("/", Authenticated, container.serviceAgenteGLPIController.postHandler)