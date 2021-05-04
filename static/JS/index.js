"use strict"
$(document).ready(function () {  
    let callbackLogin = sendRequestNoCallback("/Redirect","GET");
    callbackLogin.done(function(user){
        console.log(user);
        let h3 = $("#h3");
        h3.html("Sei loggato come "+user.name+" - ");
        let li = $("#idLogin");
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
    });

    let caricaCard = sendRequestNoCallback("/api/CaricaPezzi","GET");
    caricaCard.done(function(data){
        caricaProd(data.data);
        console.log(data);
    });

    let aDolci = $("#ProdottiDolci");
    aDolci.on("click",function(){
        alert("Fil gay");
        let caricaDolci = sendRequestNoCallback("/api/CaricaDolci","GET");
        caricaDolci.done(function(data){
            console.log(data.data);
            let divVuoto =$("<div></div>");
            divVuoto.attr("id","vuoto");
            let divRow = $("#row");
           // divRow.replaceWith(divVuoto);
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
                    h61.html(data.data[j].prezzo+" €");
                    div2.append(h61);
                    let btn = $("<button></button>");
                    btn.attr("class","btn btn-primary btn-lg btn-round");
                    btn.attr("type","submit");
                    btn.html("AGGIUGI A ORDINE");
                    div.append(btn);
            }
        });
    });
});
function caricaProd(data){
    let divRow = $("#row");
    alert(data.length);
    for(let j=0;j<data.length;j++){
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
        img.attr("src","images/Home/"+data[j].foto);
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
        h61.html(data[j].prezzo+" €");
        div2.append(h61);
        let btn = $("<button></button>");
        btn.attr("class","btn btn-primary btn-lg btn-round");
        btn.attr("type","submit");
        btn.html("AGGIUGI A ORDINE");
        div.append(btn);
    }

}