function sendRequest(url,method,parameters,callback){
	$.ajax({
		url: url,
		type: method,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        dataType: "json",
        headers: {token: "Bearer " + localStorage.getItem("token")},
		data: parameters,
		timeout : 6000000,
		success: callback,
		error : function(jqXHR, test_status, str_error){
			//console.log("No connection to " + link);
			//console.log("Test_status: " + test_status);
			alert("Error: " + str_error);
		}
	});
}
 
function sendRequestNoCallback(url,method,parameters){
	return $.ajax({
        url: url,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		type: method,
		dataType: "json",
		data: parameters,
		headers: {token: "Bearer " + localStorage.getItem("token")},
		timeout: 5000
	});
}
 
function error(jqXHR, testStatus, strError) {
    if (jqXHR.status == 0)
        alert("server timeout");
    else if (jqXHR.status == 200)
        alert("Formato dei dati non corretto : " + jqXHR.responseText);
    else
        alert("Server Error: " + jqXHR.status + " - " + jqXHR.responseText);
}