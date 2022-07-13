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
                <img src='${image}'  onclick="openDetailModal()">
                <div style="position:relative; background-color:transparent; width:100%; height:30px; top:-34px;color:red;padding-left:10px"><i class="fa fa-heart"></i>  ${like_num}</div>
            </div>`
        
    }
}

//디테일 모달 
function openDetailModal(){
    const modal_box = document.getElementById("modal_box")
    modal_box.style.display="flex"
}

function changeButton() {
    const article_box = document.getElementById("article_box")
    const user_info_box = document.getElementById("user_info_box")
    const pet_select_box = document.getElementById("pet_select_box")
    const menu_change_button = document.getElementById("menu_change_button")
    const like_article_box = document.getElementById("like_article_box")
    

    if (menu_change_button.innerText == "프로필 변경") {
        loadUserInfo()
        article_box.style.display = "none"
        pet_select_box.style.display = "none"
        like_article_box.style.display = "none"
        user_info_box.style.display = "flex"
        menu_change_button.innerText = "게시물 보기"
    } else {
        article_box.style.display = "flex"
        pet_select_box.style.display = "flex"
        user_info_box.style.display = "none"
        like_article_box.style.display = "none"
        menu_change_button.innerText = "프로필 변경"
    }
}



async function loadUserInfo() {
    let user = await getUserInfo()
    console.log(user)

    const email = document.getElementById("user_profile_email")
    const domain = document.getElementById("user_profile_domain")
    const phone = document.getElementById("user_profile_phone")
    const birthday = document.getElementById("user_profile_birthday")
    // const gender = document.getElementsByName("gender")

    let email_id = user.email.split('@')[0]
    let email_domain = user.email.split('@')[1]

    email.setAttribute("value", email_id)
    domain.setAttribute("value", email_domain)
    phone.setAttribute("value", user.phone)
    birthday.setAttribute("value", user.birthday)
    var chkList = document.querySelectorAll("input[name=gender]:checked");
    chkList.forEach(function (ch) {
        console.log(ch.value);
    });

    //좋아요 페이지 아티클 보이기
    for (let i=0; i<user['like_articles'].length; i++){
        let like_article = user['like_articles'][i]

        like_article_box.innerHTML +=
        `<div class="article_card" >
            <img src='${like_article['imgurl'][0]}' >
            <div style="position:relative; background-color:transparent; width:100%; height:30px; top:-34px;color:red;padding-left:10px"><i class="fa fa-heart"></i> ${like_article['author']}</div>
        </div>`
    }
}
loadUserInfo()
loadMyArticle()