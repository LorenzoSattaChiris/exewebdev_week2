/* ----- Loading Packages  ----- */
const express = require("express");
const dotenv = require("dotenv");

/* ----- Initial Configuration  ----- */
const app = express();

/* ----- Packages  ----- */
app.disable('x-powered-by');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
dotenv.config();

/* ----- Default Engine  ----- */
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/fonts'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));

/* ----- Loading Files  ----- */
const routes = require('./routes/routes.js');

/* ----- Static Website ----- */
app.use("/", routes);

/* ----- Server ----- */
// Catch-all route for 404 errors
app.use(function (req, res, next) {
    const error = new Error("Page Not Found");
    error.status = 404;
    next(error);
});

// Error handler middleware
app.use(function (error, req, res, next) {
    res.status(error.status || 500);
    res.send(error.message);
});

// Redirect to HTTPS
app.use(function (req, res, next) {
    if (req.secure) {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    next();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server is listening on:", port);
});