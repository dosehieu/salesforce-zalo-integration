const fileIconConfig = [
    { name: "xlsx", icon: "fa-file-excel", color: "#217346" },
    { name: "xls", icon: "fa-file-excel", color: "#217346" },
    { name: "pdf", icon: "fa-file-pdf", color: "#f40f02" },
    { name: "pptx", icon: "fa-file-powerpoint", color: "#d24726" },
    { name: "ptx", icon: "fa-file-powerpoint", color: "#d24726" },
    { name: "doc", icon: "fa-file-word", color: "#2b579a" },
    { name: "docx", icon: "fa-file-word", color: "#2b579a" },
    { name: "csv", icon: "fa-file-csv", color: "#217346" },
    { name: "rar", icon: "fa-file-zipper", color: "#217346" },
    { name: "zip", icon: "fa-file-zipper", color: "#217346" },
];
const defaultIcon = { icon: "fa-file", color: "#217346" };
const connectModal = new bootstrap.Modal($("#socketConnect"));
var chatDisabled = false;
var showChooseFile = false;
var showEmoji = false;
var showEndChatForm = false;
var isDragOver = false;
var dragLeaveTimeout  = [];
var latestAgenMsgId = null;
$(document).ready(function () {
    //window.addEventListener("message", receiveMessage, false);
    var event = {
        data: {
            orgId: "3388f0b8-7d8c-49f2-b6ff-9d45d184186e",
            "zaloUserId": "2486447953218085222",
            "chatId": "ZS-0021",
            "zaloUserName": "Dose hieu",
            "avatarUrl": "https://gapit-dev-ed.develop.file.force.com/servlet/servlet.FileDownload?file=0152w000003Bf2I&test=1",
            "userId": "0052w00000EnuzwAAB",
            "userName": "Hieu Nguyen",
            "startedBy": "Hieu Nguyen",
            "startTime": "2023-03-23T09:49:59.760Z",
            "endedBy": "",
            "endTime": "",
            "status": "Waiting"
        }
    }
    receiveMessage(event);
    $('.browse-file').on('click', function() {
        $('#file-input').trigger('click');
    });

    window.addEventListener("offline",function () { $(".chat-offline").show();scrollToEndMsg();});
    window.addEventListener("online",function () { $(".chat-offline").hide();scrollToEndMsg();});
    
    // File picker config
    $('.file-button').on('click', function() {
        if(chatDisabled){
            return false;
        }
        showChooseFile =!showChooseFile;
        if(!showChooseFile){
            closeFilePicker();
            return false;
        }
        openFilePicker();
        if(showEmoji){
            showEmoji = false;
            closeEmojiPicker();
        }
    });
    // Emoji picker config
    $('.emoji-button').on('click', function() {
        if(chatDisabled){
            return false;
        }
        showEmoji =!showEmoji;
        if(!showEmoji){
            closeEmojiPicker();
            return false;
        }
        openEmojiPicker();
        if(showChooseFile){
            showChooseFile = false;
            closeFilePicker();
        }
        
    });
    $(".emoji-picker").on("emoji-click", event => {
        var value = $("#chat-box").val();
        $("#chat-box").val( value + event.detail.unicode)
    });

    $(window).click(function() {
        showEmoji = false;
        showChooseFile = false;
        showEndChatForm = false;
        closeEmojiPicker();
        closeFilePicker();
        $(".end-chat-popover").hide();
    });

    $('.emoji-picker, .emoji-button, .file-button, .file-picker, .end-chat, .end-chat-popover').click(function(event){
        event.stopPropagation();
    });

    $(".end-chat").on("click", function(){
        showEndChatForm =!showEndChatForm;
        if(!showEndChatForm){
            $(".end-chat-popover").hide();
            return false;
        }
        $(".end-chat-popover").show();
    });
    $(".end-chat-cancel").on("click", function(){
        showEndChatForm = false;
        $(".end-chat-popover").hide();
    });

    
});

