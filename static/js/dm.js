var header_div = document.getElementsByClassName("header");
function handleClick(event) {
    // console.log(event.target);
    // console.log(this);

    if (event.target.classList[1] === "clicked") {
        event.target.classList.remove("clicked");
    } else {
        for (var i = 0; i < header_div.length; i++) {
            header_div[i].classList.remove("clicked");
        }
        event.target.classList.add("clicked");
        console.log(event.target.classList)
    }
}
function init() {
    for (var i = 0; i < header_div.length; i++) {
        header_div[i].addEventListener("click", handleClick);
        // header_div[i].childNodes[1].addEventListener("click", handleClick);
    }
}
init();

// 로그인 유저 불러오기
async function getUserInfo() {
    const response = await fetch(`${backend_base_url}user`, {
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
    const response = await fetch(`${backend_base_url}dm`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    console.log(response_json)
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
        console.log(receiver_img)
        console.log(sender_img)

        if (USER_NAME === sender) {
            let chatuser = receiver
            let chatuser_img = receiver_img
            header_list.innerHTML +=
                `<div class="header" id="header" onclick=chatopen(${header_id})>
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
        } else {
            let chatuser = sender
            let chatuser_img = sender_img
            header_list.innerHTML +=
                `<div class="header" id="header" onclick=chatopen(${header_id})>
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
    const my_chat = document.getElementById("my_message")
    const other_chat = document.getElementById("other_message")
    return response_json
}
getHeader()

async function createHeader(id) {

    const response = await fetch(`${backend_base_url}dm/${id}/`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        },
        body: JSON.stringify(commentData)
    }).then(response => response.json())
        .then(data => {
            // ResponseloadComments(data)
        })
}

async function chatopen(id) {
    const response = await fetch(`${backend_base_url}dm/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    sessionStorage.setItem('header_id', response_json[0].id)
    let chat_box = document.getElementById('chat_box')
    chat_box.innerHTML = ''
    for (let i = 0; i < response_json[0].messages.length; i++) {
        let sender = response_json[0].messages[i].sender
        let message = response_json[0].messages[i].message
        if (USER_NAME == sender) {
            chat_box.innerHTML += ` 
                                <div style="padding: 10px;">
                                    <div class="my" id="my">
                                    ${message}
                                    </div>
                                </div>`
        } else {
            chat_box.innerHTML += `                            
                                <div style="padding: 10px;">
                                    <div class="others" id="others">
                                    ${message}
                                    </div>
                                </div>`
        }
        chat_box.scrollTop = chat_box.scrollHeight;
    }
}




// 웹소켓 커넥트
let url = 'ws://127.0.0.1:8000/chat/'

const chatSocket = new WebSocket(url)

// 메시지 발신
chatSocket.onopen = async function (e) {
    console.log('socket Connect!', e)
    let form = document.getElementById('form')
    form.addEventListener('submit', async function (e) {
        e.preventDefault()
        let message = e.target.message.value
        let header = sessionStorage.getItem('header_id')
        chatSocket.send(JSON.stringify({
            'message': message,
            'sent_by': USER_ID,
            'header_id': header
        }))
        form.reset()
    })
}

// 메시지 수신
chatSocket.onmessage = async function (e) {
    console.log('receive Message!', e)
    let data = JSON.parse(e.data)
    let message = data['message']
    let sent_by_id = data['sent_by']
    let header_id = data['header_id']
    newMessage(message, sent_by_id, header_id)
}


chatSocket.onerror = async function (e) {
    console.log('error', e)
}

chatSocket.onclose = async function (e) {
    console.log('close', e)
}

// 발신한 메세지 HTML에 붙이기
function newMessage(message, sent_by_id, header_id) {
    let messages = document.getElementById("chat_box")
    console.log(sent_by_id + '====>' + USER_ID)
    if (sent_by_id == USER_ID) {
        messages.innerHTML += `<div style="padding: 10px;">
                                    <div class="my" id="my">
                                    ${message}
                                    </div>
                                </div>`
    } else {
        messages.innerHTML += `<div style="padding: 10px;">
                                    <div class="others" id="others">
                                    ${message}
                                    </div>
                                </div>`
    }
    messages.scrollTop = messages.scrollHeight;
}

