// 내 게시물 전체 불러오기(메뉴)
async function loadMyArticle() {
    document.getElementById("user_button_box").style.display = "none"


    //

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

    let user = await getUserInfo()

    document.getElementById("username").innerText = user.username
    document.getElementById("user_profile_img").src = user.profile_img
    // document.getElementById("introduction").innerHTML = user.introduction

    username.innerHTML = user.username
    introduction.innerHTML = user.introduction
    user_profile_img.src = user.profile_img

    const pet_select_box = document.getElementById("pet_select_box")
    pet_select_box.style.display = "flex"
    pet_select_box.innerHTML +=
            `<div class="pet_botton_box" id='my_pet_botton_box' onclick="loadMyArticle()">
                <div class="pet_button">
                    나의 글
                </div>
            </div>`

    let petprofiles = user.petprofile
    for (let i = 0; i < petprofiles.length; i++) {
        let pet_name = petprofiles[i].name
        pet_select_box.innerHTML +=
            `<div class="pet_botton_box" id="pet_botton_box${petprofiles[i].id}" onclick="loadPetprofile(${petprofiles[i].id})">
                <div class="pet_button">
                    ${pet_name}
                </div>
            </div>`
    }
    // document.getElementsByClassName("pet_botton_box").style.backgroundColor = "white"
    // document.getElementsByClassName("pet_botton_box").style.color = "#6e85b7"
    document.getElementById("my_pet_botton_box").style.backgroundColor = "#6e85b7"
    document.getElementById("my_pet_botton_box").style.color = "white"
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
    

    author.innerText = article.author
    content.innerText = article.content
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

// 반려동물 정보 수정
async function savePetInfo(pet_id) {
    let name = document.getElementById("update_pet_profile_phone").value
    let birthday = document.getElementById("update_pet_profile_birthday").value

    const chkList_type = document.querySelectorAll("input[name=update_pet_type]:checked");
    let type = ''
    chkList_type.forEach(function (ch) {
        type = ch.value
    });

    const chkList_gender = document.querySelectorAll("input[name=update_pet_gender]:checked");
    let gender = ''
    chkList_gender.forEach(function (ch) {
        gender = ch.value
    });

    const chkList_size = document.querySelectorAll("input[name=update_pet_size]:checked");
    let size = ''
    chkList_size.forEach(function (ch) {
        size = ch.value
    });
    let pet = await putPetInfo(pet_id, name, birthday, type, gender, size)
    alert('수정 완료')
}

// 반려동물 정보 불러오기 [리팩토링 필수(radio 함수화)]
async function showPetInfo(pet_id) {
    const user_profile_section = document.getElementById("user_profile_section")
    
    let user = await getUserInfo()
    let petprofiles = user.petprofile
    const petprofile = petprofiles.filter( value => value.id == pet_id)[0]
    let pet_name = petprofile.name
    let pet_birthday = petprofile.birthday
    let pet_type = petprofile.type
    let pet_gender = petprofile.gender
    let pet_size = petprofile.size

    document.getElementById("username").innerText = petprofile.name
    document.getElementById("user_profile_img").src = petprofile.pet_profile_img
    // document.getElementById("introduction").innerHTML = user.introduction

    user_profile_section.innerHTML =
        `<div class="user_profile_box">
            <div class="user_profile_item">
                <p>이름</p>
                <input id="update_pet_profile_phone" type="text" value="${pet_name}"/>
            </div>
            <div class="user_profile_item">
                <p>생년월일</p>
                <input id="update_pet_profile_birthday" type="date"  value="${pet_birthday}"/>
            </div>
            <div class="user_profile_item">
                <p>종류</p>
                <input type="radio" id="update_pet_dog" name="update_pet_type" value=1>
                <label for="강아지">강아지</label>
                <input type="radio" id="update_pet_cat" name="update_pet_type" value=2>
                <label for="고양이">고양이</label>
                <input type="radio" id="update_pet_etc" name="update_pet_type" value=3>
                <label for="그외">그외</label>
            </div>
            <div class="user_profile_item">
                <p>크기</p>
                <input type="radio" id="update_size_small" name="update_pet_size" value=1>
                <label for="소형">소형</label>
                <input type="radio" id="update_size_medium" name="update_pet_size" value=2>
                <label for="중형">중형</label>
                <input type="radio" id="update_size_large" name="update_pet_size" value=3>
                <label for="대형">대형</label>
            </div>
            <div class="user_profile_item">
                <p>성별</p>
                <input type="radio" id="update_pet_gender_male" name="update_pet_gender" value=1>
                <label for="남성">남성</label>
                <input type="radio" id="update_pet_gender_female" name="update_pet_gender" value=2>
                <label for="여성">여성</label>
                <input type="radio" id="update_pet_gender_unknown" name="update_pet_gender" value=3>
                <label for="모름">모름</label>
            </div>  
            <div class="user_profile_save">
                <button type="button" onclick="savePetInfo(${pet_id})">저장</button>
            </div>
        </div > `

    const update_pet_dog = document.getElementById("update_pet_dog")
    const update_pet_cat = document.getElementById("update_pet_cat")
    const update_pet_etc = document.getElementById("update_pet_etc")
    const update_size_small = document.getElementById("update_size_small")
    const update_size_medium = document.getElementById("update_size_medium")
    const update_size_large = document.getElementById("update_size_large")
    const update_pet_gender_male = document.getElementById("update_pet_gender_male")
    const update_pet_gender_female = document.getElementById("update_pet_gender_female")
    const update_pet_gender_unknown = document.getElementById("update_pet_gender_unknown")
    
    if (pet_type == 1) {
        update_pet_dog.checked = true
    }
    if (pet_type == 2) {
        update_pet_cat.checked = true
    }
    if (pet_type == 3) {
        update_pet_etc.checked = true
    }
    if (pet_gender == 1) {
        update_pet_gender_male.checked = true
    }
    if (pet_gender == 2) {
        update_pet_gender_female.checked = true
    }
    if (pet_gender == 3) {
        update_pet_gender_unknown.checked = true
    }
    if (pet_size == 1) {
        update_size_small.checked = true
    }
    if (pet_size == 2) {
        update_size_medium.checked = true
    }
    if (pet_size == 3) {
        update_size_large.checked = true
    }

    const pet_profile_section = document.getElementById("pet_profile_section")
    pet_profile_section.innerHTML =
        `<div id="pet_profile_card" class="pet_profile_card" onclick="loadUserInfo()">
            <div class="pet_img">
                <img src="${user.profile_img}" />
            </div>
            <div class="pet_name">
                <p>${user.username}</p>
            </div>
        </div > `
    for (let i = 0; i < petprofiles.length; i++) {
        let pet_id = petprofiles[i].id
        let pet_name = petprofiles[i].name
        let pet_profile_img = petprofiles[i].pet_profile_img
        pet_profile_section.innerHTML +=
            `<div id="pet_profile_card${pet_id}" class="pet_profile_card" onclick="showPetInfo(${pet_id})">
                <div class="pet_img">
                    <img src="${pet_profile_img}" />
                </div>
                <div class="pet_name">
                    <p>${pet_name}</p>
                </div>
            </div > `
    }
    let pet_profile_card = document.getElementById(`pet_profile_card${pet_id}`)
    pet_profile_card.remove()

}

// 회원 비밀번호 인증 모달 활성화
function showAuthPassword() {
    const update_pw_modal_box = document.getElementById("update_pw_modal_box")
    update_pw_modal_box.style.display = "flex"
}

// 회원 비밀번호 변경 모달 활성화
function showUpdatePassword(user_id) {
    const update_pw_modal_box = document.getElementById("update_pw_modal_box")
    update_pw_modal_box.innerHTML =
        `<div class="update_pw_modal_content">
            <div class="update_pw_msg_box">
                <p>새로운 비밀번호를 입력해주세요</p>
            </div>
            <div class="update_pw_input_box">
                <input id="update_npw_input" type="password" />
            </div>
            <div class="update_pw_input_box">
                <input id="update_cpw_input" type="password" />
            </div>
            <div class="update_pw_button_box">
                <button type="button" onclick="checkPassword(${user_id})">
                    변경
                </button>
            </div>
        </div>`
}


// 회원 비밀번호 인증
// async function AuthPassword() {
//     const update_pw_input = document.getElementById("update_pw_input").value

//     let response = await postAuthPassword(update_pw_input)

// }

//  변경 비밀번호 일치 확인
async function checkPassword(user_id) {
    const new_password = document.getElementById("update_npw_input").value
    const check_password = document.getElementById("update_cpw_input").value

    if (new_password == check_password) {
        await putPassword(user_id, new_password)
    } else {
        alert('비밀번호를 다시 확인해주세요.')
    }

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

    document.getElementById("username").innerText = user.username
    document.getElementById("user_profile_img").src = user.profile_img
    // document.getElementById("introduction").innerHTML = user.introduction

    const user_profile_section = document.getElementById("user_profile_section")
    user_profile_section.innerHTML =
        `<div class="user_profile_box">
            <div class="user_profile_item">
                <p>비밀번호</p>
                <button type="button" onclick="showAuthPassword()">변경</button>
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

    const pet_profile_section = document.getElementById("pet_profile_section")
    let petprofiles = user.petprofile
    for (let i = 0; i < petprofiles.length; i++) {
        let pet_id = petprofiles[i].id
        let pet_name = petprofiles[i].name
        let pet_profile_img = petprofiles[i].pet_profile_img
        pet_profile_section.innerHTML +=
            `<div id="pet_profile_card${pet_id}" class="pet_profile_card" onclick="showPetInfo(${pet_id})">
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

    document.getElementById("username").innerText = user.username
    document.getElementById("user_profile_img").src = user.profile_img
    // document.getElementById("introduction").innerHTML = user.introduction

    for (let i = 0; i < user['like_articles'].length; i++) {
        let like_article = user['like_articles'][i]

        like_article_box.innerHTML +=
            `<div class="article_card">
                <img src='${like_article['imgurl'][0]}' onclick = "openDetailModal(${like_article['id']})" >
                <div style="position:relative; background-color:transparent; width:100%; height:30px; top:-34px;color:red;padding-left:10px"><i class="fa fa-heart"></i> ${like_article['author']}</div>
            </div > `
    }
}
async function loadPetprofile(id) {
    document.getElementById("user_button_box").style.display = "none"

    const show_box = document.getElementById("show_box")
    show_box.innerHTML =
        `<div id="pet_article_box_wrapper">              
            <div id="pet_article_box" class="article_box">
            </div>
        </div>`
    const pet_article_box = document.getElementById("pet_article_box")
    let pet = await getPetArticle(id)

    for (let i=0; i<pet.article.length; i++) {
        let article= pet.article[i]
        pet_article_box.innerHTML +=
            `<div class="article_card">
                <img src='${article.images[0]}' onclick="openDetailModal(${article.id})" >
                <div style="position:relative; background-color:transparent; width:100%; height:30px; top:-34px;color:red;padding-left:10px"><i class="fa fa-heart"></i>${article.like_num} </div>
            </div > `
    }
    // document.querySelectorAll(".pet_botton_box").style.backgroundColor = "white"
    // document.querySelectorAll('.pet_botton_box').color = "#6e85b7"
    // document.querySelectorAll('.pet_botton_box').backgroundColor = "white"
    document.getElementById("pet_botton_box"+id).style.backgroundColor = "#6e85b7"
    document.getElementById("pet_botton_box"+id).style.color = "white"//id는 pet id
}

// const nonClick = document.querySelectorAll(".pet_botton_box");

// function handleClick(event) {
//   // div에서 모든 "click" 클래스 제거
//     nonClick.forEach((e) => {
//         e.classList.remove("click");
//     });
//   // 클릭한 div만 "click"클래스 추가
//     event.target.classList.add("click");
// }

// nonClick.forEach((e) => {
//     e.addEventListener("click", handleClick);
// });

// let petprofiles = user.petprofile
// for (let i = 0; i < petprofiles.length; i++) {
//     let pet_name = petprofiles[i].name
//     pet_select_box.innerHTML +=
//         `<div class="pet_botton_box" onclick="loadPetprofile(${petprofiles[i].id})">
//             <div class="pet_button">
//                 ${pet_name}
//             </div>
//         </div>`
// }



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