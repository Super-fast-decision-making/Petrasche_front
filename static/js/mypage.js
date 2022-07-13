// 내 게시물 불러오기(전체)
async function loadMyArticle() {
    articles = await getMyArticle()
    console.log(articles)
    for(let i=0; i<articles.length; i++) {
        let image = articles[i].images[0]
        let like_num=articles[i].like_num
        const article_box = document.getElementById("article_box")
        article_box.innerHTML +=
            `<div class="article_card" >
                <img src='${image}' >
                <div style="position:relative; background-color:transparent; width:100%; height:30px; top:-34px;color:red;padding-left:10px"><i class="fa fa-heart"></i>  ${like_num}</div>
            </div>`
        
    }
}

function changeButton() {
    const article_box = document.getElementById("article_box")
    const user_info_box = document.getElementById("user_info_box")
    const pet_select_box = document.getElementById("pet_select_box")
    const menu_change_button = document.getElementById("menu_change_button")
    

    if (menu_change_button.innerText == "프로필 변경") {
        loadUserInfo()
        article_box.style.display = "none"
        pet_select_box.style.display = "none"
        user_info_box.style.display = "flex"
        menu_change_button.innerText = "게시물 보기"
    } else {
        article_box.style.display = "flex"
        pet_select_box.style.display = "flex"
        user_info_box.style.display = "none"
        menu_change_button.innerText = "프로필 변경"
    }
}

async function loadUserInfo() {
    let user = await getUserInfo()
    console.log(user)

    const menu_change_button = document.getElementById("menu_change_button")

}

loadMyArticle()