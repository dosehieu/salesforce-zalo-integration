$(function () {

    var agentId = 1;
    var zaloUserId = 1;
    var agentName = "Agent hieu";
    var zaloUserName = "Client hieu";
    var zaloUserAvatar = "https://gapit-dev-ed.develop.file.force.com/servlet/servlet.FileDownload?file=0152w000003Bf2I";

    $('#file-button').on('click', function() {
        $('#file-input').trigger('click');
    });

    // Emoji config
    var showEmoji = false;
    $('.emoji-button').on('click', function() {
        showEmoji = !showEmoji;
        if(showEmoji){
            $('.emoji-button').addClass("active");
            $('.emoji-picker').show();
        }else{
            $('.emoji-button').removeClass("active");
            $('.emoji-picker').hide();
        }
    });
    $(".emoji-picker").on("emoji-click", event => {
        var value = $("#chat-box").val();
        $("#chat-box").val( value + event.detail.unicode)
    });
    $(window).click(function() {
        showEmoji = false;
        $('.emoji-button').removeClass("active");
        $('.emoji-picker').hide();
    });
    $('.emoji-picker, .emoji-button').click(function(event){
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

    $(".chat-body").append(Mustache.render(clientText, { avatar: zaloUserAvatar, text: "Hi i am client", name: zaloUserName, time: "12:10" }));
    $(".chat-body").append(Mustache.render(agentText, { text: "Hi i am agent", name: agentName, time: "12:10" }));
    $(".chat-body").append(Mustache.render(clientImg, { avatar: zaloUserAvatar, url: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/empire-state-blue-night-inge-johnsson.jpg", fileName: "22_20220920140111811_0001.jpg",name: zaloUserName,  time: "12:10" }));
    $(".chat-body").append(Mustache.render(agentImg, { url: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/empire-state-blue-night-inge-johnsson.jpg", fileName: "22_20220920140111811_0001.jpg",name: agentName,  time: "12:10" }));
    $(".chat-body").append(Mustache.render(clientFile, { avatar: zaloUserAvatar, fileName: "22_20220920140111811_0001.jpg",name: zaloUserName,  time: "12:10" }));
    $(".chat-body").append(Mustache.render(agentFile, { fileName: "22_20220920140111811_0001.jpg", name: agentName,  time: "12:10" }));
    $(".chat-body").append(Mustache.render(clientSticker, { avatar: zaloUserAvatar, url: "https://fcbk.su/_data/stickers/playful_piyomaru/playful_piyomaru_01.png",name: zaloUserName,  time: "12:10" }));

    $('.chat-box').keypress(function(e){
        var value = $(this).val();
        var validMsg = value.replaceAll("\n", "").replaceAll(" ", "") != "";

        if(e.keyCode == 13 && !e.shiftKey)
        {
            if(validMsg){
                $(".chat-body").append(Mustache.render(agentText, { text: value, name: agentName, time: moment().format("HH:mm A") }));
                socket.emit('send', { agentId: agentId, zaloUserId: zaloUserId, type: "text", text: value });
                $(this).val("");
            }
            e.preventDefault(); 
        }
    });


    //Socket config
    var socket = io.connect('http://localhost:8080');

    socket.on('connect', function() {
        console.log("Socket connected")
    });
    socket.on('disconnect', function(){
        console.log("Socket disconnected")
    });

    //Receive data
    socket.on("send", function (data) {
        console.log("Receive data", data);
        if(!data){
            return false;
        }
        if(data.agentId == agentId && data.zaloUserId == zaloUserId){
            switch(data.type){
                case "text":
                    appendMsg(clientText, { avatar: zaloUserAvatar, text: data.text, name: zaloUserName, time: moment().format("HH:mm A") })
                    break;
            }
        }
    })
})

function appendMsg(template, data){
    $(".chat-body").append(Mustache.render(template, data));
}