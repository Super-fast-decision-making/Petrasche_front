// 웹소켓 커넥트
// let connectedChatSocket = ''
// async function chatroomSelect(id) {
//     if (connectedChatSocket != '') {
//         connectedChatSocket.close()
//     }
//     await loadMessage(id)

// 여기서 어떻게든 유저의 모든 챗방 아이디를 fetch로 가져오는 거예요...
// 시리얼라이저 다 되니까...

// let url = `ws://127.0.0.1:8000/chat/3`
// `ws://127.0.0.1:8000/chat/5`
// `ws://127.0.0.1:8000/chat/8`

// forEach(id) =>{
//     let url = `ws://127.0.0.1:8000/chat/${id}`
//     console.log("왜 안됨 2")
//     chatSocket.onopen = async function (e) {
//         console.log('socket Connect!', e)
//     }
//     chatSocket.onerror = async function (e) {
//         console.log('error', e)
//     }
//     chatSocket.onclose = async function (e) {
//         console.log('close', e)
//     }
// }



//챗 소켓 서버를 오픈하는 부분 
console.log("왜 안됨 0")
let url = `ws://127.0.0.1:8000/chat/1`
console.log("왜 안됨 1")
const chatSocket = new WebSocket(url)
// connectedChatSocket = chatSocket
console.log("왜 안됨 2")
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
    console.log(message, "보내는사람:" + sent_by_id)
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


function newMessage(message, sent_by_id, time) {
    let messages = document.getElementById("chat_box")
    message.innerHTML = ""
    if (sent_by_id == USER_ID) {
        messages.innerHTML += `<div style="padding: 10px;">
                            <div class="my" id="my">
                                ${message} - ${time}
                            </div>
                        </div>`
    } else {
        messages.innerHTML += `<div style="padding: 10px;">
                            <div class="others" id="others">
                                ${time} - ${message} 
                            </div>
                        </div>`
    }
    messages.scrollTop = messages.scrollHeight;
}

