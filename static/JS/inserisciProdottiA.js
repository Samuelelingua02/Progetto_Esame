"use strict"
$(document).ready(function(){

    let getUser = sendRequestNoCallback("/getuser","GET");
    getUser.done(function(user){
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
    });

    let caricaProd = sendRequestNoCallback("/api/CaricaPezzi","GET");
    caricaProd.done(function(data){
        caricaProdotti(data.data);
        console.log(data);
    });

    let getUtente = sendRequestNoCallback("/getuser","GET");
    getUtente.done(function(user){
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
    });

    let select = $("#select");
    select.on("change",function(){
        let selectValue = $("#select").val();
        //alert(selectValue);
        if(selectValue == "panini"){
            let getPanini = sendRequestNoCallback("/api/caricaPanini","GET");
            getPanini.done(function(data){
                console.log(data.data);
                let divRow = $("#containerProdottiModifica");
                divRow[0].innerHTML = " ";
                caricaPanini(data.data);
            });

        }else if(selectValue == "dolci"){
            let getDolci = sendRequestNoCallback("/api/caricaDolci","GET");
            getDolci.done(function(data){
                let divRow = $("#containerProdottiModifica");
                divRow[0].innerHTML = " ";
                caricaDolci(data.data);
            });
        }else if(selectValue == "bevande"){
            let getBevande = sendRequestNoCallback("/api/caricaBevande","GET");
            getBevande.done(function(data){
                let divRow = $("#containerProdottiModifica");
                divRow[0].innerHTML = " ";
                caricaBevande(data.data);
            });
        }
    });
});

function caricaProdotti(data){
    let divRow = $("#containerProdottiModifica");
    
    //alert(data.length);
    for(let j=0;j<data.length;j++){
        let divIniziale = $("<div></div>");
        divIniziale.attr("class","row");
        divRow.append(divIniziale);

        let div = $("<div></div>");
        div.attr("id","divFoto");
        div.attr("class","col-lg-2");
        let img =$("<img>");
        img.attr("src","images/Home/"+data[j].foto);
        img.attr("class","img-responsive");
        img.attr("width","50px");
        img.attr("height","50px");
        div.append(img);
        divIniziale.append(div);

        let div2 = $("<div></div>");
        div2.attr("id","divDescrizione");
        div2.attr("class","col-lg-3");
        div2.html(data[j].descrizione);
        divIniziale.append(div2);

        
        let div3 = $("<div></div>");
        div3.attr("id","divTipo");
        div3.attr("class","col-lg-3");
        div3.html(data[j].tipo);
        divIniziale.append(div3);

        let div4 = $("<div></div>");
        div4.attr("id","divPrezzo");
        div4.attr("class","col-lg-2");
        div4.html(data[j].prezzo+" €");
        divIniziale.append(div4);

        let div5 = $("<div></div>");
        div5.attr("id","divBtnModifica");
        div5.attr("class","col-lg-2");

        let btn = $("<button></button>");
        btn.attr("class","btn btn-outline-secondary");
        btn.attr("type","button");
        btn.attr("id",data[j]._id);
        btn.attr("data-toggle","modal");
        btn.attr("data-target","#exampleModal");
        btn.html("Modifica Prodotto");
        btn.on("click",function(){
            //alert("Il mio id è: "+this.id);
            let getEdit = sendRequestNoCallback("/api/getEdit","POST",{Id:this.id});
            getEdit.done(function(data){
                console.log(data.data);
                //alert(data.data[0].descrizione);
                caricaForm(data.data);
            });
        });
        div5.append(btn);
        divIniziale.append(div5);
    }
}

function caricaPanini(data){
    let divRow = $("#containerProdottiModifica");
        //alert(data.length);
    for(let j=0;j<data.length;j++){
        let divIniziale = $("<div></div>");
        divIniziale.attr("class","row");
        divRow.append(divIniziale);

        let div = $("<div></div>");
        div.attr("id","divFoto");
        div.attr("class","col-lg-2");
        let img =$("<img>");
        img.attr("src","images/Home/"+data[j].foto);
        img.attr("class","img-responsive");
        img.attr("width","50px");
        img.attr("height","50px");
        div.append(img);
        divIniziale.append(div);

        let div2 = $("<div></div>");
        div2.attr("id","divDescrizione");
        div2.attr("class","col-lg-3");
        div2.html(data[j].descrizione);
        divIniziale.append(div2);

        
        let div3 = $("<div></div>");
        div3.attr("id","divTipo");
        div3.attr("class","col-lg-3");
        div3.html(data[j].tipo);
        divIniziale.append(div3);

        let div4 = $("<div></div>");
        div4.attr("id","divPrezzo");
        div4.attr("class","col-lg-2");
        div4.html(data[j].prezzo+" €");
        divIniziale.append(div4);

        let div5 = $("<div></div>");
        div5.attr("id","divBtnModifica");
        div5.attr("class","col-lg-2");

        let btn = $("<button></button>");
        btn.attr("class","btn btn-outline-secondary");
        btn.attr("type","submit");
        btn.attr("id",data[j]._id);
        btn.attr("data-toggle","modal");
        btn.attr("data-target","#exampleModal");
        btn.html("Modifica Prodotto");
        btn.on("click",function(){
            alert("Il mio id è: "+this.id);
        });
        div5.append(btn);
        divIniziale.append(div5);
    }

}

