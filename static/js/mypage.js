// 내 게시물 전체 불러오기(메뉴)
async function loadMyArticle() {
    document.getElementById("user_button_box").style.display = "none"

    const show_container = document.getElementById("show_container")
    show_container.innerHTML =
        `<div id="show_box" class="show_box">
            <div id ="article_box_wrapper">
                <div id="article_box" class="article_box" style="display:flex" >
                </div>
            </div>
        </div>
        <div id="pet_select_box" class="pet_select_box">
        </div>
        `

    let articles = await getMyArticle()

    for (let i = 0; i < articles.length; i++) {
        let image = articles[i].images[0]
        let like_num = articles[i].like_num
        let id = articles[i].id

        const article_box = document.getElementById("article_box")
        article_box.innerHTML +=
            `<div class="article_card" >
                <img src='${image}'  id="article_card_img${id}" onclick=openDetailModal(${id})>
                <div style="position:relative; background-color:transparent; width:100%; height:30px; top:-34px;color:red;padding-left:10px"><i class="fa fa-heart"></i>  ${like_num}</div>
            </div>`
    }

    const username = document.getElementById("username")
    const introduction = document.getElementById("introduction")
    const user_profile_img = document.getElementById("user_profile_img")
    const pet_select_box = document.getElementById("pet_select_box")
    pet_select_box.style.display = "flex"

    let user = await getUserInfo()

    username.innerHTML = user.username
    introduction.innerHTML = user.introduction
    user_profile_img.src = user.profile_img

    let petprofiles = user.petprofile
    for (let i = 0; i < petprofiles.length; i++) {
        let pet_name = petprofiles[i].name
        pet_select_box.innerHTML +=
            `<div class="pet_botton_box">
                <div class="pet_button">
                    ${pet_name}
                </div>
            </div>`
    }
}

// 디테일 모달 열기+보여주기
async function openDetailModal(id) {
    document.getElementById("mypage_modal_comment_list").innerHTML = ""
    const PayLoad = JSON.parse(localStorage.getItem("payload"));
    const modal_box = document.getElementById("modal_box")

    modal_box.style.display = "flex"
    const article = await getDetailArticle(id)
    console.log(article)

    const modal_box_img = document.getElementById("modal_box_img")
    const author = document.getElementById("author")
    const content = document.getElementById("content")
    const comment_list = document.getElementById("mypage_modal_comment_list")
    const submit_button = document.getElementById("modal_comment_submit")
    const modal_follow = document.getElementById("modal_follow")
    const article_delete = document.getElementById("article_delete")
    const article_edit = document.getElementById("article_edit")
    

    author.innerHTML = article.author
    content.innerHTML = article.content
    modal_box_img.src = article.images[0]
    article_delete.setAttribute("onClick", `articleDelete(${article.id})`)
    article_edit.setAttribute("onClick", `articleEdit(${article.id})`)

    submit_button.setAttribute("onClick", `sendComment(${article.id})`)
    modal_follow.setAttribute("onClick", `Follow('${article.author}',${article.id})`)
    
    //이미지
    let images = article.images;
    document.getElementById("slide_left").onclick = () => {
        let index = images.indexOf(
            document.getElementById("modal_box_img").src
        );
        if (index == 0) {
            index = images.length - 1;
        } else {
            index--;
        }
        document.getElementById("modal_box_img").src = images[index];
        document
            .getElementById("modal_box_img")
            .animate([{ opacity: 0 }, { opacity: 1 }], {
                duration: 1000,
                fill: "forwards",
            });
    };
    document.getElementById("slide_right").onclick = () => {
        let index = images.indexOf(
            document.getElementById("modal_box_img").src
        );
        if (index == images.length - 1) {
            index = 0;
        } else {
            index++;
        }
        document.getElementById("modal_box_img").src = images[index];
        document
            .getElementById("modal_box_img")
            .animate([{ opacity: 0 }, { opacity: 1 }], {
                duration: 1000,
                fill: "forwards",
            });
    };

    //좋아요 기능
    document.getElementById("modal_box_img").ondblclick = () => {
        LikeOn(article.id);
    };
    document.getElementById("like_icon_off").onclick = () => {
        LikeUserList(article.likes);
    };
    document.getElementById("like_icon_on").onclick = () => {
        LikeUserList(article.likes);
    };


    //캐로셀 좌우 버튼 보이기
    if (article.images.length <= 1) {
        document.getElementById("slide_left").style.display = "none";
        document.getElementById("slide_right").style.display = "none";
    }else{
        document.getElementById("slide_left").style.display = "block";
        document.getElementById("slide_right").style.display = "block";
    }

    //코멘트 달기
    for (let i = 0; i < article.comment.length; i++) {
        if(article.comment[i].user==PayLoad.user_id){
            comment_list.innerHTML +=
            `<div class="modal_comment_text">
                <div class="balloon_03">
                    <div>
                        ${article.comment[i].comment}
                    </div>
                </div>
                <div class="modal_comment_user">${article.comment[i].username} <span>${article.comment[i].date}</span>
                <div onclick="CommentDelete(${article.comment[i].id},${article.id})" class="comment_delete">삭제</div>
                <div onclick="CommentEdit(${article.comment[i].id},${article.id})" class="comment_edit">수정</div>
                </div>
            </div > `
        }else if(article.comment[i].user!=PayLoad.user_id){
            comment_list.innerHTML +=
            `<div class="modal_comment_text">
                <div class="balloon_03">
                    <div>
                        ${article.comment[i].comment}
                    </div>
                </div>
                <div class="modal_comment_user">${article.comment[i].username} <span>${article.comment[i].date}</span>
                </div>
            </div > `
        }
    }
    // 수정 삭제 버튼+팔로우 버튼 보이기
    if (article.user== PayLoad.user_id){
        document.getElementById("article_delete").style.display="flex"
        document.getElementById("article_edit").style.display="flex"
        document.getElementById("modal_follow").style.display="none"
    }else if (article.user!= PayLoad.user_id){
        document.getElementById("article_delete").style.display="none"
        document.getElementById("article_edit").style.display="none"
        document.getElementById("modal_follow").style.display="flex"
    }
}

