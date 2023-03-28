
// processZaloChat {
//     orgId: '3388f0b8-7d8c-49f2-b6ff-9d45d184186e',
//     body: {
//       app_id: '2719572259784586845',
//       user_id_by_app: '7121708890160947528',
//       event_name: 'user_send_text',
//       timestamp: '1679968144168',
//       sender: { id: '1059847062003748304' },
//       recipient: { id: '579745863508352884' },
//       message: { msg_id: 'This is message id', text: 'This is testing message' }
//     }
//   }

const processZaloChat = async (job)=>{
    console.log("processZaloChat", job.data);
    // get config job.data.orgId, verify recipient
    var data = job.data.body;
    var groupName = `group-${job.data.orgId}-${data.sender.id}`;

    switch(data.event_name){
        case "user_send_text":
            break;
    }
}

module.exports = {processZaloChat}