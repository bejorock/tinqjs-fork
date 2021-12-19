const { Worker, MessageChannel } = require("worker_threads");

const { port1, port2 } = new MessageChannel();

const worker = new Worker("./worker1.js", {
  workerData: [port2],
  transferList: [port2],
});

worker.on("message", (value) => {
  console.log("fafafa", value);
});

// setTimeout(() => {}, 1000);
setInterval(() => {
  port1.postMessage("hello");
}, 1000);