function receiveMessage(event) {
    var paramObject = event.data;
    setInfo();
    const socket = io.connect(window.location.origin, {
        query: {
          zaloUserId: paramObject.zaloUserId,
          orgId: paramObject.orgId,
        }
    });
    $(".btn-end-chat").on("click", function(){
        showEndChatForm = false;
        socket.emit('end', {userId: paramObject.userId, userName: paramObject.userName, zaloUserId: paramObject.zaloUserId, time: new Date() });
    });
    $('#file-input').on("change", function(event){
        if(chatDisabled){
            return false;
        }
        var file = event.target.files[0];
        processInputFile(file);
    });

    // Mustache config
    let clientText = $("#client-text").html();
    let clientImg = $("#client-img").html();
    let clientFile = $("#client-file").html();
    let clientSticker = $("#client-sticker").html();
    Mustache.parse(clientText);
    Mustache.parse(clientImg);
    Mustache.parse(clientFile);
    Mustache.parse(clientSticker);

    let agentText = $("#agent-text").html();
    let agentFile = $("#agent-file").html();
    let agentImg = $("#agent-img").html();
    Mustache.parse(agentText);
    Mustache.parse(agentFile);
    Mustache.parse(agentImg);

    $(".chat-body").append(Mustache.render(clientText, { avatar: paramObject.avatarUrl, text: "Hi i am client", name: paramObject.zaloUserName, time: "12:10" }));
    $(".chat-body").append(Mustache.render(agentText, { text: "Hi i am agent", name: paramObject.userName, time: "12:10" }));
    $(".chat-body").append(Mustache.render(clientImg, { avatar: paramObject.avatarUrl, url: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/empire-state-blue-night-inge-johnsson.jpg", fileName: "22_20220920140111811_0001.jpg",name: paramObject.zaloUserName,  time: "12:10" }));
    $(".chat-body").append(Mustache.render(agentImg, { url: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/empire-state-blue-night-inge-johnsson.jpg", fileName: "22_20220920140111811_0001.jpg",name: paramObject.userName,  time: "12:10" }));
    $(".chat-body").append(Mustache.render(clientFile, {icon: "fa-file-excel", iconColor: "green", url: "/../public/upload/71b2e62f-0028-4dee-b854-6af9e3e8483a6a684df8-3950-4be0-9443-f551de6fa466OTT_20230222.xlsx", type: "file", avatar: paramObject.avatarUrl, fileName: "22_20220920140111811_0001.xlsx",name: paramObject.zaloUserName,  time: "12:10" }));
    $(".chat-body").append(Mustache.render(agentFile, {icon: "fa-file-excel", iconColor: "green",url: "/../public/upload/71b2e62f-0028-4dee-b854-6af9e3e8483a6a684df8-3950-4be0-9443-f551de6fa466OTT_20230222.xlsx", type: "file", fileName: "22_20220920140111811_0001.xlsx", name: paramObject.userName,  time: "12:10" }));
    $(".chat-body").append(Mustache.render(clientSticker, { avatar: paramObject.avatarUrl, url: "https://fcbk.su/_data/stickers/playful_piyomaru/playful_piyomaru_01.png",name: paramObject.zaloUserName,  time: "12:10" }));
    
    //Socket config
    socket.on('connect', function() {
        console.log("Socket connected");
    });
    socket.on('disconnect', function(){
        console.log("Socket disconnected");
    });

    //Receive data
    socket.on("send", function (data) {
        console.log("Receive data", data);
        if(!data || data.zaloUserId != paramObject.zaloUserId){
            return false;
        }

        if(data.fromAgent){
            latestAgenMsgId = data.msgId;
            $(".agent-msg").find(".msg-status-block").hide();
        }
        var time = moment().format("HH:mm A");
        switch(data.type){
            case "text":
                if(data.fromAgent){
                    appendMsg(agentText, { msgId: data.msgId, text: data.text, name: data.userName, time: time });
                }else{
                    appendMsg(clientText, { msgId: data.msgId, avatar: paramObject.avatarUrl, text: data.text, name: paramObject.zaloUserName, time: time });
                }
                break;
            case "sticker":
                    appendMsg(clientSticker, { msgId: data.msgId, avatar: paramObject.avatarUrl, url: data.url , name: paramObject.zaloUserName,  time: time });
                break;
            case "image":
                var split = data.url.split("/");
                var fileName = "";
                if(split && split.length > 0){
                    fileName = split[split.length-1];
                }
                if(data.fromAgent){
                    appendMsg(agentImg, { msgId: data.msgId, url: data.url, fileName: fileName, name: data.userName, time: time });
                }else{
                    appendMsg(clientImg, { msgId: data.msgId, avatar: paramObject.avatarUrl, url: data.url, fileName: fileName, name: paramObject.zaloUserName, time: time });
                }
                
                break;
            case "file":

                var split = data.fileName.split(".");
                var extension = split[split.length-1];
                var iconConfig = fileIconConfig.find(x=> x.name == extension) ?? defaultIcon;
                if(data.fromAgent){
                    appendMsg(agentFile, { msgId: data.msgId, url: data.url, fileName: data.fileName, name: data.userName, time: time, icon: iconConfig.icon, iconColor: iconConfig.color });
                }else{
                    appendMsg(clientFile, { msgId: data.msgId, avatar: paramObject.avatarUrl, url: data.url, fileName: data.fileName, name: paramObject.zaloUserName, time: time, icon: iconConfig.icon, iconColor: iconConfig.color });
                }
               
                break;
        };
        $("#" + data.msgId).find(".msg-status-block").show();
        scrollToEndMsg();
    });

    socket.on("update", function (data) {
        console.log("Receive data update", data);
        if(!data || data.zaloUserId != paramObject.zaloUserId || data.msgId != latestAgenMsgId){
            return false;
        }
        $("#" + data.msgId).find(".msg-status-block").show();
        $("#" + data.msgId).find(".msg-status").text(data.status);
    });

    socket.on("end", function (data) {
        console.log("End chat", data);
        if(!data || data.zaloUserId != paramObject.zaloUserId){
            return false;
        }
        $(".end-chat-popover").hide();
        $(".chat-end").show();
        $("#endedBy").text(data.userName);
        $("#endTime").text(new moment(data.time).format("HH:mm A, DD/MM/YYYY"));
        disableChat();
    });

    // Process sent msg
    $('.chat-box').keypress(function(e){

        if(chatDisabled){
            return false;
        }
        var value = $(this).val();
        var validMsg = value.replaceAll("\n", "").replaceAll(" ", "") != "";

        if(e.keyCode == 13 && !e.shiftKey)
        {
            if(validMsg){
                $(".agent-msg").find(".msg-status-block").hide();
                socket.emit('send', {userId: paramObject.userId, userName: paramObject.userName, zaloUserId: paramObject.zaloUserId, type: "text", text: value, fromAgent: true });
                $(this).val("");
            }
            e.preventDefault(); 
        }
    });

    function setInfo(){
        switch(paramObject.status){
            case "Waiting":
                paramObject.startTime = new Date();
                paramObject.startedBy = paramObject.userName;
                // SF update startTime, startedBy , status, waitingTime
                break;
            case "Chatting": 
                break;
            case "Ended":
                $(".chat-end").show();
                $("#endedBy").text(paramObject.endedBy);
                $("#endTime").text(new moment(paramObject.endTime).format("HH:mm A, DD/MM/YYYY"));
                disableChat();
                break;
        }
    
        $("#startedBy").text(paramObject.startedBy);
        $("#startTime").text(new moment(paramObject.startTime).format("HH:mm A, DD/MM/YYYY"));
    
        console.log("data",paramObject);
        console.log("href",window.location.href);
    }
    
    function processInputFile(file){
        if(!file || !checkFileValid(file)){
            return false;
        }
        $(".agent-msg").find(".msg-status-block").hide();
        if(file.type && file.type.split("/")[0] == "image"){
            socket.emit('send', { userId: paramObject.userId, userName: paramObject.userName, zaloUserId: paramObject.zaloUserId, type: "image", fileName: file.name, fromAgent: true, file: file});
        }else{
            var extension = getFileExtension(file);
            socket.emit('send', { userId: paramObject.userId, userName: paramObject.userName, zaloUserId: paramObject.zaloUserId, type: "file", fileName: file.name, extension: extension, fromAgent: true, file: file});
        }
        $(".file-button").click();
    }

    $("#drop-zone").on("drop", function(event) {
        console.log("File(s) dropped");
      
        $(".drag-over-block").hide();
        $(".drop-file-block").show();
        // Prevent default behavior (Prevent file from being opened)
        event.preventDefault();
        const file = event.originalEvent.dataTransfer.files[0];
        processInputFile(file)
    });
}

function disableChat(){
    chatDisabled = true;
    $(".chat-box").attr("disabled","disabled");
    $(".end-chat").attr("disabled","disabled");
    $(".icon-button").addClass("icon-button-disabled");
    if(showEmoji){
        showEmoji = false;
        closeEmojiPicker();
    }
    if(showChooseFile){
        showChooseFile = false;
        closeFilePicker();
    }
    scrollToEndMsg();
}

function enableChat(){
    chatDisabled = false;
    $(".chat-box").removeAttr("disabled");
    $(".end-chat").removeAttr("disabled");
    $(".icon-button").removeClass("icon-button-disabled");
    scrollToEndMsg();
}


function closeFilePicker(){
    $('.file-button').removeClass("active");
    $(".file-picker").hide();
    $(".invalid-file").hide();
    $(".valid-file").show();
    $('#file-input').val(null);
}
function closeEmojiPicker(){
    $('.emoji-button').removeClass("active");
    $('.emoji-picker').hide();
}

function openFilePicker(){
    $('.file-button').addClass("active");
    $(".file-picker").show();
}
function openEmojiPicker(){
    $('.emoji-button').addClass("active");
    $('.emoji-picker').show();
}

function getFileExtension(file){
    return file.name.substring(file.name.lastIndexOf(".")+ 1, file.name.length);
}

function scrollToEndMsg(){
    $(".chat-wrap").scrollTop($(".chat-body").height());
}

function appendMsg(template, data){
    $(".chat-body").append(Mustache.render(template, data));
}
function checkFileValid(file){
    var extension = getFileExtension(file);
    console.log("file.type",file.type)
    $(".file-picker-name").text(file.name)

    var fileIcon = fileIconConfig.find(x=>x.name == extension);
    var error = [];
    if(!fileIcon && file.type && file.type.split("/")[0] != "image"){
        error.push("Unsupport media type");
    }
    console.log(file.size)
    if(file.size > 5*1024*1024){
        error.push("File too large");
    }

    if(error.length > 0){
        $(".file-invalid-msg").text(error.join(", "));
        $(".invalid-file").show();
        $(".valid-file").hide();
        return false;
    }
    return true;
}



function dragOverHandler(ev) {
    isDragOver = true;
    dragLeaveTimeout.forEach(timeoutID => {
        clearTimeout(timeoutID);
    });
    $(".drag-over-block").show();
    $(".drop-file-block").hide();
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

function dragLeaveHandler(ev) {
    isDragOver = false;
    const timeoutID = setTimeout(() => {
        if(!isDragOver){
            $(".drag-over-block").hide();
            $(".drop-file-block").show();
        }
    },100);
    dragLeaveTimeout.push(timeoutID);
    ev.preventDefault();
}


