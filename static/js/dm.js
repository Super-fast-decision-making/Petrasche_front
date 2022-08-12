// async function loadUserinfo() {
//     const response_json = await UserInfo()
//     sessionStorage.setItem('id', response_json.id)
//     sessionStorage.setItem('username', response_json.username)
// }
loadUserinfo()

const USER_ID = sessionStorage.getItem('id')
const USER_NAME = sessionStorage.getItem('username')

// 메세지 기록 불러오기 
async function loadMessage(id) {
    const response_json = await getMessage(id)
    sessionStorage.setItem('header_id', response_json[0].id)
    let chat_box = document.getElementById('chat_list')
    chat_box.innerHTML = ''
    for (let i = 0; i < response_json[0].messages.length; i++) {
        let sender = response_json[0].messages[i].sender
        let message = response_json[0].messages[i].message
        let time = response_json[0].messages[i].at_time
        if (USER_NAME == sender) {
            chat_box.innerHTML += ` 
                                <div class="my_user">
                                    <div class="target_user_chat">${message}<br><span style="font-size:12px; margin-top:2px;">${time}</span></div>
                                </div>
                                `
        } else {
            chat_box.innerHTML += `                            
                                <div class="target_user">
                                    <div class="target_user_chat">${message}<br><span style="font-size:12px; margin-top:2px;">${time}</span></div>
                                </div>`
        }
        chat_box.scrollTop = chat_box.scrollHeight;
    }
}

// 헤더 리스트 불러오기
async function loadHeaders(id) {
    const response_json = await getHeader(id)
    const header_list = document.getElementById("user_info")
    header_list.innerHTML = ""
    for (let i = 0; i < response_json.length; i++) {
        let sender_img = response_json[i].sender_img
        let receiver_img = response_json[i].receiver_img
        let header_id = response_json[i].id
        let receiver = response_json[i].receiver
        let sender = response_json[i].sender
        let last_message = response_json[i].last_message.message
        let date = response_json[i].last_message.date
        if (USER_NAME === sender) {
            let chatuser = receiver
            let chatuser_img = receiver_img
            header_list.innerHTML +=
                `<div class="user_box" id="user_box" onclick=chatroomSelect(${header_id})>
                    <div class="user_pr_img">
                        <img src="${chatuser_img}" alt="">
                    </div>
                    <div class="chat_user_pr_info">
                        <div class="chat_user_id">
                            ${chatuser}
                        </div>
                        <div class="chat_user_profile">
                            ${last_message}
                        </div>
                    </div>
                </div>`
        } else {
            let chatuser = sender
            let chatuser_img = sender_img
            header_list.innerHTML +=
                `<div class="user_box" id="user_box" onclick=chatroomSelect(${header_id})>
                    <div class="user_pr_img">
                        <img src="${chatuser_img}" alt="">
                    </div>
                    <div class="chat_user_pr_info">
                        <div class="chat_user_id">
                            ${chatuser}
                        </div>
                        <div class="chat_user_profile">
                            ${last_message}
                        </div>
                    </div>
                </div>`
        }
    }
}
loadHeaders()



// 웹소켓 커넥트
let connectedChatSocket = ''
async function chatroomSelect(id) {
    document.getElementById("not_chat_info").style.display = "none"
    if (connectedChatSocket != '') {
        connectedChatSocket.close()
    }
    await loadMessage(id)

    let url = ws_base_url + "chat/" + id
    const chatSocket = new ReconnectingWebSocket(url)
    connectedChatSocket = chatSocket
    chatSocket.onopen = async function (e) {
        console.log('socket Connect!', e)
    }
    chatSocket.onerror = async function (e) {
        console.log('error', e)
    }
    chatSocket.onclose = async function (e) {
        console.log('close', e)
    }
    chatSocket.onmessage = async function (e) {
        console.log('receive Message!', e)
        let data = JSON.parse(e.data)
        let message = data['message']
        let sent_by_id = data['sender']
        let time = data['time']
        console.log(data)
        newMessage(message, sent_by_id, time)
    }

    let form = document.getElementById('form')
    form.addEventListener('submit', async function (e) {
        e.preventDefault()
        let message = e.target.message.value
        let header = sessionStorage.getItem('header_id')
        chatSocket.send(JSON.stringify({
            'message': message,
            'sent_by': USER_ID,
            'header_id': header,
        }))
        form.reset()
    })
}

function newMessage(message, sent_by_id, time) {
    let messages = document.getElementById("chat_list")
    message.innerHTML = ""
    if (sent_by_id == USER_ID) {
        messages.innerHTML += `<div class="my_user">
                                    <div class="target_user_chat">${message}<br><span style="font-size:12px; margin-top:2px;">${time}</span></div>
                                </div>`
    } else {
        messages.innerHTML += `<div class="target_user">
                                    <div class="target_user_chat">${message}<br><span style="font-size:12px; margin-top:2px;">${time}</span></div>
                                </div>`
    }
    messages.scrollTop = messages.scrollHeight;
}
