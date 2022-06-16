function test(jsonArr) {
    var xhr = new XMLHttpRequest(),
        method = "GET",
        jsonRequestURL = "data.json";

    xhr.open(method, jsonRequestURL, true);
    xhr.onreadystatechange = function () {
        console.log(xhr.readyState)
        console.log(xhr.status)
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr)
            // we convert your JSON into JavaScript object

            // we add new value:

            // we send with new request the updated JSON file to the server:
            xhr.open("POST", jsonRequestURL, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            // if you want to handle the POST response write (in this case you do not need it):
            // xhr.onreadystatechange = function(){ /* handle POST response */ };
            console.log('send start')
            xhr.send("jsonTxt=" + JSON.stringify(jsonArr));
            console.log('send end')
            // but on this place you have to have a server for write updated JSON to the file
        }
    };
    xhr.send(null);
}