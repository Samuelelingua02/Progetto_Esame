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
        }else if(selectValue == "tutto"){
            window.location.reload();
        }
    });
    let newID = 0;
    let prezz = 0;
    let tipo1;
    let desc;
    let immagine;
    let immag;
    let btnIns = $("#btnIns");
    btnIns.attr("data-toggle","modal");
    btnIns.attr("data-target","#exampleModal1");
    btnIns.on("click",function(){
        let getlastID = sendRequestNoCallback("/api/getProdotti","GET");
        getlastID.done(function(data){
            console.log(data.data);
            let lastID = data.data.length+1;
            //alert(lastID);
            newID = lastID;
            let textid = $("#txtID1");
            textid.val(lastID);
        });
        let btnSave = $("#save1");
        btnSave.on("click",function(){
            if($("#desc1").val() == null)
            alert("Campo vuoto!");
        else{
            desc = $("#desc1").val();
            //alert(desc);
        }

        if($("#tipo1").val() == null)
            alert("Campo vuoto!");
        else{
            tipo1 = $("#tipo1").val();
            //alert(tipo1);
        }

        if($("#prez12").val() == null)
            alert("Campo vuoto!");
        else{
            prezz = $("#prez12").val();
            //alert(prezz);
        }
            if($("#img1").val() == null)
                alert("Campo vuoto!");
            else{
                immag = $("#img1").val();
                immagine=immag.substring(12);
                alert(immagine);
            }
                
        let inserisci = sendRequestNoCallback("/api/inserisciProd2","POST",{id:newID,desc:desc,tipo:tipo1,prezzo:prezz,img:immagine});
        inserisci.done(function(){

            });
            window.location.reload();
        });
        
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
        let btnElimina = $("<button></button>");
        btnElimina.attr("class","btn btn-outline-secondary");
        btnElimina.attr("style","background-color:red");
        btnElimina.attr("type","button");
        btnElimina.attr("id",data[j]._id);
        btnElimina.html("Elimina Prodotto");
        btnElimina.on("click",function(){
            let removeProd = sendRequestNoCallback("/api/removeProd","POST",{id:this.id});
            removeProd.done(function(data){

            });
            window.location.reload();
        });
        div5.append(btnElimina);
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
            //alert("Il mio id è: "+this.id);
            let getEdit = sendRequestNoCallback("/api/getEdit","POST",{Id:this.id});
            getEdit.done(function(data){
                console.log(data.data);
                //alert(data.data[0].descrizione);
                caricaForm(data.data);
            });
        });
        div5.append(btn);

        let btnElimina = $("<button></button>");
        btnElimina.attr("class","btn btn-outline-secondary");
        btnElimina.attr("style","background-color:red");
        btnElimina.attr("type","button");
        btnElimina.attr("id",data[j]._id);
        btnElimina.html("Elimina Prodotto");
        btnElimina.on("click",function(){
            let removeProd = sendRequestNoCallback("/api/removeProd","POST",{id:this.id});
            removeProd.done(function(data){

            });
            window.location.reload();
        });
        div5.append(btnElimina);
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
            //alert("Il mio id è: "+this.id);
            let getEdit = sendRequestNoCallback("/api/getEdit","POST",{Id:this.id});
            getEdit.done(function(data){
                console.log(data.data);
                //alert(data.data[0].descrizione);
                caricaForm(data.data);
            });
        });
        div5.append(btn);
        let btnElimina = $("<button></button>");
        btnElimina.attr("class","btn btn-outline-secondary");
        btnElimina.attr("style","background-color:red");
        btnElimina.attr("type","button");
        btnElimina.attr("id",data[j]._id);
        btnElimina.html("Elimina Prodotto");
        btnElimina.on("click",function(){
            let removeProd = sendRequestNoCallback("/api/removeProd","POST",{id:this.id});
            removeProd.done(function(data){

            });
            window.location.reload();
        });
        div5.append(btnElimina);
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
        //alert("Il mio id è: "+this.id);
        let getEdit = sendRequestNoCallback("/api/getEdit","POST",{Id:this.id});
        getEdit.done(function(data){
            console.log(data.data);
            //alert(data.data[0].descrizione);
            caricaForm(data.data);
        });
    });
    div5.append(btn);
    let btnElimina = $("<button></button>");
        btnElimina.attr("class","btn btn-outline-secondary");
        btnElimina.attr("style","background-color:red");
        btnElimina.attr("type","button");
        btnElimina.attr("id",data[j]._id);
        btnElimina.html("Elimina Prodotto");
        btnElimina.on("click",function(){
            let removeProd = sendRequestNoCallback("/api/removeProd","POST",{id:this.id});
            removeProd.done(function(data){

            });
            window.location.reload();
        });
        div5.append(btnElimina);
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

    let btnSave = $("#save");
    btnSave.on("click",function(){
        let idForm = $("#txtID").val();
        let descForm = $("#desc").val();
        let tipoForm = $("#tipo").val();
        let prezForm = $("#prez1").val();

        let updateProd = sendRequestNoCallback("/api/updateProd","POST",{id:idForm,descrizione:descForm,tipo:tipoForm,prezzo:prezForm});
        updateProd.done(function(data){
            
            console.log(data.data);
        });
        window.location.reload();
    });
}