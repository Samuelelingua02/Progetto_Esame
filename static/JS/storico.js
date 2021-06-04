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
    })

    let getOrdini = sendRequestNoCallback("/api/getStorico","POST");
    getOrdini.done(function(data){
       // console.log(data.data);
        CaricaStorico(data.data);
    });



});
let j=0;
let utenti=new Array();

function CaricaStorico(data){
    for(let i=0;i<data.length;i++){
        utenti[i] = data[i].idUtente;
        let user = data[i].idUtente;
    }
    let utentiGOD = new Array();
    utentiGOD = utenti.filter(function(ele, pos){//elimina i duplicati nell array
        return utenti.indexOf(ele) == pos;
    });
   // alert("Array filtrato: "+utentiGOD);

    for(let i=0;i<utentiGOD.length;i++){
        let user = utentiGOD[i];
       //alert(j);
        //alert(user);
        let CaricaStorico22 = sendRequestNoCallback("/api/getStorico2","POST",{utente:user});
        CaricaStorico22.done(function(data){
            //console.log(data.data);
            j=0;
            CaricaStorico20(data.data); 
        });
    }
}
function CaricaStorico20(data){
   // alert(j);
    let divIniziale = $("#divMain");
    for(let x=0;x<data.length;x++){

        

        if(j>0){
            let divRow = $("<div></div>");
            divRow.attr("class","row");
            divRow.attr("id","RowRiga");
            divRow.attr("style","text-align: center;");
            divIniziale.append(divRow);

            let divUtente = $("<div></div>");
            divUtente.attr("class","col-xs-2");
            
          //  divUtente.attr("style","border-left: 2px solid black; border-right: 2px solid black;");
            divRow.append(divUtente);

            let divDescrizione = $("<div></div>");
            divDescrizione.attr("class","col-xs-2");
            divDescrizione.html(data[x].descrizione);
            divRow.append(divDescrizione);

            let divQuantita = $("<div></div>");
            divQuantita.attr("class","col-xs-2");
            divQuantita.html(data[x].quantita);
            divRow.append(divQuantita);

            let divPagamento = $("<div></div>");
            divPagamento.attr("class","col-xs-2");
            if(data[x].pagamentoSatispay=="true"){
                divPagamento.html("Satispay");
            }else
            {
                divPagamento.html("Contanti");
            }
            divRow.append(divPagamento);

            let divData = $("<div></div>");
            divData.attr("class","col-xs-2");
            divData.html(data[x].dataOrdine);
            divRow.append(divData);

            let divTotale = $("<div></div>");
            divTotale.attr("class","col-xs-2");
            divRow.append(divTotale);

        }else if(j==0){
            j++;
            let divRow = $("<div></div>");
            divRow.attr("class","row");
            divRow.attr("id","RowRiga");
            divRow.attr("style","text-align: center;");
            divIniziale.append(divRow);

            let divUtente = $("<div></div>");
            divUtente.attr("class","col-xs-2");
            divUtente.html("Acquisto di: "+data[x].idUtente);
            divRow.append(divUtente);

            let divDescrizione = $("<div></div>");
            divDescrizione.attr("class","col-xs-2");
            divDescrizione.html("Descrizione");
            divRow.append(divDescrizione);

            let divQuantita = $("<div></div>");
            divQuantita.attr("class","col-xs-2");
            divQuantita.html("Quantità");
            divRow.append(divQuantita);

            let divPagamento = $("<div></div>");
            divPagamento.attr("class","col-xs-2");
            divPagamento.html("Tipo Pagamento");
            divRow.append(divPagamento);

            let divData = $("<div></div>");
            divData.attr("class","col-xs-2");
            divData.html("Data ordine");
            divRow.append(divData);

            let divTotale = $("<div></div>");
            divTotale.attr("class","col-xs-2");
            divTotale.html("Totale: "+data[x].totale.toFixed(2)+"€");
            divRow.append(divTotale);
            x--;
        }
    }

}