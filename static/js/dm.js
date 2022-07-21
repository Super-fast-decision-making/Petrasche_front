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
// if username(로그인유저) = sender --> receiver
// else sender

async function getHeader() {
    const header_list = document.getElementById("header_list")
    header_list.innerHTML = ""
    const response = await fetch(`${backend_base_url2}/dm`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    let username = sessionStorage.getItem('username')
    let last_message = response_json[0].last_message.message
    // let receiver = response_json[0].receiver
    // let sender = response_json[0].sender
    console.log(response_json)

    for (let i = 0; i < response_json.length; i++) {
        let receiver = response_json[i].receiver
        let sender = response_json[i].sender
        let last_message = response_json[i].last_message.message
        let date = response_json[i].last_message.date
        if (username === sender) {
            let chatuser = receiver
            console.log(chatuser)
            header_list.innerHTML +=
                `<div class="header" id="">
                <div class="header_user_profile_img">
                    <img id="user_profile_img"
                        src="https://photo.jtbc.joins.com/news/jam_photo/202109/24/1cafd5d0-6a05-4c52-a0fb-e4079839650c.jpg">
                </div>
                <div class="header_user_profile">
                    <div class="username" id="username">${chatuser}</div>
                    <div class="last_message" id="last_message">${last_message} ${date}</div>
                </div>
            </div>`
        } else {
            let chatuser = sender
            console.log(chatuser)
            header_list.innerHTML +=
                `<div class="header" id="">
                <div class="header_user_profile_img">
                    <img id="user_profile_img"
                        src="https://photo.jtbc.joins.com/news/jam_photo/202109/24/1cafd5d0-6a05-4c52-a0fb-e4079839650c.jpg">
                </div>
                <div class="header_user_profile">
                    <div class="username" id="username">${chatuser}</div>
                    <div class="last_message" id="last_message">${last_message} ${date}</div>
                </div>
            </div>`
        }
    }
    return response_json
}
getHeader()



// 웹소켓 커넥트
let url = 'ws://127.0.0.1:8000/chat/'

const chatSocket = new WebSocket(url)

chatSocket.onopen = () => chatSocket.send(JSON.stringify({

}));

chatSocket.onmessage = function (e) {
    let data = JSON.parse(e.data)
    // console.log('Data:', data)

    if (data.type === 'chat') {
        let messages = document.getElementById('messages')
        messages.insertAdjacentHTML('beforeend', `<div>
            <p>${data.message}</p>
        </div>`)
    }
}

let form = document.getElementById('form')
form.addEventListener('submit', async function (e) {
    e.preventDefault()

    let message = e.target.message.value
    let sent_by = sessionStorage.getItem('id')
    let header = await getHeader()
    // console.log(header[0].id)

    chatSocket.send(JSON.stringify({
        'message': message,
        'sent_by': sent_by,
        'header_id': header[0].id
    }))
    console.log(sent_by + message)
    form.reset()
})
