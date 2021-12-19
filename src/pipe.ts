export const pipe =
  <T extends any[], R>(
    fn1: (...args: T) => Promise<R> | R,
    ...fns: Array<(a: R) => Promise<R> | R>
  ) =>
  async (...args: T): Promise<R> => {
    let result = await fn1(...args);

    for (let fn of fns) {
      result = await fn(result);
    }

    return result;
  };
