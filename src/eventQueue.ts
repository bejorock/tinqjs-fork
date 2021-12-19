import EventEmitter from "events";

export interface EventQueue<T> {
  next: () => AsyncGenerator<T, never, unknown>;
  append: (item: T) => void;
  close: () => void;
}

const createQueueSource =
  <T>(mainEvent: EventEmitter) =>
  (data: T[]) => {
    return async function* () {
      while (true) {
        await new Promise((resolve, reject) => {
          mainEvent.once("push", (queueState) => {
            if (!queueState.end) resolve(true);
            else reject(false);
          });
        });

        // console.log("receive push");
        while (data.length > 0) {
          // console.log("pull data");
          yield data[0];

          data.shift();
        }
      }
    };
  };

const appendToQueue = (mainEvent: EventEmitter, data: any[]) => (item) => {
  data.push(item);

  mainEvent.emit("push", { end: false });
};

const closeQueue = (mainEvent: EventEmitter) => () => {
  mainEvent.emit("push", { end: true });
};

export const createQueue = <T>(initialData: T[] = []): EventQueue<T> => {
  const data = [...initialData];
  const mainEvent = new EventEmitter();

  const queueSource = createQueueSource<T>(mainEvent);

  return {
    next: queueSource(data),
    append: appendToQueue(mainEvent, data),
    close: closeQueue(mainEvent),
  };
};