function caricaDolci(data){
    let divRow = $("#containerProdottiModifica");
        //alert(data.length);
    for(let j=0;j<data.length;j++){
        let divIniziale = $("<div></div>");
        divIniziale.attr("class","row");
        divRow.append(divIniziale);

        let div = $("<div></div>");
        div.attr("id","divFoto");
        div.attr("class","col-lg-2");
        let img =$("<img>");
        img.attr("src","images/Home/"+data[j].foto);
        img.attr("class","img-responsive");
        img.attr("width","50px");
        img.attr("height","50px");
        div.append(img);
        divIniziale.append(div);

        let div2 = $("<div></div>");
        div2.attr("id","divDescrizione");
        div2.attr("class","col-lg-3");
        div2.html(data[j].descrizione);
        divIniziale.append(div2);

        
        let div3 = $("<div></div>");
        div3.attr("id","divTipo");
        div3.attr("class","col-lg-3");
        div3.html(data[j].tipo);
        divIniziale.append(div3);

        let div4 = $("<div></div>");
        div4.attr("id","divPrezzo");
        div4.attr("class","col-lg-2");
        div4.html(data[j].prezzo+" €");
        divIniziale.append(div4);

        let div5 = $("<div></div>");
        div5.attr("id","divBtnModifica");
        div5.attr("class","col-lg-2");

        let btn = $("<button></button>");
        btn.attr("class","btn btn-outline-secondary");
        btn.attr("type","submit");
        btn.attr("id",data[j]._id);
        btn.attr("data-toggle","modal");
        btn.attr("data-target","#exampleModal");
        btn.html("Modifica Prodotto");
        btn.on("click",function(){
            alert("Il mio id è: "+this.id);
        });
        div5.append(btn);
        divIniziale.append(div5);
    }

}

function caricaBevande(data){
    let divRow = $("#containerProdottiModifica");
    //alert(data.length);
for(let j=0;j<data.length;j++){
    let divIniziale = $("<div></div>");
    divIniziale.attr("class","row");
    divRow.append(divIniziale);

    let div = $("<div></div>");
    div.attr("id","divFoto");
    div.attr("class","col-lg-2");
    let img =$("<img>");
    img.attr("src","images/Home/"+data[j].foto);
    img.attr("class","img-responsive");
    img.attr("width","50px");
    img.attr("height","50px");
    div.append(img);
    divIniziale.append(div);

    let div2 = $("<div></div>");
    div2.attr("id","divDescrizione");
    div2.attr("class","col-lg-3");
    div2.html(data[j].descrizione);
    divIniziale.append(div2);

    
    let div3 = $("<div></div>");
    div3.attr("id","divTipo");
    div3.attr("class","col-lg-3");
    div3.html(data[j].tipo);
    divIniziale.append(div3);

    let div4 = $("<div></div>");
    div4.attr("id","divPrezzo");
    div4.attr("class","col-lg-2");
    div4.html(data[j].prezzo+" €");
    divIniziale.append(div4);

    let div5 = $("<div></div>");
    div5.attr("id","divBtnModifica");
    div5.attr("class","col-lg-2");

    let btn = $("<button></button>");
    btn.attr("class","btn btn-outline-secondary");
    btn.attr("type","submit");
    btn.attr("id",data[j]._id);
    btn.attr("data-toggle","modal");
    btn.attr("data-target","#exampleModal");
    btn.html("Modifica Prodotto");
    btn.on("click",function(){
        alert("Il mio id è: "+this.id);
    });
    div5.append(btn);
    divIniziale.append(div5);
}

}

function caricaForm(data){
    let idForm = $("#txtID");
    let descForm = $("#desc");
    let tipoForm = $("#tipo");
    let prezForm = $("#prez1");

    idForm.val(data[0]._id);
    descForm.val(data[0].descrizione);
    tipoForm.val(data[0].tipo);
    prezForm.val(data[0].prezzo);
}