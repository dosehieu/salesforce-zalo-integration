
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
const paramObject = getParamObject();
const socket = io.connect(window.location.origin, {
    query: {
      clientId: paramObject.clientId,
      orgId: paramObject.orgId,
    }
});
const connectModal = new bootstrap.Modal($("#socketConnect"));
const agentId = 1;
const zaloUserId = 1;
const agentName = "Agent hieu";
const zaloUserName = "Client hieu";
const zaloUserAvatar = "https://gapit-dev-ed.develop.file.force.com/servlet/servlet.FileDownload?file=0152w000003Bf2I";
var showChooseFile = false;
var showEmoji = false;
var isDragOver = false;
var dragLeaveTimeout  = [];

$(document).ready(function () {

    $('.browse-file').on('click', function() {
        $('#file-input').trigger('click');
    });
    
    // File picker config
    $('.file-button').on('click', function() {
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
        closeEmojiPicker();
        closeFilePicker();
    });

    $('.emoji-picker, .emoji-button, .file-button, .file-picker').click(function(event){
        event.stopPropagation();
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

    $(".chat-body").append(Mustache.render(clientSticker, { avatar: zaloUserAvatar, url: "https://fcbk.su/_data/stickers/playful_piyomaru/playful_piyomaru_01.png",name: zaloUserName,  time: "12:10" }));
    $(".chat-body").append(Mustache.render(clientSticker, { avatar: zaloUserAvatar, url: "https://fcbk.su/_data/stickers/playful_piyomaru/playful_piyomaru_01.png",name: zaloUserName,  time: "12:10" }));
    $(".chat-body").append(Mustache.render(clientSticker, { avatar: zaloUserAvatar, url: "https://fcbk.su/_data/stickers/playful_piyomaru/playful_piyomaru_01.png",name: zaloUserName,  time: "12:10" }));
    $(".chat-body").append(Mustache.render(clientSticker, { avatar: zaloUserAvatar, url: "https://fcbk.su/_data/stickers/playful_piyomaru/playful_piyomaru_01.png",name: zaloUserName,  time: "12:10" }));
    $(".chat-body").append(Mustache.render(clientSticker, { avatar: zaloUserAvatar, url: "https://fcbk.su/_data/stickers/playful_piyomaru/playful_piyomaru_01.png",name: zaloUserName,  time: "12:10" }));
    $(".chat-body").append(Mustache.render(clientSticker, { avatar: zaloUserAvatar, url: "https://fcbk.su/_data/stickers/playful_piyomaru/playful_piyomaru_01.png",name: zaloUserName,  time: "12:10" }));
    $(".chat-body").append(Mustache.render(clientSticker, { avatar: zaloUserAvatar, url: "https://fcbk.su/_data/stickers/playful_piyomaru/playful_piyomaru_01.png",name: zaloUserName,  time: "12:10" }));
    $(".chat-body").append(Mustache.render(clientSticker, { avatar: zaloUserAvatar, url: "https://fcbk.su/_data/stickers/playful_piyomaru/playful_piyomaru_01.png",name: zaloUserName,  time: "12:10" }));
    $(".chat-body").append(Mustache.render(clientSticker, { avatar: zaloUserAvatar, url: "https://fcbk.su/_data/stickers/playful_piyomaru/playful_piyomaru_01.png",name: zaloUserName,  time: "12:10" }));

    //Socket config

    socket.on('connect', function() {
        console.log("Socket connected");
        connectModal.hide();
    });
    socket.on('disconnect', function(){
        connectModal.show();
        console.log("Socket disconnected");
    });

    //Receive data
    socket.on("send", function (data) {
        console.log("Receive data", data);
        if(!data){
            return false;
        }
        if(data.agentId == agentId && data.zaloUserId == zaloUserId){
            var time = moment().format("HH:mm A");
            switch(data.type){
                case "text":
                    if(data.fromAgent){
                        appendMsg(agentText, { text: data.text, name: agentName, time: time });
                    }else{
                        appendMsg(clientText, { avatar: zaloUserAvatar, text: data.text, name: zaloUserName, time: time });
                    }
                    break;
                case "image":
                    if(data.fromAgent){
                        appendMsg(agentImg, { url: data.url, fileName: data.fileName, name: agentName, time: time });
                    }else{
                        appendMsg(clientImg, { avatar: zaloUserAvatar, url: data.url, fileName: data.fileName, name: zaloUserName, time: time });
                    }
                    
                    break;
                case "file":
                    var iconConfig = fileIconConfig.find(x=> x.name == data.extension) ?? defaultIcon;
                    if(data.fromAgent){
                        appendMsg(agentFile, { url: data.url, fileName: data.fileName, name: agentName, time: time, icon: iconConfig.icon, iconColor: iconConfig.color });
                    }else{
                        appendMsg(clientFile, { avatar: zaloUserAvatar, url: data.url, fileName: data.fileName, name: zaloUserName, time: time, icon: iconConfig.icon, iconColor: iconConfig.color });
                    }
                   
                    break;
            };
            scrollToEndMsg();
        }
    });

    // Process sent msg
    $('.chat-box').keypress(function(e){
        var value = $(this).val();
        var validMsg = value.replaceAll("\n", "").replaceAll(" ", "") != "";

        if(e.keyCode == 13 && !e.shiftKey)
        {
            if(validMsg){
                socket.emit('send', {agentId: agentId, zaloUserId: zaloUserId, type: "text", text: value, fromAgent: true });
                $(this).val("");
            }
            e.preventDefault(); 
        }
    });

    $('#file-input').on("change", function(event){
        var file = event.target.files[0];
        processInputFile(file);
    })
});
function getParamObject(){
    var params = location.href.split('?')[1].split('&');
    data = {};
    for (x in params)
    {
        data[params[x].split('=')[0]] = params[x].split('=')[1];
    }
    return data; 
}

function processInputFile(file){
    if(!file || !checkFileValid(file)){
        return false;
    }
    
    if(file.type && file.type.split("/")[0] == "image"){
        socket.emit('send', { agentId: agentId, zaloUserId: zaloUserId, type: "image", fileName: file.name, fromAgent: true, file: file});
    }else{
        var extension = getFileExtension(file);
        socket.emit('send', { agentId: agentId, zaloUserId: zaloUserId, type: "file", fileName: file.name, extension: extension, fromAgent: true, file: file});
    }
    $(".file-button").click();
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

function dropHandler(event) {
    console.log("File(s) dropped");
  
    $(".drag-over-block").hide();
    $(".drop-file-block").show();
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    processInputFile(file)
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

