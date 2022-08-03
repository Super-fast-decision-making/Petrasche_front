//디테일 모달 열기+보여주기
async function openDetailModal(id) {
    document.getElementById("mypage_modal_comment_list").innerHTML = ""
    const PayLoad = JSON.parse(localStorage.getItem("payload"));
    const modal_box = document.getElementById("modal_box")

    modal_box.style.display = "flex"


    const article = await getDetailArticle(id)
    console.log(article)


    const modal_box_img = document.getElementById("modal_box_img");
    const author = document.getElementById("author");
    const author_profile_img = document.getElementById("author_profile_img");
    const content = document.getElementById("content");
    const comment_list = document.getElementById("mypage_modal_comment_list");
    const submit_button = document.getElementById("modal_comment_submit");
    const modal_follow = document.getElementById("modal_follow");
    const article_delete = document.getElementById("article_delete");
    const article_edit = document.getElementById("article_edit");
    const modal_like_num1 = document.getElementById("modal_like_num1");
    const modal_like_num2 = document.getElementById("modal_like_num2");
    const modal_edit_text = document.getElementById("modal_edit_text");

    author.innerText = article.author;
    author.setAttribute("onClick",`profile(${article.user})`)
    author_profile_img.src = article.profile_img[0];
    content.innerHTML = tagToLink(article.content);
    modal_like_num1.innerText = article.like_num;
    modal_like_num2.innerText = article.like_num;
    modal_box_img.src = article.images[0];
    article_delete.setAttribute("onClick", `articleDelete(${article.id})`);
    article_edit.setAttribute("onClick", `articleEdit(${article.id})`);
    // modal_edit_text.innerHTML = article.content;
    console.log(article.id)
    submit_button.setAttribute("onClick", `sendComment(${article.id})`);
    modal_follow.setAttribute("onClick", `Follow('${article.author}', ${article.id})`);

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
    document.getElementById("modal_box_img").ondblclick = () => { //더블클릭시 article.id값 좋아요되는 함수 실행
        LikeOn(article.id);
    };
    document.getElementById("like_icon_off").onclick = () => {//라익 아이콘? 클릭시 라이크 유저 리스트되는 함수 실행
        LikeUserList(article.likes);
    };
    document.getElementById("like_icon_on").onclick = () => {
        LikeUserList(article.likes);
    };


    //캐로셀 좌우 버튼 보이기
    if (article.images.length <= 1) {
        document.getElementById("slide_left").style.display = "none";
        document.getElementById("slide_right").style.display = "none";
    } else {
        document.getElementById("slide_left").style.display = "block";
        document.getElementById("slide_right").style.display = "block";
    }

    //코멘트 달기
    for (let i = 0; i < article.comment.length; i++) {
        if (article.comment[i].user == PayLoad.user_id) {
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
                    </div>`
        } else if (article.comment[i].user != PayLoad.user_id) {
            comment_list.innerHTML +=
                `<div class="modal_comment_text">
                    <div class="balloon_03">
                    <div>
                    ${article.comment[i].comment}
                    </div>
                    </div>
                    <div class="modal_comment_user">${article.comment[i].username} <span>${article.comment[i].date}</span>
                    </div>
                    </div>`
        }
    }
    // 수정 삭제 버튼+팔로우 버튼 보이기
    if (article.user == PayLoad.user_id) {
        document.getElementById("article_delete").style.display = "flex"
        document.getElementById("article_edit").style.display = "flex"
        document.getElementById("modal_follow").style.display = "none"
    } else if (article.user != PayLoad.user_id) {
        document.getElementById("article_delete").style.display = "none"
        document.getElementById("article_edit").style.display = "none"
        document.getElementById("modal_follow").style.display = "flex"
    }

    document.getElementById("modal_box_img").ondblclick = () => {
        LikeOn(id);
    };
    document.getElementById("like_icon_on").onclick = () => {
        LikeOn(id);
    };
    document.getElementById("like_icon_off").onclick = () => {
        LikeOn(id);
    };
    document.getElementById("like_icon_off").onmouseover = () => {
        LikeUserList(article.like_users);
    };
    document.getElementById("like_icon_on").onmouseover = () => {
        LikeUserList(article.like_users);
    };
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
    console.log("##########",id)
    const comment = document.getElementById("modal_comment_text").value
    console.log(id, comment)
    await postComment(id, comment)
    openDetailModal(id)
    document.getElementById("modal_comment_text").value = ""
}


const LikeUserList = (like_user) => {
    if (like_user.length == 0) {
        document.getElementById("like_user_list").style.display = "flex";
    } else {
        document.getElementById("like_user_list").innerHTML = "";
        like_user.forEach((user) => {
            document.getElementById("like_user_list").innerHTML += `<div>${user}</div>`;
        });
        document.getElementById("like_user_list").style.display = "flex";
    }
    document.getElementById("like_user_list").onclick = () => {
        if (document.getElementById("like_user_list").style.display == "flex") {
            document.getElementById("like_user_list").style.display = "none";
        }
    };
};



function listLikeUser(likes) {
    if (likes.length == 0) {
        document.getElementById("like_user_list").style.display = "flex";
    } else {
        document.getElementById("like_user_list").innerHTML = "";
        likes.forEach((user) => {
            document.getElementById(
                "like_user_list"
            ).innerHTML += `<div> ${user}</div>`;
        });
        document.getElementById("like_user_list").style.display = "flex";
    }
    document.getElementById("like_user_list").onclick = () => {
        if (document.getElementById("like_user_list").style.display == "flex") {
            document.getElementById("like_user_list").style.display = "none";
        }
    };
}

