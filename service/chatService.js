const  { writeFile } = require("fs");
function processChatData(sockets, data){
    
    switch(data.type){
        case "text":
            sockets.emit('send', data);
            sockets.emit('send', {agentId: data.agentId, zaloUserId: data.zaloUserId, type: "text", text: "reply from client"});
            break;
        case "image":
            var url = uploadFile(data.file, data.fileName);
            sockets.emit('send', {...data, url: url});
            sockets.emit('send', {agentId: data.agentId, zaloUserId: data.zaloUserId, type: "image", url: url, fileName: data.fileName});
            break;
        case "file":
            var url = uploadFile(data.file, data.fileName);
            sockets.emit('send', {...data, url: url});
            sockets.emit('send', {agentId: data.agentId, zaloUserId: data.zaloUserId, type: "file", url: url, fileName: data.fileName, extension: data.extension});
            break;
    }
}

function uploadFile(file, fileName){
    var path = "/../public/upload/" + createGuid() + fileName;
    writeFile(__dirname + path, file, (err) => {});
    return path;
}
function createGuid()
{  
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {  
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });  
}

module.exports = {processChatData}