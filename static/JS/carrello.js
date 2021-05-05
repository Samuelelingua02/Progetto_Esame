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
            //loadProd(data);
        });
    }
}