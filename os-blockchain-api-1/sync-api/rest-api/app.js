"use strict";

const {
    multer,
    bodyParser,
    cors,
    express,
    hfc,
    http,
    WebSocketServer
} = require("./imports.js")


const Metadata = require("./metadata.js");
const { User } = require("./user.js");
const utils = require("./utils.js");

const awaitHandler = utils.awaitHandler;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

hfc.addConfigFile("config.json");

// var host = "localhost";
var port = 3000;

var app = express();
app.options("*", cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(function (req, res, next) {
  return next();
});

var server = http.createServer(app).listen(port, function () {});
server.timeout = 240000;

/**
 *  Websocker server
 */
 const wss = new WebSocketServer.Server({ server });
 wss.on("connection", function connection(ws) {
   ws.on("message", function incoming(message) {
     console.log("##### Websocket Server received message: %s", message);
   });
 
   ws.send("something");
 });
  

/**
 * Rest APIs
 */

// Root
app.get(
  "/",
  awaitHandler(async (req, res) => {
    res.send("Hello");
    // res.sendStatus(200);
  })
);

// Health check - can be called by load balancer to check health of REST API
app.get(
  "/health",
  awaitHandler(async (req, res) => {
    res.sendStatus(200);
  })
);


// Register and enroll user. A user must be registered and enrolled before any queries
// or transactions can be invoked

// User endpoints
const user = new User(wss);

app.post("/enroll", awaitHandler(user.enroll));
app.get("/users/:username", awaitHandler(user.getuser));
app.post("/users", awaitHandler(user.create));

// Metadata endpoints
const metadata = new Metadata(user);

app.get("/access/:metadataId&:username", awaitHandler(metadata.access));

app.get("/metadata/:metadataId", awaitHandler(metadata.getmetadata));
app.patch("/metadata/:metadataId", (upload.single("file"), awaitHandler(metadata.update)));
app.post("/metadata", upload.single("file"), awaitHandler(metadata.upload));

app.get("/history/:metadataId", awaitHandler(metadata.gethistory));

app.get("/listmetadata", awaitHandler(metadata.listallmetadata));

app.get("/makeCopy", awaitHandler(metadata.makecopy));

app.post("/verify", upload.single("file"), awaitHandler(metadata.verify));

/************************************************************************************
 * Error handler
 ************************************************************************************/

app.use(function (error, req, res, next) {
  res.status(500).json({ error: error.toString() });
});
