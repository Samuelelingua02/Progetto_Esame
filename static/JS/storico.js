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

    let getOrdini = sendRequestNoCallback("");
});