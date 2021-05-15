$(document).ready(function(){
    let visualizzaCarrello = sendRequestNoCallback("/api/visualizzaCarrello","GET");
    visualizzaCarrello.done(function(data){
        console.log(data.data);
       // alert("figa");
        visualizza(data.data);
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
             alert(data[i]._id);
            let btnElimina = sendRequestNoCallback("/api/btnElimina","POST",{idProdotto:data[i]._id});
            btnElimina.fail(function(jqXHR,test_status,str_error){
               // error(jqXHR,test_status,str_error);
                alert("Errore!!");
            });
            btnElimina.done(function(data){
                //localStorage.setItem("token",data.token);
                window.location.href = "static/carrello.html";
            });
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
         input.attr("id","qta");
         input.attr("style","color: black; text-align: center; width: 120px;");
         divRow.append(div6);
         div6.append(input);

         let div7 = $("<div></div>");
         div7.attr("class","col-sm-1");
         let qta = $("#qta").val();
         let prez = data[i].prezzo;
         div7.html(prez*qta+" €");
         divRow.append(div7);

         let div8 = $("<div></div>");
         div8.attr("class","col-sm-1");
         divRow.append(div8);
     }
 }