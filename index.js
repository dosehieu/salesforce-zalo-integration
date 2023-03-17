const express = require('express');
const app = express();
const request = require('request');
const wikip = require('wiki-infobox-parser');

//ejs
app.set("view engine", 'ejs');

//routes
app.get('/', (req,res) =>{
    res.render('chat');
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
    allowEIO3: true // false by default
  });
io.on('connection', function (socket) {
    socket.on('send', function (data) {
        io.sockets.emit('send', {agentId: data.agentId, zaloUserId: data.zaloUserId, type: "text", text: "reply from clent"});
    });
});

//port
server.listen(8080, console.log("Listening at port 8080..."))