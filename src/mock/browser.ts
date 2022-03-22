import { setupWorker } from "msw";
import combineHandlers from "./combineHandlers";

export const worker = setupWorker(...combineHandlers);
