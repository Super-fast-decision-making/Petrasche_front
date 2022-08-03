
////나중에 보낼것
// 해당 유저 정보 불러오기(전체)
async function getUser() {
    user_id = sessionStorage.getItem('profile_page_id')
    const response = await fetch(`${backend_base_url}user/userarticle/${user_id}/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })

    response_json = await response.json()
    console.log(response_json)

    document.getElementById('username').innerText = response_json.username
    document.getElementById('user_profile_img').src = response_json.profile_img
    document.getElementById('introduction').innerText = response_json.introduction
    const article_box = document.getElementById('article_box')
    let articles = response_json.articles
    article_box.innerHTML = ''
    articles.forEach(article => {
        article_box.innerHTML += `<div class='article_card'><img src=${article.images[0]} onclick="openDetailModal(${article.id})"></div>`
        console.log(article)

    })
}
getUser()



// }
// loadPersonal()