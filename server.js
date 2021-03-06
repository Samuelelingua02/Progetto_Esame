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

// express//
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { create } = require('errors');

//EJS//////
//app.set('view engine', 'ejs');

// Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '759412275936-j36b15qkpndslm139qcj50dsvv449vso.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

// Online RSA Key Generator
const privateKey = fs.readFileSync("keys/private.key", "utf8");
const certificate = fs.readFileSync("keys/certificate.crt", "utf8");
const credentials = {"key":privateKey, "cert":certificate};

// avvio server
const TIMEOUT = 300; // 60 SEC
let pageNotFound;
const PORT = process.env.PORT || 1337;

var httpsServer = HTTPS.createServer(credentials, app);
httpsServer.listen(PORT,'127.0.0.1', function() {
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
    res.send(user);
    res.redirect('Index.html');
})

app.get('/getuser', checkAuthenticated, (req,res)=>{
    let user = req.user;
    res.send(user);
})

app.get('/protectedRoute', checkAuthenticated, (req,res)=>{
    res.send('This route is protected')
})

app.get('/logout', (req, res)=>{
    res.clearCookie('session-token');
    res.redirect('index.html');
})


app.get('/api/CaricaPezzi', function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('prodotti');
            collection.find({}).sort({
                _id: 1
            }).toArray(function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            });
            client.close();
        }
    });
});

app.get('/api/CaricaDolci', function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('prodotti');
            collection.find({tipo:"dolce"}).toArray(function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            });
            client.close();
        }
    });
});

app.get('/api/caricaPanini', function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('prodotti');
            collection.find({tipo:"panino"}).toArray(function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            });
            client.close();
        }
    });
});

app.get('/api/caricaBevande', function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('prodotti');
            collection.find({tipo:"bevande"}).toArray(function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            });
            client.close();
        }
    });
});

app.post('/api/salvaMail',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('Users');
            let mail = req.body.Mail;
            let user = req.body.utente;
            collection.insertOne({idUtente:user,Email:mail}), function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            }
            client.close();
        }
    });
});

app.post('/api/checkMail',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('Users');
            let mail = req.body.Mail;
            collection.find({Email:mail}).toArray(function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            });
            client.close();
        }
    });
});

app.post('/api/getMail',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('Users');
            let username = req.body.utente;
            console.log(username);
            collection.find({idUtente:username}).toArray(function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            });
            client.close();
        }
    });
});

app.post('/api/invioMail',checkAuthenticated, function (req, res, next) {
    let nodemailer=require("nodemailer");
    let transport=nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "b5d03aff30be68",
          pass: "204f93132eb0ba"
        }
    
    });
    let modCSS=require("./w3css.js");
    let bodyHtml="<html><head> <style>"+modCSS.w3css+"</style> </head><body class='w3-container w3-amber'><br /><br /><br /><div class='w3-container w3-display-container'><span class='w3-tag w3-xlarge w3-padding w3-red w3-display-middle' style='transform:rotate(-7deg)'>Attenzione!</span></div><br /><br /><br /><br /><h1 class='w3-panel w3-pale-yellow w3-border w3-panel w3-border w3-round-xlarge'>Il totale da pagare ?? : "+req.body.total+"</h1> <h3>Il tuo ordine ?? pronto vai a ritirare</h3></body></html>";
    const message={
        from: "anselbar212@gmail.com",
        to: req.body.Mail,
        subject: "Mail di prova da node",
        //text: "Mail spedita tramite sever web node!"
        html:bodyHtml
    };
    transport.sendMail(message,function (err,info) {  
        if(err){
            console.log(err);
            res.end("Errore di invio mail");
        }
        else{
            console.log(info);
            res.end(JSON.stringify(info));
        }
    });
});

app.post('/api/caricaOrdine',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('ordini');
            let prodotto = req.body.id;
            let user = req.user;
            collection.insertOne({_idUtente:user.name,idProdotto:prodotto}), function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            }
            client.close();
        }
    });
});

app.post('/api/checkOrdine',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('ordini');
            let prodotto = req.body.id;
            let user = req.user;
            collection.find({_idUtente:user.name,idProdotto:prodotto}).toArray(function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            });
            client.close();
        }
    });
});

app.post('/api/checkCarrello',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('ordini');
            let user = req.user;
            collection.find({_idUtente:user.name}).toArray(function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            });
            client.close();
        }
    });
});

app.get('/api/visualizzaCarrello',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('ordini');
            let user = req.user;
            console.log(user.name);
            collection.find({"_idUtente":user.name}).toArray( function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            });
            client.close();
        }
    });
});

app.post('/api/chargeCart2',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('prodotti');
            let prodotto = req.body.idProdotto;
            console.log("id: "+prodotto);
            let prod = parseInt(prodotto);
            collection.find({_id:prod}).toArray( function (errQ, data) {
                if (errQ){
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                    console.log("Errore di query porcamadonna!!");
                }
                else {
                    //console.log("DIOOOOOO!!1");
                    res.send({"data":data});
                    console.log(data);
                }
            });
            client.close();
        }
    });
});

