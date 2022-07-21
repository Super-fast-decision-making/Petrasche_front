const backend_base_url2 = "http://127.0.0.1:8000"
const frontend_base_url2 = "http://127.0.0.1:5500"

// 로그인 유저 불러오기
async function getUserInfo() {
    const response = await fetch(`${backend_base_url2}/user`, {
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


// 내 채팅방 불러오기 
async function getHeader(header_id) {
    const header_list = document.getElementById("header_list")
    const response = await fetch(`${backend_base_url2}/dm`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    // console.log(response_json['header_id'].messages)
    // console.log(response_json[0].messages.length)

    let username = sessionStorage.getItem('username')
    header_list.innerHTML = ""
    for (let i = 0; i < response_json.length; i++) {
        let header_id = response_json[i].id
        let receiver = response_json[i].receiver
        let sender = response_json[i].sender
        let last_message = response_json[i].last_message.message
        let date = response_json[i].last_message.date
        if (username === sender) {
            let chatuser = receiver
            header_list.innerHTML +=
                `<div class="header" id="">
                <div class="header_user_profile_img">
                    <img id="user_profile_img"
                        src="https://photo.jtbc.joins.com/news/jam_photo/202109/24/1cafd5d0-6a05-4c52-a0fb-e4079839650c.jpg">
                </div>
                <div class="header_user_profile" onclick=getHeader(${header_id})>
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
                <div class="header_user_profile" onclick=getHeader(${header_id})>
                    <div class="username" id="username">${chatuser}</div>
                    <div class="last_message" id="last_message">${last_message} ${date}</div>
                </div>
            </div>`
        }
    }

    // for (leti = 0; i < response_json.messages[i].length;)

    return response_json
}
getHeader()

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
        let sent_by = sessionStorage.getItem('id')
        let header = await getHeader()

        chatSocket.send(JSON.stringify({
            'message': message,
            'sent_by': sent_by,
            'header_id': header[0].id
        }))
        form.reset()
    })
}

// 메시지 수신
chatSocket.onmessage = async function (e) {
    console.log('receive Message!', e)
    let data = JSON.parse(e.data)
    console.log(data)
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

function newMessage(message, sent_by_id, header_id) {
    document.getElementById('introduction').innerHTML = sent_by_id
    document.getElementById('my').innerHTML = message

    // if (sent_by_id == )
}

// TO DO
// 1번 채팅목록 클릭시 해당 채팅방 불러오기 (header_id로)
// 1번 채팅붙이기
// 