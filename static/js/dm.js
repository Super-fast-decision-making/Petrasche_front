let url = 'ws://127.0.0.1:8000/ws/socket-server/'

const chatSocket = new WebSocket(url)

chatSocket.onopen = async function (e) {
    console.log('open', e)

}
// chatSocket.onopen = () => chatSocket.send(JSON.stringify({
//     'event_pk': event_pk,
//     'participant_pk': 1,
//     'isConnected': 'true',
// }));

chatSocket.onmessage = async function (e) {
    let data = JSON.parse(e.data)
    // console.log('Data:', data)
    console.log('message', e)

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