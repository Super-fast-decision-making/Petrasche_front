const backend_base_url = "http://127.0.0.1:8000"


// 로그인 유저 불러오기
async function getUserInfo() {
    const response = await fetch(`${backend_base_url}/user`, {
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
    const header_list = document.getElementById("header_list")
    const response = await fetch(`${backend_base_url}/dm`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    console.log(response_json)

    header_list.innerHTML = ""
    for (let i = 0; i < response_json.length; i++) {
        let header_id = response_json[i].id
        let receiver = response_json[i].receiver
        let sender = response_json[i].sender
        let last_message = response_json[i].last_message.message
        let date = response_json[i].last_message.date
        if (USER_NAME === sender) {
            let chatuser = receiver
            header_list.innerHTML +=
                `<div class="header" id="">
                <div class="header_user_profile_img">
                    <img id="user_profile_img"
                        src="https://photo.jtbc.joins.com/news/jam_photo/202109/24/1cafd5d0-6a05-4c52-a0fb-e4079839650c.jpg">
                </div>
                <div class="header_user_profile" onclick=chatopen(${header_id})>
                    <div class="username" id="username">${chatuser}</div>
                    <div class="last_message" id="last_message">${last_message} ${date}</div>
                </div>
            </div>`
        } else {
            let chatuser = sender
            header_list.innerHTML +=
                `<div class="header" id="">
                <div class="header_user_profile_img">
                    <img id="user_profile_img"
                        src="https://photo.jtbc.joins.com/news/jam_photo/202109/24/1cafd5d0-6a05-4c52-a0fb-e4079839650c.jpg">
                </div>
                <div class="header_user_profile" onclick=chatopen(${header_id})>
                    <div class="username" id="username">${chatuser}</div>
                    <div class="last_message" id="last_message">${last_message} ${date}</div>
                </div>
            </div>`
        }
    }
    const my_chat = document.getElementById("my_message")
    const other_chat = document.getElementById("other_message")
    return response_json
}
getHeader()


async function chatopen(id) {
    const response = await fetch(`${backend_base_url}/dm/${id}`, {
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
        if (USER_NAME == sender) {
            chat_box.innerHTML += ` 
                                <div style="padding: 10px;">
                                    <div class="my" id="my">
                                    ${response_json[0].messages[i].message}
                                    </div>
                                </div>`
        } else {
            chat_box.innerHTML += `                            
                                <div style="padding: 10px;">
                                    <div class="others" id="others">
                                    ${response_json[0].messages[i].message}
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
            // 'send_to': reciever,
            'header_id': header
        }))
        form.reset()
    })
}

// 메시지 수신
chatSocket.onmessage = async function (e) {
    console.log('receive Message!', e)
    let data = JSON.parse(e.data)
    console.log(data, "147qjs")
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