// 바디 클릭시 모달 창 닫기 기본 모달
document.body.addEventListener("click", function (e) {
    if (e.target.id == "modal_box") {
        document.getElementById("modal_box").style.display = "none";
        document.getElementById("modal_box_img").src = "";
        document.body.style.overflow = "auto";
        document.body.style.touchAction = "auto";
    }
});

// 댓글 전송하기
async function sendComment(id) {
    const comment = document.getElementById("modal_comment_text").value
    await postComment(id, comment)
    openDetailModal(id)
    document.getElementById("modal_comment_text").value = ""
}

// 유저 정보 수정
async function saveUserInfo(user_id) {
    let response = await putUserInfo(user_id)
    alert('변경 완료')
}

// 반려동물 등록
async function addPetProfile() {
    let name = document.getElementById("add_pet_profile_name").value
    let birthday = document.getElementById("add_pet_profile_birthday").value

    const chkList_type = document.querySelectorAll("input[name=pet_type]:checked");
    let type = ''
    chkList_type.forEach(function (ch) {
        type = ch.value
    });

    const chkList_gender = document.querySelectorAll("input[name=pet_gender]:checked");
    let gender = ''
    chkList_gender.forEach(function (ch) {
        gender = ch.value
    });

    const chkList_size = document.querySelectorAll("input[name=pet_size]:checked");
    let size = ''
    chkList_size.forEach(function (ch) {
        size = ch.value
    });

    await postPetProfile(name, birthday, type, gender, size)

    document.getElementById("add_pet_modal_box").style.display = "none";

    await loadUserInfo()
    alert("등록 완료")
}

// 반려동물 등록 모달 활성화
function showAddPetProfile() {
    const add_pet_modal_box = document.getElementById("add_pet_modal_box")
    add_pet_modal_box.style.display = "flex"
}

// 반려동물 등록 모달 비활성화(바디 클릭)
document.body.addEventListener("click", function (e) {
    if (e.target.id == "add_pet_modal_box") {
        document.getElementById("add_pet_modal_box").style.display = "none";
        document.body.style.overflow = "auto";
        document.body.style.touchAction = "auto";
    }
});

// 반려동물 정보 불러오기
function showPetProfileInfo(petprofile) {
    console.log(petprofile)
    const user_profile_section = document.getElementById("user_profile_section")
    user_profile_section.innerHTML =
        `<div class="user_profile_box">
            <div class="user_profile_item">
                <p>비밀번호</p>
                <button type="button" onclick="">변경</button>
            </div>
            <div class="user_profile_item">
                <p>이메일</p>
                <span id="user_profile_email"></span>
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
                <input type="radio" id="gender_male" name="gender" value=1>
                <label for="남성">남성</label>
                <input type="radio" id="gender_female" name="gender" value=2>
                <label for="여성">여성</label>
            </div>
            <div class="user_profile_save">
                <button type="button" onclick="saveUserInfo()">저장</button>
            </div>
        </div > `
}

