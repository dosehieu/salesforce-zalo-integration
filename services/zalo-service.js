const { find } = require("../base/services/app-service")

const processZaloChat = async (job)=>{
    const {io} = require("../index")
    console.log("processZaloChat", job.data);
    var data = job.data;

    // get config by recipient
    var config = await find({ recipient: data.recipient.id}, "config");
    if(!config){
        return false;
    }

    // Has no Zalo Session or status = End => Create new Zalo Session
    // if(data.event_name.startWith("user_send") && false){
        
    //     return;
    // }

    // Has Zalo Session status = Chatting => send socket msg
    var groupName = `group-${config.org_id}-${data.sender.id}`;

    console.log("groupName", groupName);
    switch(data.event_name){
        case "user_send_text":
            io.to(groupName).emit('send', {msgId: data.message.msg_id, zaloUserId: data.sender.id, type: "text", text: data.message.text});
            break;
        case "user_send_image": 
            io.to(groupName).emit('send', {msgId: data.message.msg_id, zaloUserId: data.sender.id, type: "image", url: data.message.attachments[0].payload.url});
            break;
        case "user_send_file": 
            io.to(groupName).emit('send', {msgId: data.message.msg_id, zaloUserId: data.sender.id, type: "file", url: data.message.attachments[0].payload.url, fileName: data.message.attachments[0].payload.name});
            break;
        case "user_send_sticker": 
            io.to(groupName).emit('send', {msgId: data.message.msg_id, zaloUserId: data.sender.id, type: "sticker", url: data.message.attachments[0].payload.url});
            break;
        case "user_received_message" :
            io.to(groupName).emit('update', {msgId: data.message.msg_id, zaloUserId: data.sender.id, status: "Delived"});
            break;
        case "user_seen_message" :
            io.to(groupName).emit('update', {msgId: data.message.msg_ids[data.message.msg_ids.length-1].msg_id, zaloUserId: data.sender.id, status: "Seen"});
            break;
    }
}

module.exports = {processZaloChat}