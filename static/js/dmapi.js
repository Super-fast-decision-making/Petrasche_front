// 메세지 리스트 불러오기
async function getMessage(id) {
    const response = await fetch(`${backend_base_url}dm/${id}/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    return response_json
}


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
    return response_json
}