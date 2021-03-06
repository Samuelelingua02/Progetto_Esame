//const { Alert } = require("bootstrap");

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

    let getProdotti = sendRequestNoCallback("/api/getProdottiOrd","GET");
    getProdotti.done(function(data){
        console.log(data.data);
        //alert("Dio merda i prodotti!!");
        loadTable(data.data);
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
    
});
let utenti = new Array();
function loadTable(data){
    
    for(let i=0;i<data.length;i++){
        utenti[i] = data[i].idUtente;
        //let user1 = data[i].idUtente;
    }
    let utentiGOD = new Array();
    utentiGOD = utenti.filter(function(ele, pos){//elimina i duplicati nell array
        return utenti.indexOf(ele) == pos;
    });
    //alert("Array filtrato: "+utentiGOD);

    for(let i=0;i<utentiGOD.length;i++){
        let user = utentiGOD[i];
        //alert(user);
        let getProducts = sendRequestNoCallback("/api/getProducts","POST",{utente:user});
        getProducts.done(function(data){
            console.log(data.data);
            loadTable2(data.data); 
        });
    }
}

function loadTable2(data,utent){
    let j=0;

    
    for(let i=0;i<data.length;i++){
        //alert(data[i].descrizione);
        j++;

        if(i>0){
            let divMain = $("#divMain");
            let table = $("<table></table>");
            table.attr("class","table");
            divMain.append(table);
            let tbody = $("<tbody></tbody>");
            let tr1 = $("<tr></tr>");

            let th5 = $("<th></th>");
            th5.attr("scope","row");
            th5.html(i);
            tr1.append(th5);

            let td6 = $("<td></td>");
            td6.html(data[i].descrizione);
            tr1.append(td6);
    
            let td7 = $("<td></td>");
            td7.html(data[i].quantita);
            tr1.append(td7);
    
            let td9 = $("<td></td>");
            if(data[i].pagamentoSatispay=="true"){
                td9.html("Satispay");
            }else
            {
                td9.html("Contanti");
            }
            
            tr1.append(td9);
    
            let td8 = $("<td></td>");
            td8.html(parseFloat(data[i].prezzoTot).toFixed(2)+"???");
            tr1.append(td8);

            let td10 = $("<td></td>");
            td10.attr("width","138px");
            tr1.append(td10);
    
            tbody.append(tr1);
            table.append(tbody);

        }else if(i==0){
            let divMain = $("#divMain");
            let table = $("<table></table>");
            table.attr("class","table");
            table.attr("id",j);
            divMain.append(table);
            let thead = $("<thead></thead>");
            let tr = $("<tr></tr>");
    
            let th1 = $("<th></th>");
            th1.attr("scope","col");
            th1.html("#");
            tr.append(th1);
    
            let th2 = $("<th></th>");
            th2.attr("scope","col");
            th2.html("Ordine di : "+data[i].idUtente);
            tr.append(th2);
    
            let th3 = $("<th></th>");
            th3.attr("scope","col");
            th3.html("Quantit??");
            tr.append(th3);
    
            let th4 = $("<th></th>");
            th4.attr("scope","col");
            th4.html("Pagamento");
            tr.append(th4);
            thead.append(tr);
            table.append(thead);
            let tbody = $("<tbody></tbody>");
            let tr1 = $("<tr></tr>");
    
            let th5 = $("<th></th>");
            th5.attr("scope","row");
            th5.html(i);
            tr1.append(th5);
    
            let th6 = $("<th></th>");
            th6.attr("scope","col");
            th6.html("Prezzo");
            tr.append(th6);
    
            let td6 = $("<td></td>");
            td6.html(data[i].descrizione);
            tr1.append(td6);
    
            let td7 = $("<td></td>");
            td7.html(data[i].quantita);
            tr1.append(td7);
    
            let td9 = $("<td></td>");
            if(data[i].pagamentoSatispay=="true"){
                td9.html("Satispay");
            }else
            {
                td9.html("Contanti");
            }
            
            tr1.append(td9);
    
            let td8 = $("<td></td>");
            td8.html(parseFloat(data[i].prezzoTot).toFixed(2)+"???");
            tr1.append(td8);

            let td10 = $("<th></th>")
            let btn = $("<button></button>");
            btn.attr("class","btn btn-outline-success");
            btn.attr("id",data[i].idUtente);
            btn.on("click",function(){
                let username = this.id;
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();
                
                today = dd + '/' + mm + '/' + yyyy;
                
                let caricaStorico = sendRequestNoCallback("/api/getProducts","POST",{utente:username});
                caricaStorico.done(function(data){
                    console.log(data.data);
                    let tot=0;
                    for(let j=0;j<data.data.length;j++){
                        
                        tot +=data.data[j].prezzoTot;
                    }
                    
                    for(let i=0;i<data.data.length;i++){
                      // alert("gazzo")
                        let caricaStorico = sendRequestNoCallback("/api/caricaStorico","POST",{idUser:data.data[i].idUtente,idProd:data.data[i].idProdotto,descr:data.data[i].descrizione,qta:data.data[i].quantita,pagamentoSat:data.data[i].pagamentoSatispay,totale:tot,dataOrdine:today});
                        caricaStorico.done(function(data){
                            console.log("caricaStorico ok");
                            caricaRimuovi(username);
                        });
                        caricaStorico.fail(function(a,b,c){
                            console.log(a,b,c);
                        });
                        
                    }
                });

                
                
                let getProducts = sendRequestNoCallback("/api/getProducts","POST",{utente:username});
                getProducts.done(function(data){
                    console.log(data.data);
                    let totale=0;
                    for(let i=0;i<data.data.length;i++){
                        totale +=data.data[i].prezzoTot;
                    }
                     //alert(totale);

                     let getMail = sendRequestNoCallback("/api/getMail","POST",{utente:username});
                     getMail.done(function(data){
                        console.log(data.data);
                        let email = data.data[0].Email;
                        //alert(email);
                        let sendMail = sendRequestNoCallback("/api/invioMail","POST",{Mail:email,total:totale});
                        sendMail.done(function(data){
                            alert("Mail inviata!!");
                        });
                     });
                });
               
               
            });
            btn.html("ORDINE PRONTO");
            td10.append(btn);
            tr.append(td10);
    
            tbody.append(tr1);
            table.append(tbody);
        }
        
    }
}

function caricaRimuovi(username){
    //alert("Eliminato god!!");
    let remove = sendRequestNoCallback("/api/removeOrder","POST",{utente:username});
    remove.done(function(data){
        console.log(data.data);
       
    });
    window.location.reload();
}