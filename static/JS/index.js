"use strict"
$(document).ready(function () {  
    let callbackLogin = sendRequestNoCallback("/Redirect","GET");
    callbackLogin.done(function(user){
        console.log(user);
        let h3 = $("#h3");
        h3.html("Sei loggato come "+user.name+" - ");
        let ul = $("#ul");
        let li = $("<li></li>");
        ul.append(li);
        let a = $("<a></a>");
        a.attr("href","/logout");
        a.html("LOGOUT");
        li.append(a);
        let img = $("<img>");
        img.attr("src",user.picture);
        img.attr("width","50px");
        img.attr("height","50px");
        img.attr("class","rounded");
        h3.append(img);
        $("#idLogin").hide();

        let checkMail = sendRequestNoCallback("/api/checkMail","POST",{Mail:user.email});
        checkMail.done(function(data){
            console.log(data.data);
            if(data.data.length==0){
                let email = user.email;
                let saveMail = sendRequestNoCallback("/api/salvaMail","POST",{Mail:email,utente:user.name});
                saveMail.done(function(data){
                    alert("Mail godddata!");
                });
            }
        });


        
    });

    let getUser = sendRequestNoCallback("/getuser","GET");
    getUser.done(function(user){
        if(user.name == "Ansel Bar"){
            let ul = $("#drop");
            //alert("Salve adminnn!!!");
            //window.location.href = "admin.html";
            let li = $("<li></li>");
            let a = $("<a></a>");
            a.attr("class","dropdown");
            a.attr("href","admin.html");
            a.html("AMMINISTRAZIONE");
            ul.append(li);
            li.append(a);
        }
    })
    

    let caricaCard = sendRequestNoCallback("/api/CaricaPezzi","GET");
    caricaCard.done(function(data){
        caricaProd(data.data);
        console.log(data);
    });

    let aDolci = $("#ProdottiDolci");
    aDolci.on("click",function(){
        //alert("Fil gay");
        let caricaDolci = sendRequestNoCallback("/api/CaricaDolci","GET");
        caricaDolci.done(function(data){
            console.log(data.data);
            let divRow = $("#row");
            divRow[0].innerHTML = " ";
           // divRow.replaceWith(divVuoto);
            for(let j=0;j<data.data.length;j++){
                   // divVuoto.replaceWith(divRow);
                    let divIniziale = $("<div></div>");

                    divIniziale.attr("class","col-lg-3 col-md-3 col-sm-4 col-xs-12");
                    divRow.append(divIniziale);

                    let divRiga = $("<div></div>");
                    divRiga.attr("class","row");
                    let div = $("<div></div>");
                    div.attr("id","card");
                    div.attr("width","50%");
                    div.attr("height","50%");
                    divIniziale.append(divRiga);
                    divRiga.append(div);
                    let div2 = $("<div></div>");
                    div2.attr("class","food-image");
                    div.append(div2);
                    let img =$("<img>");
                    img.attr("src","images/Home/"+data.data[j].foto);
                    img.attr("class","img-responsive");
                    img.attr("width","800px");
                    img.attr("height","800px");
                    div2.append(img);
                    let div3 = $("<div></div>");
                    div3.attr("class","overlay");
                    div2.append(div3);
                    let a = $("<a></a>");
                    a.attr("class","info-pop");
                    div3.append(a);
                    let img1 = $("<img>");
                    img1.attr("alt","CARD IMAGE");
                    img1.attr("class","img-responsive");
                    img1.attr("src","images/Home/"+data.data[j].foto);
                    img1.attr("style","display: none;");
                    a.append(img1);
                    let i = $("<i></i>");
                    i.attr("aria-hidden","true");
                    i.attr("class","fa fa-plus-square-o");
                    a.append(i);
                    let h6 = $("<h6></h6>");
                    h6.attr("class","help-block text-danger");
                    h6.html(data.data[j].descrizione);
                    div2.append(h6);
                    let h61 = $("<h6></h6>");
                    h61.attr("class","help-block text-danger");
                    h61.html(data.data[j].prezzo+" ???");
                    div2.append(h61);
                    let btn = $("<button></button>");
                    btn.attr("class","btn btn-primary btn-lg btn-round");
                    btn.attr("type","submit");
                    btn.attr("id",data.data[j]._id);
                    btn.html("AGGIUNGI A ORDINE");
                    btn.on("click",function(){
                        aggiungiOrdine(this.id,data);
                    });
                    div.append(btn);
            }
        });
    });
    let aTutti = $("#ProdottiAll");
    aTutti.on("click",function(){
        let caricaTutto = sendRequestNoCallback("/api/CaricaPezzi","GET");
        caricaTutto.done(function(data){
            caricaProd(data.data);
        });
    });

    let aPanini = $("#ProdottiPanini");
    aPanini.on("click",function(){
        let caricaPanini = sendRequestNoCallback("/api/caricaPanini","GET");
        caricaPanini.done(function(data){
            console.log(data.data);
            let divRow = $("#row");
            divRow[0].innerHTML = " ";
            for(let j=0;j<data.data.length;j++){
                // divVuoto.replaceWith(divRow);
                 let divIniziale = $("<div></div>");
                 divIniziale.attr("class","col-lg-3 col-md-3 col-sm-4 col-xs-12");
                 divRow.append(divIniziale);
                 let div = $("<div></div>");
                 div.attr("id","card");
                 div.attr("width","220px");
                 div.attr("height","360px");
                 divIniziale.append(div);
                 let div2 = $("<div></div>");
                 div2.attr("class","food-image");
                 div.append(div2);
                 let img =$("<img>");
                 img.attr("src","images/Home/"+data.data[j].foto);
                 img.attr("class","img-responsive");
                 img.attr("width","800px");
                 img.attr("height","800px");
                 div2.append(img);
                 let div3 = $("<div></div>");
                 div3.attr("class","overlay");
                 div2.append(div3);
                 let a = $("<a></a>");
                 a.attr("class","info-pop");
                 div3.append(a);
                 let img1 = $("<img>");
                 img1.attr("alt","CARD IMAGE");
                 img1.attr("class","img-responsive");
                 img1.attr("src","images/Home/"+data.data[j].foto);
                 img1.attr("style","display: none");
                 a.append(img1);
                 let i = $("<i></i>");
                 i.attr("aria-hidden","true");
                 i.attr("class","fa fa-plus-square-o");
                 a.append(i);
                 let h6 = $("<h6></h6>");
                 h6.attr("class","help-block text-danger");
                 h6.html(data.data[j].descrizione);
                 div2.append(h6);
                 let h61 = $("<h6></h6>");
                 h61.attr("class","help-block text-danger");
                 h61.html(data.data[j].prezzo+" ???");
                 div2.append(h61);
                 let btn = $("<button></button>");
                 btn.attr("class","btn btn-primary btn-lg btn-round");
                 btn.attr("type","submit");
                 btn.attr("id",data.data[j]._id);
                 btn.html("AGGIUNGI A ORDINE");
                 btn.on("click",function(){
                     aggiungiOrdine(this.id,data);
                     btn.attr("disabled","disabled");
                 });
                 div.append(btn);
         }

        });
    });
    let aBevande = $("#ProdottiBevande");
    aBevande.on("click",function(){
        let getBevande = sendRequestNoCallback("/api/caricaBevande","GET");
        getBevande.done(function(data){
            console.log(data.data);
            let divRow = $("#row");
            divRow[0].innerHTML = " ";
            for(let j=0;j<data.data.length;j++){
                // divVuoto.replaceWith(divRow);
                 let divIniziale = $("<div></div>");
                 divIniziale.attr("class","col-lg-3 col-md-3 col-sm-4 col-xs-12");
                 divRow.append(divIniziale);
                 let div = $("<div></div>");
                 div.attr("id","card");
                 div.attr("width","220px");
                 div.attr("height","360px");
                 divIniziale.append(div);
                 let div2 = $("<div></div>");
                 div2.attr("class","food-image");
                 div.append(div2);
                 let img =$("<img>");
                 img.attr("src","images/Home/"+data.data[j].foto);
                 img.attr("class","img-responsive");
                 img.attr("width","800px");
                 img.attr("height","800px");
                 div2.append(img);
                 let div3 = $("<div></div>");
                 div3.attr("class","overlay");
                 div2.append(div3);
                 let a = $("<a></a>");
                 a.attr("class","info-pop");
                 div3.append(a);
                 let img1 = $("<img>");
                 img1.attr("alt","CARD IMAGE");
                 img1.attr("class","img-responsive");
                 img1.attr("src","images/Home/"+data.data[j].foto);
                 img1.attr("style","display: none");
                 a.append(img1);
                 let i = $("<i></i>");
                 i.attr("aria-hidden","true");
                 i.attr("class","fa fa-plus-square-o");
                 a.append(i);
                 let h6 = $("<h6></h6>");
                 h6.attr("class","help-block text-danger");
                 h6.html(data.data[j].descrizione);
                 div2.append(h6);
                 let h61 = $("<h6></h6>");
                 h61.attr("class","help-block text-danger");
                 h61.html(data.data[j].prezzo+" ???");
                 div2.append(h61);
                 let btn = $("<button></button>");
                 btn.attr("class","btn btn-primary btn-lg btn-round");
                 btn.attr("type","submit");
                 btn.attr("id",data.data[j]._id);
                 btn.html("AGGIUNGI A ORDINE");
                 btn.on("click",function(){
                     aggiungiOrdine(this.id,data);
                     btn.attr("disabled","disabled");
                 });
                 div.append(btn);
         }

        });
    });
});
function caricaProd(data){
    let divRow = $("#row");
            divRow[0].innerHTML = " ";
           // divRow.replaceWith(divVuoto);
            for(let j=0;j<data.length;j++){
                   // divVuoto.replaceWith(divRow);
                    let divIniziale = $("<div style='width: 255px; height: 365px;'></div>");
                    divIniziale.attr("class","col-lg-3 col-md-3 col-sm-3");
                    divIniziale.attr("id","divInizialepo");
                    divRow.append(divIniziale);
                    let div = $("<div></div>");
                    div.attr("id","card");
                   // div.attr("width","255px");
                   // div.attr("height","365px");
                    divIniziale.append(div);
                    let div2 = $("<div></div>");
                    div2.attr("class","food-image");
                    div.append(div2);
                    let img =$("<img>");
                    img.attr("src","images/Home/"+data[j].foto);
                    img.attr("class","img-responsive");
                   // img.attr("width","800px");
                   // img.attr("height","800px");
                    div2.append(img);
                    let div3 = $("<div></div>");
                    div3.attr("class","overlay");
                    div2.append(div3);
                    let a = $("<a></a>");
                    a.attr("class","info-pop");
                    div3.append(a);
                    let img1 = $("<img>");
                    img1.attr("alt","CARD IMAGE");
                    img1.attr("class","img-responsive");
                    img1.attr("src","images/Home/"+data[j].foto);
                    img1.attr("style","display: none");
                    a.append(img1);
                    let i = $("<i></i>");
                    i.attr("aria-hidden","true");
                    i.attr("class","fa fa-plus-square-o");
                    a.append(i);
                    let h6 = $("<h6></h6>");
                    h6.attr("class","help-block text-danger");
                    h6.html(data[j].descrizione);
                    div2.append(h6);
                    let h61 = $("<h6></h6>");
                    h61.attr("class","help-block text-danger");
                    h61.html(data[j].prezzo+" ???");
                    div2.append(h61);
                    let btn = $("<button></button>");
                    btn.attr("class","btn btn-primary btn-lg btn-round");
                    btn.attr("type","submit");
                    btn.attr("id",data[j]._id);
                    btn.html("AGGIUNGI A ORDINE");
                    btn.on("click",function(){
                        aggiungiOrdine(this.id,data);
                    });
                    div.append(btn);
    }

}
function aggiungiOrdine(id,dati){
    let checkOrdine = sendRequestNoCallback("/api/checkOrdine","POST",{id:id});
    checkOrdine.done(function(data){
        console.log(data.data);
        if(data.data.length == 0){
            let ordina = sendRequestNoCallback("/api/caricaOrdine","POST",{id:id});
            ordina.done(function(data){
            alert("Operazione effetuata!!");
        });
        }else{
            alert("Prodotto gia presente nel carrello!!");
        }
        
    });
   
}