"use strict"
const fs = require('fs');
const ERRORS = require('errors');
const cookieParser = require('cookie-parser')
const HTTPS = require('https');

// code 600 - database connection error
ERRORS.create({
    code: 600,
    name: 'DB_CONNECTION',
    defaultMessage: 'An error occured when connecting to database'
});

// code 601 - query execution error
ERRORS.create({
    code: 601,
    name: 'QUERY_EXECUTE',
    defaultMessage: 'An error occured during the query execution'
});

// mongo
const MONGO_CLIENT = require("mongodb").MongoClient;
const CONNECTION_STRING = 'mongodb://127.0.0.1:27017';
const CONNECTION_OPTIONS = {
    useNewUrlParser: true,
    //useUnifiedTopology: true
};

// express
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { create } = require('errors');

//EJS
//app.set('view engine', 'ejs');

// Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '759412275936-lgq1qlsiq1ap6s9b1j7punmemeacdtig.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

// Online RSA Key Generator
const privateKey = fs.readFileSync("keys/private.key", "utf8");
const certificate = fs.readFileSync("keys/certificate.crt", "utf8");
const credentials = {"key":privateKey, "cert":certificate};

// avvio server
const TIMEOUT = 300; // 60 SEC
let pageNotFound;
let port = 1337;

var httpsServer = HTTPS.createServer(credentials, app);
httpsServer.listen(port, '127.0.0.1', function() {
    fs.readFile("./static/error.html", function(err, content) {
        if (err)
            content = "<h1>Risorsa non trovata</h1>"
        pageNotFound = content.toString();
    });
    console.log("Server running on port %s...",port);
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

function createToken(obj) {
   let token = jwt.sign({
            '_id': obj._id,
            'user': obj.user,
            'iat': obj.iat || Math.floor(Date.now() / 1000),
			'exp': obj.exp || Math.floor(Date.now() / 1000 + TIMEOUT)
        },
        privateKey
    );
    return token;
}

function controllaToken(req,res) {  
    let ctrlToken={allow:false,payload:{}};
    // lettura token
    const token = req.headers["token"].split(' ')[1];
    console.log(token + " - " + typeof(token));
    if(token != "null"){
        jwt.verify(token, privateKey, function(err,data){
            ctrlToken.allow=true;
            if(!err)
                ctrlToken.payload=data;
            else
                ctrlToken.payload={"err_iat":true,"message":"Token scaduto"};
        });
    }
    return ctrlToken;
}

app.post('/login', (req,res)=>{
    let token = req.body.token;

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
      }
      verify()
      .then(()=>{
          res.cookie('session-token', token);
          res.send('success')
      })
      .catch(console.error);

})

/*app.get('/profile', checkAuthenticated, (req, res)=>{
    let user = req.user;
    res.render('profile', {user});
    
})*/

app.get('/Redirect', checkAuthenticated, (req,res)=>{
    let user = req.user;
    res.redirect('Index.html');
    res.send(user);
})
app.get('/protectedRoute', checkAuthenticated, (req,res)=>{
    res.send('This route is protected')
})

app.get('/logout', (req, res)=>{
    res.clearCookie('session-token');
    res.redirect('/login')

})


function checkAuthenticated(req, res, next){

    let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
      }
      verify()
      .then(()=>{
          req.user = user;
          next();
      })
      .catch(err=>{
          res.redirect('/login')
      })

}
