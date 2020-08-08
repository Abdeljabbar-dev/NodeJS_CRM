// require("source-map-support").install();
const http = require("http");
const nconf = require("nconf");
console.log(process.env.NODE_ENV);
nconf.env().file({
  file: `config/${
    process.env.NODE_ENV === "prod"
      ? "prod"
      : process.env.NODE_ENV === "development"
      ? "test"
      : "dev"
  }.json`
});
const App = require("./app");
const port = nconf.get("common:port");
console.log("App connected in the port N   :   ", port);
// App.set("port", port);

const server = http.createServer(App);
// const http = require("http");
server.listen(port);

server.on("error", onError);
server.on("listening", onListening);

function onError(error) {
  // console.log("onError    ####    :   ", error);
  // return;
  if (error.syscall !== "listen") throw error;
  let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  let addr = server.address();
  console.log("onListening   ####  addr   :   ", addr);
}
