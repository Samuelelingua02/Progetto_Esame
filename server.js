
// express
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

//EJS//////
//app.set('view engine', 'ejs');

// Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '759412275936-j36b15qkpndslm139qcj50dsvv449vso.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);


// avvio server
let pageNotFound;
const PORT = process.env.PORT || 1337;


app.listen(PORT, function() {
    fs.readFile("./static/error.html", function(err, content) {
        if (err)
            content = "<h1>Risorsa non trovata</h1>"
        pageNotFound = content.toString();
    });
    console.log("Server running on port %s...",PORT);
});

// Middleware

//app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// middleware
app.use("/", bodyParser.json());
app.use("/", bodyParser.urlencoded({ extended: true }));

app.use("/", function(req, res, next) {
    console.log(">_ " + req.method + ": " + req.originalUrl);
    if (Object.keys(req.query).length != 0)
        console.log("Parametri GET: " + JSON.stringify(req.query));
    if (Object.keys(req.body).length != 0)
        console.log("Parametri BODY: " + JSON.stringify(req.body));
    next();
});

app.use("/", express.static('./static'));