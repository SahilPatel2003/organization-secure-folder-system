const http = require("http");
const { join } = require("path");
require("dotenv").config(join(__dirname));

const Router = require("./router");

const router = new Router();

const initiateRouter = require("./rest-router");
const restRouter = new initiateRouter(router);

const callServer = restRouter.init();
http.createServer(callServer).listen(3006, () => {
  console.log("server is started on 3006 ");
});
