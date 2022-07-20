const backend_base_url2 = "http://127.0.0.1:8000"
const frontend_base_url2 = "http://127.0.0.1:5500"


// 내 채팅방 불러오기
async function getHeader() {
    const response = await fetch(`${backend_base_url2}/dm`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    console.log(response_json)
    return response_json
}
getHeader()


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
    console.log("로그인 유저: " + response_json.id)
    return response_json
}
getUserInfo()


// 웹소켓 커넥트
let url = 'ws://127.0.0.1:8000/chat/'

const chatSocket = new WebSocket(url)

chatSocket.onopen = () => chatSocket.send(JSON.stringify({

}));

chatSocket.onmessage = function (e) {
    let data = JSON.parse(e.data)
    console.log('Data:', data)

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
    console.log(header[0].id)

    chatSocket.send(JSON.stringify({
        'message': message,
        'sent_by': sent_by,
        'header_id': header[0].id
    }))
    console.log(sent_by + message)
    form.reset()
})
