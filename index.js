const express = require('express');
const app = express();
const request = require('request');
const wikip = require('wiki-infobox-parser');
const {processChatData} = require('./service/chatService')

//ejs
app.set("view engine", 'ejs');

//routes
app.get('/zalo-chat', (req,res) =>{
    const orgId = req.query.orgId;
    if(orgId == "3388f0b8-7d8c-49f2-b6ff-9d45d184186e"){
        res.render('zalo-chat');
    }else{
        res.render('404');
    }
});

app.get('/detail', (req,res) =>{
    res.render('detail');
});

app.get('/index', (req,response) =>{
    let url = "https://en.wikipedia.org/w/api.php"
    let params = {
        action: "opensearch",
        search: req.query.person,
        limit: "1",
        namespace: "0",
        format: "json"
    }

    url = url + "?"
    Object.keys(params).forEach( (key) => {
        url += '&' + key + '=' + params[key]; 
    });

    //get wikip search string
    request(url,(err,res, body) =>{
        if(err) {
            response.redirect('404');
        }
            result = JSON.parse(body);
            x = result[3][0];
            x = x.substring(30, x.length); 
            //get wikip json
            wikip(x , (err, final) => {
                if (err){
                    response.redirect('404');
                }
                else{
                    const answers = final;
                    response.send(answers);
                }
            });
    });

    
});

app.use('/public', express.static('public'));

//init socket 
var server = require('http').createServer(app);
var io = require('socket.io')(server, {
    allowEIO3: true, // false by default
    maxHttpBufferSize: 1e8
  });
io.on('connection', function (socket) {

  const orgId = socket.handshake.query.orgId;
  const clientId = socket.handshake.query.clientId;
  const groupName = `org-${orgId}-${clientId}`;
  console.log(groupName)
    socket.join(groupName);

    socket.on('send', function (data) {
        try{
            processChatData(io.to(groupName), data)
        }catch(error){
            console.log("Lỗi", error)
        }
    });
});

//port
server.listen(8080, console.log("Listening at port 8080..."))