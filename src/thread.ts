import { Worker, isMainThread, workerData, parentPort } from "worker_threads";
import path from "path";
import { createFuture } from "./future";

let fnCounter = 1;

const execMain = async <T extends any[], R>(
  filename: string,
  fnName: string,
  ...args: T
): Promise<R> => {
  let objects = args.filter((arg) => typeof arg === "object");

  const future = createFuture<R>();

  const worker = new Worker(filename, {
    argv: [filename, fnName],
    workerData: args,
    transferList: [...objects],
  });

  worker.on("online", () => {
    console.log(`[${path.basename(filename, ".js")}.${fnName}] Worker online`);
  });

  worker.on("message", (message) => {
    if (!future.done) future.resolve(message);
  });

  worker.on("exit", (err) => {
    if (!future.done) future.resolve(undefined);

    console.log(`[${path.basename(filename, ".js")}.${fnName}] Worker exit`);
  });

  return future.promise;
};

const execWorker = async (fn: Function) => {
  const args = [...workerData];

  const result = await fn(...args);

  if (result) parentPort.postMessage(result);

  process.nextTick(() => process.exit());
};

export const thread = (filename: string) => {
  return <T extends any[], R>(fn: (...args: T) => R) => {
    const fnName = fn.name || `anonymous${fnCounter++}`;
    const [, , filename_, fnName_] = process.argv;

    if (filename === filename_ && fnName === fnName_) {
      execWorker(fn).catch((err) => {
        console.log(err);
      });
    }

    return (...args: T) => execMain(filename, fnName, ...args) as Promise<R>;
  };
};
