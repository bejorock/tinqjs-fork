import { thread } from "../thread";

const run = thread(__filename);

export const Add = run((a: number, b: number) => a + b);

export const Mul = run((a: number, b: number) => a * b);
