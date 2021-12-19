# TinJs Fp Utilities

Tiny libs to handle concurrency and threads in javascript. Simplifying javascript thread call to be more organic.

## Features

- Blocking Event Queue [V]
- Future (Java Like Promise) [V]
- Pipe (FP Left to Right Composition) [V]
- Compose (FP Right to Left Composition) [X]
- Thread [V]

## Installation

```js
npm install @tinqjs/tinjs-fork
```

## Documentations

Blocking event queue

```js
import { createQueue } from "@tinqjs/tinjs-fork";

const queue = createQueue();

// sending item to queue
queue.send("foo");
queue.send("bar");

// await receive from queue
for await (let message of queue.receive()) {
  console.log(message);
}

// close queue
queue.close();
```

Future

```js
import { createFuture } from "@tinqjs/tinjs-fork";

const future = createFuture();

// using future promise
future.promise
  .then((result) => console.log(result))
  .catch((err) => console.log(err));

// resolve future
future.resolve("foo");

// reject future
future.reject(new Error("bar error"));
```

Pipe (Function Composition)

```js
import { pipe } from "@tinqjs/tinjs-fork";
import { Add, Mul } from "./math";

const MulBy = (a: number) => async (b: number) => await Mul(a, b);
const Calculate = pipe(Add, MulBy(3), MulBy(5), MulBy(8), (x) => x + 5);
const Calculate2 = pipe(Mul, MulBy(2), MulBy(3));

(async () => {
  console.log(await Calculate2(2, 2));
  console.log(await Calculate(1, 2));
})().catch((err) => console.log(err));
```

Compose (Function Composition)

~~not yet available~~

Thread

```js
import { thread } from "@tinqjs/tinjs-fork";

const run = thread(__filename);

export const Add = run((a: number, b: number) => a + b);

export const Mul = run((a: number, b: number) => a * b);
```

## Samples

Run samples

```sh
git clone https://github.com/bejorock/tinqjs-fork.git

cd tinqjs-fork

yarn install

node ./dist/example/runner.js
```