app.post('/api/btnElimina',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('ordini');
            let prodotto = req.body.idProdotto;
            let user = req.user;
            console.log(user.name);
            console.log(prodotto);
            collection.remove({_idUtente:user.name,idProdotto:prodotto}), function (errQ, data) {
                if (errQ){
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                    console.log("Errore di query!!");
                }
                else {
                    console.log("DIOOOOOO!!1");
                    res.send({"data":data});
                    console.log(data);
                }
            }
            client.close();
        }
    });
});

app.post('/api/caricaEffettuato',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('OrdiniEffettuati');
            let prodotto = req.body.idProd;
            let quantita = req.body.quantita;
            let totale = req.body.totale;
            let user = req.user;
            let descrizione = req.body.descrizione;
            let pagamento = req.body.pagamento;
            let prod = parseInt(prodotto);
            collection.insertOne({idUtente:user.name,idProdotto:prod,quantita:parseInt(quantita),prezzoTot:parseFloat(totale),descrizione:descrizione,pagamentoSatispay:pagamento}), function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            }
            client.close();
        }
    });
});

app.get('/api/svuota',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('ordini');
            let user = req.user;
            collection.remove({_idUtente:user.name}), function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            }
            client.close();
        }
    });
});

app.get('/api/getProdotti',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('prodotti');
            let user = req.user;
            console.log(user.name);
            collection.find().toArray( function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            });
            client.close();
        }
    });
});

app.get('/api/getProdottiOrd',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('OrdiniEffettuati');
            let user = req.user;
            console.log(user.name);
            collection.find().toArray( function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            });
            client.close();
        }
    });
});

app.post('/api/getProducts',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('OrdiniEffettuati');
            let utent = req.body.utente;
            console.log(utent);
            //console.log(user.name);
            collection.find({idUtente:utent}).toArray( function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            });
            client.close();
        }
    });
});

app.post('/api/getEdit',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('prodotti');
            let id = req.body.Id;
            console.log(id);
            let ider = parseInt(id);
            collection.find({_id:ider}).toArray( function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            });
            client.close();
        }
    });
});

app.post('/api/updateProd',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('prodotti');
            let id = req.body.id;
            let descr = req.body.descrizione;
            let tipo = req.body.tipo;
            let prez = req.body.prezzo;
            let ider = parseInt(id);
            let prezzo = parseFloat(prez);
            console.log(ider);
            console.log(descr);
            console.log(tipo);
            console.log(prezzo);
            collection.update({"_id" : ider},
            {$set: { "descrizione" : descr,"tipo":tipo,"prezzo":prezzo}}),function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            }
            client.close();
        }
    });
});

app.post('/api/inserisciProd2',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('prodotti');
            let id = req.body.id;
            let descr = req.body.desc;
            let tipo = req.body.tipo;
            let prez = req.body.prezzo;
            let foto = req.body.img;
            let ider = parseInt(id);
            let prezzo = parseFloat(prez);
            console.log(ider);
            console.log(descr);
            console.log(tipo);
            console.log(prezzo);
            collection.insertOne({"_id" : ider,"foto":foto,"descrizione":descr,"tipo":tipo,"prezzo":prezzo}),function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            }
            client.close();
        }
    });
});

app.post('/api/removeProd',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('prodotti');
            let id = req.body.id;
            let ider = parseInt(id);
            collection.removeOne({"_id" : ider}),function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            }
            client.close();
        }
    });
});

app.post('/api/caricaStorico',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('storicoOrdini');
            let prodotto = req.body.idProd;
            let quantita = req.body.qta;
            let totale = req.body.totale;
            let user = req.body.idUser;
            let descrizione = req.body.descr;
            let pagamento = req.body.pagamentoSat;
            let dataO = req.body.dataOrdine;
            let prod = parseInt(prodotto);
            collection.insertMany([{idUtente:user,idProdotto:prod,quantita:parseInt(quantita),totale:parseFloat(totale),descrizione:descrizione,pagamentoSatispay:pagamento,dataOrdine:dataO}]), function (errQ, data) {
                if (errQ)
                error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":"OK"});
                    console.log(data);
                }
            }
            client.close();
        }
    });
});

app.post('/api/removeOrder',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('OrdiniEffettuati');
            let id = req.body.utente;
            console.log(id);
            collection.remove({idUtente : id}),function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":"OK"});
                    console.log(data);
                }
            }
            client.close();
        }
    });
});

app.post('/api/getStorico',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('storicoOrdini');
            let id = req.body.utente;
            console.log(id);
            collection.find().toArray(function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                    console.log(data);
                }
            });
            client.close();
        }
    });
});

app.post('/api/getStorico2',checkAuthenticated, function (req, res, next) {
    MONGO_CLIENT.connect(CONNECTION_STRING,CONNECTION_OPTIONS, function (err, client) {
        if (err)
            error(req, res,new ERRORS.DB_CONNECTION({}));
        else {
            const DB = client.db('Bar');
            let collection = DB.collection('storicoOrdini');
            let id = req.body.utente;
            console.log(id);
            collection.find({idUtente:id}).toArray(function (errQ, data) {
                if (errQ)
                    error(req, res, new ERRORS.QUERY_EXECUTE({}));
                else {
                    res.send({"data":data});
                   //console.log(data);
                }
            });
            client.close();
        }
    });
});

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
          res.redirect('/login');
      })

}
