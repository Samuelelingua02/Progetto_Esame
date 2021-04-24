$(document).ready(function () {  
    let callbackLogin = sendRequestNoCallback("/Redirect","GET");
    callbackLogin.done(function(user){
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

    let caricaCard = sendRequestNoCallback("/api/CaricaPezzi","GET");
    caricaCard.done(function(data){
        caricaProd(data);
        console.log(data);
    });
});
function caricaProd(data){
    let divIniziale = $("#divIniziale");
    for(let i=0;i<data.length;i++){
        let div = $("<div></div>");
        div.attr("id","card");
        divIniziale.append(div);
        let div2 = $("<div></div>");
        div2.attr("class","food-image");
        div.append(div2);
        let img =$("<img>");
        div2.append(img);
        let div3 = $("<div></div>");
        div2.append(div3);
    }

}