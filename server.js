var express=require("express");
var app=express();
var PORT= process.env.PORT || 1337;

app.listen(PORT,function(){
    console.log("Server running on port %s...", port);
});

/****** inizio codice middleware ******/
app.use(function(req,res,next){
    var d=new Date();
    console.log(d.toLocaleTimeString() + " >>> " + req.method + ": " + req.originalUrl);
    next();
});

/****** Inizio gestione risorse client ******/

app.get("/favicon.png",function(req,res,next){
    res.sendFile(__dirname + "/favicon.png");
});

app.get("/",function(req,res,next){
    var page="<html>";
    page += "<head><title>Express first app</title><link rel='icon' sizes='32x32' href='favicon.png' /></head><body>";
    page += "<h1>Express first page</h1>";
    page += "<form action='pag3' method='POST'>";
    page += "<input type='submit' value='carica risorsa' />";
    page += "</form></body></html>";
    res.send(page);
});

app.post("/pag1",function(req,res,next){
    var header={"Content-Type":"text/html;charset=utf-8"};
    res.writeHead(200,header);
    res.write("Pag 1 caricata in POST");
    res.end('<a href="/">Torna alla home page</a>');
});

app.use("/pag2",function(req,res,next){
    if(req.method.toLowerCase()=="get")
        res.send("risorsa pag 2 caricata in modalità GET. <a href='/'>Torna alla home page</a>");
    else
        if(req.method.toLowerCase()=="post")
            res.send("risorsa pag 2 caricata in modalità POST. <a href='/'>Torna alla home page</a>");
});

app.route("/pag3").get(function(req,res){
        res.send("risorsa pag 3 caricata in modalità GET con app.route. <a href='/'>Torna alla home page</a>");
    }).post(function(req,res){
        res.send("risorsa pag 3 caricata in modalità POST con app.route. <a href='/'>Torna alla home page</a>");
    });



/* Gestione delle errore finale */
app.use(function(req,res,next){
    res.status(404).sendFile(__dirname + "/error.html");
});