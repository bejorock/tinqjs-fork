export interface Future<T> {
  promise: Promise<T>;
  done: boolean;
  resolve: (item: T) => void;
  reject: (err: Error) => void;
}

export const createFuture = <T>(): Future<T> => {
  let resolver = null;
  let done = false;
  const promise = new Promise(
    (resolve, reject) => (resolver = { resolve, reject })
  ).finally(() => (done = true));

  return {
    promise,
    resolve: resolver.resolve,
    reject: resolver.reject,
    done,
  } as Future<T>;
};
