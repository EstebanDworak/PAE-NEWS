import * as debug from "debug";
import * as http from "http";
import * as bodyParser from "body-parser";
import * as express from "express";
import * as exphbs from "express-handlebars";
import * as logger from "morgan";
import * as path from "path";
import {config} from 'dotenv'

config()

import Router from "./home";

const app = express();


app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

// Handlebars configuration
app.set("views", "client/views");
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: "client/views/layouts",
    partialsDir: "client/views/partials",
  })
);
app.set("view engine", ".hbs");


// Router configuration
const router = express.Router();
app.use("/", Router);

// Create web server
const PORT = process.env.PORT || 3000;
app.set("port", PORT);
const server = http.createServer(app);
server.listen(PORT,()=>{
  debug(`Listening on ${PORT}.`);
});

