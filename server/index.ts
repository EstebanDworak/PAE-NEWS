import * as debug from "debug";
import * as http from "http";
import * as bodyParser from "body-parser";
import * as express from "express";
import * as exphbs from "express-handlebars";
import * as logger from "morgan";
import * as path from "path";
import { config } from "dotenv";
import * as mongoose from "mongoose";
import * as passport from 'passport'
import {OAuth2Strategy as GoogleStrategy} from 'passport-google-oauth'
config();
// 581463894179-tejqse1s4t795unbruag0upnkc3o2br2.apps.googleusercontent.com
// tOC95xmP-iyfFkw-zIpkeKCM
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


// Create web server
const PORT = process.env.PORT || 3000;
app.set("port", PORT);
const server = http.createServer(app);
server.listen(PORT, () => {
  debug(`Listening on ${PORT}.`);
});

(async () => {
  await mongoose.connect(
    process.env.MONGO,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  );
  console.log("Connected to mongo DB");
})();


var userProfile;

app.use(passport.initialize());
app.use(passport.session());


// // Router configuration


app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

 
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://nameless-escarpment-75336.herokuapp.com/register/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));

app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });

app.use("/", Router);