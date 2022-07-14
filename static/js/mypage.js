// 내 게시물 불러오기(전체)
async function loadMyArticle() {
    articles = await getMyArticle()
    
    for(let i=0; i<articles.length; i++) {
        
        let image = articles[i].images[0]
        let like_num=articles[i].like_num
        let id = articles[i].id
        
        const article_box = document.getElementById("article_box")
        article_box.innerHTML +=
            `<div class="article_card" >
                <img src='${image}'  id="article_card_img${id}" onclick=openDetailModal(${id})>
                <div style="position:relative; background-color:transparent; width:100%; height:30px; top:-34px;color:red;padding-left:10px"><i class="fa fa-heart"></i>  ${like_num}</div>
            </div>`
    }  
}

// 탭 보이기
function showMyArticle() {
    document.getElementById("article_box").style.display="flex"
    document.getElementById("user_info_box").style.display="none"
    document.getElementById("like_article_box").style.display="none"
    document.getElementById("pet_select_box").style.display="flex"
}

function showUserInfo() {
    document.getElementById("article_box").style.display="none"
    document.getElementById("user_info_box").style.display="flex"
    document.getElementById("like_article_box").style.display="none"
    document.getElementById("pet_select_box").style.display="none"
}

function showLike(){
    document.getElementById("article_box").style.display="none"
    document.getElementById("user_info_box").style.display="none"
    document.getElementById("like_article_box").style.display="flex"
    document.getElementById("pet_select_box").style.display="flex"
}


// 디테일 모달  열기+보여주기
async function openDetailModal(id){
    document.getElementById("mypage_modal_comment_list").innerHTML=""
    const modal_box = document.getElementById("modal_box")

    modal_box.style.display="flex"
    const article = await getDetailArticle(id)

    const modal_box_img = document.getElementById("modal_box_img")
    const author= document.getElementById("author")
    const content= document.getElementById("content")
    const comment_list=document.getElementById("mypage_modal_comment_list")
    const submit_button=document.getElementById("modal_comment_submit")

    

    author.innerHTML = article.author
    content.innerHTML = article.content
    modal_box_img.src = article.images[0]
    submit_button.setAttribute("onClick", `sendComment(${article.id})`)

    for (let i=0; i<article.comment.length;i++){
        // console.log(article.comment[i].comment)
        comment_list.innerHTML+=
            `
            <div class="modal_comment_text">
                <div class="balloon_03">
                    <div>
                        ${article.comment[i].comment}
                    </div>
                </div>
                <div class="modal_comment_user">${article.comment[i].user} <span>${article.comment[i].date}</span></div>
            </div>
            `
    }
    
}


//바디 클릭시 모달 창 닫기 기본 모달
document.body.addEventListener("click", function (e) {
    console.log("여기는 일단 옴")
    if (e.target.id == "modal_box") {
    //   modal_close();
        document.getElementById("modal_box").style.display = "none";
        document.getElementById("modal_box_img").src = "";
        document.body.style.overflow = "auto";
        document.body.style.touchAction = "auto";
        // document.getElementById("mypage_modal_comment_list").innerHTML=""
    }
});

//댓글 전송하기
async function sendComment(id){
    console.log(document.getElementById("modal_comment_text").value)
    const comment = document.getElementById("modal_comment_text").value
    await postComment(id, comment)  
    openDetailModal(id)
    document.getElementById("modal_comment_text").value=""
}



// 유저 정보 불러오기
async function loadUserInfo() {
    let user = await getUserInfo()
    console.log(user)

    const article_box = document.getElementById("article_box")
    const user_info_box = document.getElementById("user_info_box")
    const user_profile_section = document.getElementById("user_profile_section")
    
    const menu_change_button = document.getElementById("menu_change_button")
    const like_article_box = document.getElementById("like_article_box")

    user_profile_section.innerHTML +=
        `<div class="user_profile_box">
            <div class="user_profile_item">
                <p>비밀번호</p>
                <button type="button" onclick="">변경</button>
            </div>
            <div class="user_profile_item">
                <p>이메일</p>
                <input id="user_profile_email" type="email" value="" style="width: 80px;" />
                <span>@</span>
                <input id="user_profile_domain" type="email" value="" style="width: 80px;" />
                <select name="language" >
                    <option value="none">이메일</option>
                    <option value="gmail">gmail.com</option>
                    <option value="naver">naver.com</option>
                    <option value="daum">hanmail.net</option>
                    <option value="self">직접 입력</option>
                </select>
            </div>
            <div class="user_profile_item">
                <p>연락처</p>
                <input id="user_profile_phone" type="text" value=""/>
                <button type="button" onclick="">변경</button>
            </div>
            <div class="user_profile_item">
                <p>생년월일</p>
                <input id="user_profile_birthday" type="date"  value=""/>
            </div>
            <div class="user_profile_item">
                <p>성별</p>
                <input type="radio" id="gender" name="gender" value="여성">
                <label for="여성">여성</label>
                <input type="radio" id="gender" name="gender" value="남성">
                <label for="남성">남성</label>
                <input type="radio" id="gender" name="gender" value="모름">
                <label for="모름">모름</label>
                <input type="" value="남성"/>
            </div>
        </div>`
    const user_id = document.getElementById("user_id")
    const email = document.getElementById("user_profile_email")
    const domain = document.getElementById("user_profile_domain")
    const phone = document.getElementById("user_profile_phone")
    const birthday = document.getElementById("user_profile_birthday")
    const gender = document.getElementsByName("gender")

    let email_id = user.email.split('@')[0]
    let email_domain = user.email.split('@')[1]
    
    user_id.innerHTML = user.username
    email.setAttribute("value", email_id)
    domain.setAttribute("value", email_domain)
    phone.setAttribute("value", user.phone)
    birthday.setAttribute("value", user.birthday)
    var chkList = document.querySelectorAll("input[name=gender]:checked");
    chkList.forEach(function (ch) {
        console.log(ch.value);
    });
    console.log(user.petprofile);

    const pet_profile_section = document.getElementById("pet_profile_section")
    let petprofiles = user.petprofile
    
    for(let i=0; i<petprofiles.length; i++){
        let pet_name = petprofiles[i].name
        // let pet_image = petprofiles[i].image
        pet_profile_section.innerHTML +=
            `<div class="pet_profile_card">
                <div class="pet_img">
                    <img src="" />
                </div>
                <div class="pet_name">
                    <p>${pet_name}</p>
                </div>
            </div>`
    }
    
    //좋아요 페이지 아티클 보이기
    for (let i=0; i<user['like_articles'].length; i++){
        let like_article = user['like_articles'][i]

        like_article_box.innerHTML +=
        `<div class="article_card" >
            <img src='${like_article['imgurl'][0]}' onclick="openDetailModal(${like_article['id']})">
            <div style="position:relative; background-color:transparent; width:100%; height:30px; top:-34px;color:red;padding-left:10px"><i class="fa fa-heart"></i> ${like_article['author']}</div>
        </div>`
    }
}

loadMyArticle()
loadUserInfo()