// 회원 정보 불러오기(메뉴)
async function loadUserInfo() {
    // 반려동물 등록 버튼 활성화
    const user_button_box = document.getElementById("user_button_box")
    document.getElementById("user_button_box").style.display = "flex"
    user_button_box.innerHTML =
        `<div class="menu_change_button_box">
            <button id="menu_change_button" class="menu_change_button" type="button" onclick="showAddPetProfile()">
                반려동물 등록
            </button>
        </div > `

    const show_container = document.getElementById("show_container")
    show_container.innerHTML =
        `<div id = "show_box" class="show_box">
            <div id="user_info_box" class="user_info_box">
                <div id="user_profile_section" class="user_profile_section">
                </div>
                <div id="pet_profile_section" class="pet_profile_section">
                </div>
            </div>
        </div > `

    let user = await getUserInfo()

    const user_profile_section = document.getElementById("user_profile_section")
    user_profile_section.innerHTML =
        `<div class="user_profile_box">
            <div class="user_profile_item">
                <p>비밀번호</p>
                <button type="button" onclick="">변경</button>
            </div>
            <div class="user_profile_item">
                <p>이메일</p>
                <span id="user_profile_email"></span>
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
                <input type="radio" id="gender_male" name="gender" value=1>
                <label for="남성">남성</label>
                <input type="radio" id="gender_female" name="gender" value=2>
                <label for="여성">여성</label>
            </div>
            <div class="user_profile_save">
                <button type="button" onclick="saveUserInfo(${user.id})">저장</button>
            </div>
        </div > `
    const email = document.getElementById("user_profile_email")
    const phone = document.getElementById("user_profile_phone")
    const birthday = document.getElementById("user_profile_birthday")
    const gender_male = document.getElementsByName("gender_male")
    const gender_female = document.getElementById("gender_female")

    email.innerText = user.email
    phone.setAttribute("value", user.phone_num)
    birthday.setAttribute("value", user.birthday)

    if (user.gender == 1) {
        gender_male.checked = true
    }
    if (user.gender == 2) {
        gender_female.checked = true
    }
    // if (user.gender == 3) {
    //     gender_unknown.checked = true
    // }

    const pet_profile_section = document.getElementById("pet_profile_section")
    let petprofiles = user.petprofile
    for (let i = 0; i < petprofiles.length; i++) {
        // let petprofile = {
        //     pet_id: petprofiles[i].id,
        //     pet_name: petprofiles[i].name,
        //     pet_birthday: petprofiles[i].birthday,
        //     pet_type: petprofiles[i].type,
        //     pet_gender: petprofiles[i].gender,
        //     pet_size: petprofiles[i].size,
        //     pet_profile_img: petprofiles[i].pet_profile_img
        // }
        let pet_id = petprofiles[i].id
        let pet_name = petprofiles[i].name
        // let pet_birthday = petprofiles[i].birthday
        // let pet_type = petprofiles[i].type
        // let pet_gender = petprofiles[i].gender
        // let pet_size = petprofiles[i].size
        let pet_profile_img = petprofiles[i].pet_profile_img
        pet_profile_section.innerHTML +=
            `<div id="pet_profile_card${pet_id}" class="pet_profile_card" onclick="showPetProfileInfo(${pet_id})">
                <div class="pet_img">
                    <img src="${pet_profile_img}" />
                </div>
                <div class="pet_name">
                    <p>${pet_name}</p>
                </div>
            </div > `
    }
}

// 좋아요 페이지 아티클 보이기
async function loadLikeArticle() {
    document.getElementById("user_button_box").style.display = "none"

    const show_container = document.getElementById("show_container")
    show_container.innerHTML =
        `<div id = "show_box" class="show_box">
            <div id="like_article_box_wrapper">
                <div id="like_article_box" class="like_article_box" >
                </div>
            </div>
        </div > `

    let user = await getUserInfo()

    for (let i = 0; i < user['like_articles'].length; i++) {
        let like_article = user['like_articles'][i]

        like_article_box.innerHTML +=
            `<div class="article_card">
                <img src='${like_article['imgurl'][0]}' onclick = "openDetailModal(${like_article['id']})" >
                <div style="position:relative; background-color:transparent; width:100%; height:30px; top:-34px;color:red;padding-left:10px"><i class="fa fa-heart"></i> ${like_article['author']}</div>
            </div > `
    }
}


// function listLikeUser(likes){
//     if (likes.length == 0) {
//         document.getElementById("like_user_list").style.display = "flex";
//     } else {
//         document.getElementById("like_user_list").innerHTML = "";
//         likes.forEach((user) => {
//             document.getElementById(
//                 "like_user_list"
//             ).innerHTML += `<div>${user}</div>`;
//         });
//         document.getElementById("like_user_list").style.display = "flex";
//     }
//     document.getElementById("like_user_list").onclick = () => {
//         if (document.getElementById("like_user_list").style.display == "flex") {
//             document.getElementById("like_user_list").style.display = "none";
//         }
//     };
// }

loadMyArticle()