// 로그인 유저 불러오기
async function getUserInfo() {
    const response = await fetch(`${backend_base_url}user/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    sessionStorage.setItem('id', response_json.id)
    sessionStorage.setItem('username', response_json.username)
    return response_json
}
getUserInfo()
const USER_ID = sessionStorage.getItem('id')
const USER_NAME = sessionStorage.getItem('username')


// 내 채팅방 불러오기 
async function getHeader() {
    const response = await fetch(`${backend_base_url}dm/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    const header_list = document.getElementById("header_list")
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
                `<div class="header" id="header" onclick=chatroomSelect(${header_id})>
                <div class="header_user_profile_img">
                    <img id="user_profile_img"
                                src="${chatuser_img}">

                </div>
                <div class="header_user_profile" >
                    <div class="username" id="username">${chatuser} </div>
                    <div class="content">
                        <div class="last_message" id="last_message">${last_message}</div>
                        <div calss="time-before" style="margin-right: -20px; margin-top: 13px; font-size: 12px;">
                            ${date}
                        </div>
                    </div>
                </div>
            </div>`
        } else {
            let chatuser = sender
            let chatuser_img = sender_img
            header_list.innerHTML +=
                `<div class="header" id="header" onclick=chatroomSelect(${header_id})>
                <div class="header_user_profile_img">
                    <img id="user_profile_img"
                                src="${chatuser_img}">

                </div>
                <div class="header_user_profile" >
                    <div class="username" id="username">${chatuser}</div>
                    <div class="content">
                        <div class="last_message" id="last_message">${last_message}</div>
                        <div calss="time-before" style="margin-right: -20px; margin-top: 13px; font-size: 12px;">
                            ${date}
                        </div>
                    </div>
                </div>
            </div>`
        }
    }
    return response_json
}
getHeader()


// 웹소켓 커넥트

let connectedChatSocket = ''
async function chatroomSelect(id) {
    if (connectedChatSocket != '') {
        connectedChatSocket.close()
    }
    const data = await getHeader(id)
    var url = `ws://127.0.0.1:8000/chat/${id}`
    const chatSocket = new ReconnectingWebSocket(url)
    connectedChatSocket = chatSocket

    // 메시지 발신
    chatSocket.onopen = async function (e) {
        var t = setInterval(function () {
            if (chatSocket.readyState != 1) {
                clearInterval(t);
                return;
            }
            chatSocket.send('{type:"ping"}');
        }, 55000);
        console.log('socket Connect!', e)
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

    // 메시지 수신
    chatSocket.onmessage = async function (e) {
        console.log('receive Message!', e)
        let data = JSON.parse(e.data)
        let message = data['message']
        let sent_by_id = data['sender']
        let header_id = data['header_id']
        let time = data['time']
        newMessage(message, sent_by_id, time)


        chatSocket.onerror = async function (e) {
            console.log('error', e)
            setTimeout(function () {
                connect();
            }, 1000);
        }

        chatSocket.onclose = async function (e) {
            console.log('close', e)
        }

        // 발신한 메세지 HTML에 붙이기
        function newMessage(message, sent_by_id, time) {
            let messages = document.getElementById("chat_box")
            message.innerHTML = ""
            console.log(sent_by_id + '====>' + USER_ID)
            if (sent_by_id == USER_ID) {
                messages.innerHTML += `<div style="padding: 10px;">
                                    <div class="my" id="my">
                                    ${message} - ${time}
                                    </div>
                                </div>`
            } else {
                messages.innerHTML += `<div style="padding: 10px;">
                                    <div class="others" id="others">
                                    ${message} - ${time} 
                                    </div>
                                </div>`
            }
            messages.scrollTop = messages.scrollHeight;
        }

        const response = await fetch(`${backend_base_url}dm/${id}/`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
                'Authorization': "Bearer " + localStorage.getItem("user_access_token")
            }
        })
        response_json = await response.json()
        console.log(response_json)
        sessionStorage.setItem('header_id', response_json[0].id)
        let chat_box = document.getElementById('chat_box')
        chat_box.innerHTML = ''
        for (let i = 0; i < response_json[0].messages.length; i++) {
            let sender = response_json[0].messages[i].sender
            let message = response_json[0].messages[i].message
            let time = response_json[0].messages[i].at_time
            if (USER_NAME == sender) {
                chat_box.innerHTML += ` 
                                <div style="padding: 10px;">
                                    <div class="my" id="my">
                                    ${message} - ${time}
                                    </div>
                                </div>`
            } else {
                chat_box.innerHTML += `                            
                                <div style="padding: 10px;">
                                    <div class="others" id="others">
                                     ${time} - ${message}
                                    </div>
                                </div>`
            }
            chat_box.scrollTop = chat_box.scrollHeight;
        }
        return response_json
    }


    var header_div = document.getElementsByClassName("header");
    function handleClick(event) {
        if (event.target.classList[1] === "clicked") {
            event.target.classList.remove("clicked");
        } else {
            for (var i = 0; i < header_div.length; i++) {
                header_div[i].classList.remove("clicked");
            }
            event.target.classList.add("clicked");
        }
    }
    function init() {
        for (var i = 0; i < header_div.length; i++) {
            header_div[i].addEventListener("click", handleClick);
        }
    }
    init();
}
