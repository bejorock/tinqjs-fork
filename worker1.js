const { workerData, parentPort } = require("worker_threads");

parentPort.postMessage("dfdfdfd");

workerData[0].on("message", (message) => {
  console.log(message);
});
