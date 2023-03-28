const  { writeFile } = require("fs");
function processChatData(sockets, data){
    
    var msgId = createGuid();
    switch(data.type){
        case "text":
            sockets.emit('send', {...data, msgId: msgId});
            sockets.emit('send', {msgId: msgId, userId: data.userId, zaloUserId: data.zaloUserId, type: "text", text: "reply from client"});
            break;
        case "image":
            var url = uploadFile(data.file, data.fileName);
            sockets.emit('send', {...data, url: url, msgId: msgId});
            sockets.emit('send', {msgId: msgId, userId: data.userId, zaloUserId: data.zaloUserId, type: "image", url: url, fileName: data.fileName});
            break;
        case "file":
            var url = uploadFile(data.file, data.fileName);
            sockets.emit('send', {...data, url: url, msgId: msgId});
            sockets.emit('send', {msgId: msgId, userId: data.userId, zaloUserId: data.zaloUserId, type: "file", url: url, fileName: data.fileName, extension: data.extension});
            break;
    }
    setTimeout(() => {
        sockets.emit('update', {userId: data.userId, zaloUserId: data.zaloUserId, msgId: msgId, status: "Sent"});
    }, 2000);
    setTimeout(() => {
        sockets.emit('update', {userId: data.userId, zaloUserId: data.zaloUserId, msgId: msgId, status: "Seen"});
    }, 4000);
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