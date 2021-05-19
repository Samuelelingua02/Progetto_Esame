$(document).ready(function(){
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

    let getProdotti = sendRequestNoCallback("/api/getProdotti","GET");
    getProdotti.done(function(data){
        console.log(data.data);
        alert("Dio merda i prodotti!!");
        loadTable(data.data);
    });
});

function loadTable(data){
    let divMain = $("#divMain");
    for(let i=0;i<data.length;i++){
        let table = $("<table></table>");
        table.attr("class","table");
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
        th3.html("Quantità");
        tr.append(th3);

        let th4 = $("<th></th>");
        th4.attr("scope","col");
        th4.html("Prezzo");
        tr.append(th4);
        thead.append(tr);
        table.append(thead);
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

        let td8 = $("<td></td>");
        td8.html(parseFloat(data[i].prezzoTot).toFixed(2)+"€");
        tr1.append(td8);

        tbody.append(tr1);
        table.append(tbody);
    }
}