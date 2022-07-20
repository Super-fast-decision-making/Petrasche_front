const backend_base_url2 = "http://127.0.0.1:8000/dm/";


// 내 채팅방 불러오기
async function getHeader() {
    const response = await fetch(`${backend_base_url2}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    // console.log(response_json)
    return response_json
}
getHeader()


// let url = 'ws://127.0.0.1:8000/ws/socket-server/'
let url = 'ws://127.0.0.1:8000/chat/'
const chatSocket = new WebSocket(url)
chatSocket.onopen = async function (e) {
    console.log('open', e)
}


chatSocket.onmessage = async function (e) {
    let data = JSON.parse(e.data)
    // console.log(data)
    // console.log('message', e)

    if (data.type === 'chat') {
        let messages = document.getElementById('messages')

        messages.insertAdjacentHTML('beforeend', `<div>
    <p>${data.message}</p>
</div>`)
    }
}

let form = document.getElementById('form')
form.addEventListener('submit', (e) => {
    e.preventDefault()
    let message = e.target.message.value
    chatSocket.send(JSON.stringify({
        'message': message
    }))
    form.reset()
})

chatSocket.onerror = async function (e) {
    console.log('error', e)
}

chatSocket.onclose = async function (e) {
    console.log('close', e)
}