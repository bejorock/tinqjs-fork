import { pipe } from "../pipe";
import { Add, Mul } from "./math";

const MulBy = (a: number) => async (b: number) => await Mul(a, b);
const Calculate = pipe(Add, MulBy(3), MulBy(5), MulBy(8), (x) => x + 5);
const Calculate2 = pipe(Mul, MulBy(2), MulBy(3));

(async () => {
  console.log(await Calculate2(2, 2));
  console.log(await Calculate(1, 2));
})().catch((err) => console.log(err));
