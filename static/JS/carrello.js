"use strict"
let pagamentoSatispay=false;
$(document).ready(function(){
    let visualizzaCarrello = sendRequestNoCallback("/api/visualizzaCarrello","GET");
    visualizzaCarrello.done(function(data){
        console.log(data.data);
       // alert("figa");
        visualizza(data.data);
    });

   let myModal = $("#myModal");
    let myInput = $("#myInput");
    //myModal.modal({show:true});


    /*function visualizzaModal(){
        alert("dio");
      myModal.modal({show:true});
    }*/

    myInput.on("click",function(){
        myModal.modal({show:true});
        //pagamentoSatispay = false;
        let imgSati = $("#imgSati");
        imgSati.on("click",function(){
            alert("Paga con satispay!");
            pagamentoSatispay=true;
        });

        let imgCash = $("#imgCash");
        imgCash.on("click",function(){
            alert("Paga con cash!");
            pagamentoSatispay=false;
        });
    });

    $("#closeModal").on("click",function(){
        myModal.modal('toggle');
    })

   let getUser = sendRequestNoCallback("/getuser","GET");
   getUser.done(function(user){
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
    
});
function visualizza(data){
    for(let i=0;i<data.length;i++){
        //alert(data[i].prodotto);
        let idProd = data[i].idProdotto;
        let chargeCart2 = sendRequestNoCallback("/api/chargeCart2","POST",{idProdotto:idProd});
        chargeCart2.fail(function(){
            alert("Errore di caricamento!!");
        });
        chargeCart2.done(function(data){
            console.log(data.data);
            //alert("Pezzo caricato con successo!!");
            loadProd(data.data);
        });
    }
}
 function loadProd(data){
     var qta=0;
     var tot=0;
     let divC = $("#container");
     for(let i=0;i<data.length;i++){
         let divRow = $("<div></div>");
         divRow.attr("id","topTable");
         divRow.attr("class","row");
         divC.append(divRow);
         let div1 = $("<div></div>");
         div1.attr("class","col-sm-1");
         divRow.append(div1);

         let div2 = $("<div></div>");
         div2.attr("class","col-sm-1");
         let btnE = $("<button></button>");
         btnE.html("X");
         btnE.attr("type","button");
         btnE.attr("id",data[i]._id);
         btnE.attr("class","btnEliminaCarrello");
         btnE.on("click",function(){
             //alert(data[i]._id);
            let btnElimina = sendRequestNoCallback("/api/btnElimina","POST",{idProdotto:data[i]._id});
            btnElimina.fail(function(jqXHR,test_status,str_error){
               // error(jqXHR,test_status,str_error);
                alert("Errore!!");
            });
            btnElimina.done(function(){
                //localStorage.setItem("token",data.token);
                window.location.href = "static/carrello.html";
            });
            window.location.reload();
        });
         divRow.append(div2);
         div2.append(btnE);
         
         let div3 = $("<div></div>");
         div3.attr("class","col-sm-1");
         let img =$("<img>");
         img.attr("src","images/Home/"+data[i].foto);
         img.attr("width","50px");
         img.attr("height","50px");
         divRow.append(div3);
         div3.append(img);

         let div4 = $("<div></div>");
         div4.attr("class","col-sm-4");
         let h3 = $("<h3></h3>");
         h3.html(data[i].descrizione);
         divRow.append(div4);
         div4.append(h3);

         let div5 = $("<div></div>");
         div5.attr("class","col-sm-1");
         div5.html(data[i].prezzo+" €");
         divRow.append(div5);

         let div6 = $("<div></div>");
         div6.attr("class","col-sm-2");
         let input = $("<input/>");
         input.attr("placeholder","Quantità");
         input.attr("type","number");
         input.attr("min","1");
         input.attr("max","20");
         input.attr("id","qta"+data[i]._id);
         input.attr("style","color: black; text-align: center; width: 120px;");
         input.on("change",function(){
            //let qta = $("#qta").val();
            //alert(this.value);
            //alert(this.id);
            qta = this.value;
            let prez = data[i].prezzo;
            let idqta = this.id.substring(5,3);
            //alert(idqta);
            $("#tot"+idqta).html(parseFloat(prez*qta).toFixed(2)+" €");
            tot = prez*qta;
         });
         divRow.append(div6);
         div6.append(input);

         let div7 = $("<div></div>");
         div7.attr("class","col-sm-1");
         div7.attr("id","tot"+data[i]._id);
         ///div7.html(parseInt(prez*qta)+" €");
         divRow.append(div7);

         let div8 = $("<div></div>");
         div8.attr("class","col-sm-1");
         divRow.append(div8);
     }
     let btnCheck = $("#BtnCheckout");
     btnCheck.on("click",function(qta,tot){
        
        
         for(let j=0;j<data.length;j++){
            let idProdotto = data[j]._id;
            let desc = data[j].descrizione;
            let qta1 = $("#qta"+idProdotto).val();
            let tot1 = parseFloat(data[j].prezzo*qta1);
            //alert(qta1);
            //alert(tot1);

            let caricaOrdineEffettuato = sendRequestNoCallback("/api/caricaEffettuato","POST",{idProd:idProdotto,quantita:qta1,totale:tot1,descrizione:desc,pagamento:pagamentoSatispay});
            caricaOrdineEffettuato.done(function(){
                alert("Ordine Effettuato!!");
            });

            let svuotaOrdine = sendRequestNoCallback("/api/svuota","GET");
            svuotaOrdine.done(function(){
                alert("Ordine Effettuato!!");
            });
            window.location.reload();

            $("#staticBackdrop").modal("Show");
         }
         
         //alert(tot);
         //alert(qta);
         //alert("figa");
     });

     
     /*let divRow1 = $("<div></div>");
     divRow1.attr("class","row");
     divRow1.attr("id","topTable");
     let btnCheck = $("<button></button>");
     btnCheck.html("CONFERMA ORDINE");
     btnCheck.attr("class","btn btn-success");
     divC.append(divRow1);
     divRow1.append(btnCheck);*/
 }

 