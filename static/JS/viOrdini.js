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
    });
});