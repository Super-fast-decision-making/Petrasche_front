const backend_base_url2 = "http://127.0.0.1:8000";
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
    // console.log(response_json)
    // console.log(response_json[0].sender)
    return response_json
}
getHeader()

// const GetUserInfo = () => {
//     fetch(`${backend_base_url2}/user`, {
//         method: "GET",
//         headers: {
//             Accept: "application/json",
//             "Content-type": "application/json",
//             Authorization: "Bearer " + localStorage.getItem("user_access_token"),
//         },
//     })
//         .then((res) => res.json())
//         .then((res) => {
//             // console.log(res.id)
//             return res.id
//         });
// };

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
    // console.log(response_json)
    return response_json
}
// getUserInfo()
// let userid = getUserInfo()
// console.log(userid)



// 웹소켓 커넥트
let url = 'ws://127.0.0.1:8000/chat/'
// const PayLoad = JSON.parse(localStorage.getItem("payload"));
// console.log(PayLoad)
// const SENTBY = PayLoad.user_id
// console.log(SENTBY)
// let send_message_form = document.getElementById('form')
// let input_message = document.getElementById('input-message').value;
// let comment_content = document.getElementById("modal_comment_text").value;


const chatSocket = new WebSocket(url)

chatSocket.onopen = async function (e) {
    response = getHeader()
    console.log(response)
    console.log(response[0])
    console.log('open', e)
    // send_message_form.on()
}


chatSocket.onmessage = async function (e) {
    let data = JSON.parse(e.data)
    console.log(e.data)
    // console.log('message', e)

    if (data.type === 'chat') {
        let messages = document.getElementById('message')

        messages.insertAdjacentHTML('beforeend', `<div>
    <p>${data.message}</p>
</div>`)
    }
}

// function sendMessage(div) {
//     let message = div.childNodes[3].value

//     fetch(`${backend_base_url2}/user/`, {
//         method: "GET",
//         headers: {
//             Accept: "application/json",
//             "Content-type": "application/json",
//             Authorization: "Bearer " + localStorage.getItem("user_access_token"),
//         },
//     })
//         .then((res) => res.json())
//         .then((res) => {
//             console.log(res)
//             let data = {
//                 'message': message,
//                 'sent_by': res.id,
//             }
//             console.log(data)
//         });


// data = JSON.stringify(data)
// chatSocket.send(data)
// chatSocket.send(JSON.stringify({
//     'message': message,
//     'send_by': send_by
// }))
// form.reset()

// }

// chatSocket.onerror = async function (e) {
//     console.log('error', e)
// }

// chatSocket.onclose = async function (e) {
//     console.log('close', e)
// }


// chatSocket.onopen = async function (e) {
//     console.log('open', e)
//     send_message_form.addEventListener('submit', function (e) {
//         e.preventDefault()
//         let message = input_message.val()
//         // let send_to = get_active_other_user_id()
//         // let thread_id = get_active_thread_id()

//         let data = {
//             'message': message,
//             'sent_by': USER_ID,
//             // 'send_to': send_to,
//             // 'thread_id': thread_id
//         }
//         data = JSON.stringify(data)
//         chatSocket.send(data)
//         $(this)[0].reset()
//     })
// }

// chatSocket.onmessage = async function (e) {
//     console.log('message', e)
//     let data = JSON.parse(e.data)
//     let message = data['message']
//     let sent_by_id = data['sent_by']
//     let thread_id = data['thread_id']
//     newMessage(message, sent_by_id, thread_id)
// }

// chatSocket.onerror = async function (e) {
//     console.log('error', e)
// }

// chatSocket.onclose = async function (e) {
//     console.log('close', e)
// }