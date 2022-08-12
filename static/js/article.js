//바디 클릭시 모달 창 닫기 기본 모달
document.body.addEventListener("click", function (e) {
    if (e.target.id == "modal_box") {
        modal_close();
    }
});

//바디 클릭시 업로드 모달 창 닫기
document.body.addEventListener("click", function (e) {
    if (e.target.id == "upload_modal") {
        upload_modal_cancel();
    }
});

// 아티클 모달 페이지 보여주기
function modal_open(id) {
    const PayLoad = JSON.parse(localStorage.getItem("payload"));
    if (PayLoad == null) {
        swal("로그인", "로그인후 이용이 가능합니다.", "error");
        return;
    }
    let user_name = PayLoad.username;
    let user_id = PayLoad.user_id;
    let modal_box = document.getElementById("modal_box");
    fetch(`${backend_base_url}article/${id}/`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("user_access_token"),
        },
    })
        .then((res) => {
            if (res.status === 401) {
                swal("로그인", "로그인후 이용이 가능합니다.", "error");
                return;
            } else {
                res.json().then((data) => {
                    if (
                        modal_box.style.display == "" ||
                        modal_box.style.display == "none"
                    ) {
                        modal_box.style.display = "flex";
                        document.body.style.overflow = "hidden";
                        document.body.style.touchAction = "none";
                    }
                    if (data.likes.indexOf(user_id) != -1) {
                        document.getElementById("like_icon_off").style.display = "none";
                        document.getElementById(
                            "like_icon_on"
                        ).innerHTML = `<i class="fa-solid fa-heart"></i><span> ${data.likes.length}</span>`;
                        document.getElementById("like_icon_on").style.display = "flex";
                    } else {
                        document.getElementById("like_icon_on").style.display = "none";
                        document.getElementById(
                            "like_icon_off"
                        ).innerHTML = `<i class="fa-regular fa-heart"></i><span> ${data.likes.length}</span>`;
                        document.getElementById("like_icon_off").style.display = "flex";
                    }

                    document.getElementById("modal_follow").style.display = "flex";
                    document.getElementById("modal_follow").innerText = "팔로우";
                    document.getElementById("modal_follow_count").innerText =
                        data.user_following.length;

                    if (data.user_following.indexOf(user_id) != -1) {
                        document.getElementById("modal_follow").innerText = "언팔로우";
                        document.getElementById("modal_follow_count").innerText =
                            data.user_following.length;
                    }

                    if (data.user == user_id) {
                        document.getElementById("modal_follow").style.display = "none";
                    }

                    if (data.user == user_id) {
                        document.getElementById("article_delete").style.display = "block";
                        document.getElementById("article_edit").style.display = "block";
                        document.getElementById("article_delete").onclick = () => {
                            ArticleDelete(id);
                        };
                        document.getElementById("article_edit").onclick = () => {
                            ArticleEdit(id);
                        };
                    } else {
                        document.getElementById("article_delete").style.display = "none";
                        document.getElementById("article_edit").style.display = "none";
                    }
                    let images = data.images;
                    let content_raw = data.content;
                    let content = tagToLink(content_raw);

                    let comments = data.comments;
                    document.getElementById("modal_box_img").src = images[0];

                    if (data.images.length <= 1) {
                        document.getElementById("slide_left").style.display = "none";
                        document.getElementById("slide_right").style.display = "none";
                    } else {
                        document.getElementById("slide_left").style.display = "block";
                        document.getElementById("slide_right").style.display = "block";
                    }

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
                        LikeUserList(data.like_users);
                    };
                    document.getElementById("like_icon_on").onmouseover = () => {
                        LikeUserList(data.like_users);
                    };
                    document.getElementById("modal_content_text").innerHTML = content;
                    document.getElementById("modal_comment_list").innerHTML = "";
                    document.getElementById("modal_username").innerHTML = data.author;

                    document
                        .getElementById("modal_username")
                        .setAttribute("onclick", `profile(${data.user})`);
                    document.getElementById("modal_edit_text").value = content_raw;

                    comments.forEach((item) => {
                        if (item.userid == user_id) {
                            let html = `<div class="modal_comment_text">
                          <div class="balloon_03">
                              <div>
                                  ${item.comment}
                              </div>
                          </div>
                          <div class="modal_comment_user">
                          <div>${item.username}</div>
                          <div>${item.created_at}</div>
                          <div onclick="CommentDelete(${item.id},${data.id})" class="comment_delete">삭제</div>
                          <div onclick="CommentEdit(${item.id},${data.id})" class="comment_edit">수정</div>
                          </div>
                      </div>
                      `;
                            document.getElementById("modal_comment_list").innerHTML += html;
                        } else {
                            let html = `<div class="modal_comment_text">
                      <div class="balloon_03">
                      <div>
                      ${item.comment}
                      </div>
                      </div>
                      <div class="modal_comment_user">
                      <div>${item.username}</div>
                      <div>${item.created_at}</div>
                      </div>
                      </div>`;
                            document.getElementById("modal_comment_list").innerHTML += html;
                        }
                    });
                    let comment_html = `<textarea id="modal_comment_text" name="" id="" placeholder="댓글....."></textarea>
        <div onclick="CommentUpload(${id})" id="modal_comment_submit" class="modal_comment_submit">전송</div>`;

                    document.getElementById("modal_comment_input").innerHTML = comment_html;

                    document.getElementById("modal_follow").onclick = () => {
                        Follow(data.author, data.id);
                    };
                });
            }
        });
}

function modal_close() {
    document.getElementById("modal_box").style.display = "none";
    document.getElementById("modal_box_img").src = "";
    document.getElementById("modal_comment_text").value = "";
    document.getElementById("like_user_list").style.display = "none";
    document.body.style.overflow = "auto";
    document.body.style.touchAction = "auto";
    // GetImgList();
    // document.getElementById("modal_comment_submit").removeEventListener("click", myHandler);
}

// 코멘트 달기
const CommentUpload = (id) => {
    let comment_content = document.getElementById("modal_comment_text").value;
    comment_content = replace_text(comment_content);
    if (comment_content == "") {
        alert("댓글을 입력해주세요");
        return;
    }

    const data = {
        comment: comment_content,
    };
    fetch(`${backend_base_url}article/comment/${id}/`, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("user_access_token"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((res) => {
        if (res.status == 401) {
            alert("로그인이 필요합니다.");
            return;
        }
        res.json().then((res) => {
            modal_open(id);
        });
    });
};

// 좋아요 눌러주기
const LikeOn = (id) => {
    fetch(`${backend_base_url}article/like/${id}/`, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("user_access_token"),
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((res) => {
            document.getElementById("heart_ani").style.display = "block";
            setTimeout(() => {
                document.getElementById("heart_ani").style.display = "none";
            }, 500);

            modal_open(id);
        });
};

// 아티클 삭제하기
const ArticleDelete = (id) => {
    let confirm_delete = confirm("삭제하시겠습니까?");
    if (confirm_delete) {
        fetch(`${backend_base_url}article/myarticle/${id}/`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("user_access_token"),
                "Content-Type": "application/json",
            },
        }).then((res) => {
            if (res.status == 401) {
                alert("로그인이 필요합니다.");
                return;
            }
            res.json().then((res) => {
                alert("삭제 완료");
                window.location.reload();
            });
        });
    } else {
        return;
    }
};

const ArticleEdit = (id) => {
    document.getElementById("modal_edit_box").style.display = "flex";
    document.getElementById("modal_edit_text").value = document
        .getElementById("modal_content_text")
        .innerHTML.replace(/\<[^\>]+/g, "")
        .replaceAll(">", "");

    document.getElementById("modal_edit_button").onclick = () => {
        let content = document.getElementById("modal_edit_text").value;
        content = content.replace(/\n/g, "<br>");
        if (content == "") {
            alert("내용을 입력해주세요");
            return;
        }
        let confirm_edit = confirm("수정하시겠습니까?");
        if (confirm_edit) {
            const data = {
                content: content,
            };
            fetch(`${backend_base_url}article/myarticle/${id}/`, {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("user_access_token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }).then((res) => {
                if (res.status == 401) {
                    alert("로그인이 필요합니다.");
                    return;
                }
                res.json().then((res) => {
                    alert("수정 완료");
                    document.getElementById("modal_edit_box").style.display = "none";
                    modal_open(id);
                });
            });
        } else {
            return;
        }
    };
};

// 아티클 수정하기
const CommentEdit = (id, article_id, text) => {
    document.getElementById("modal_edit_box").style.display = "flex";
    let node = event.target.parentNode;
    let comment_value = node.parentNode.childNodes[1].childNodes[1].innerText;
    document.getElementById("modal_edit_text").value = comment_value.replace(
        /<br>/g,
        "\n"
    );
    // console.log(comment_value.replace(/<br>/g,"\n"))
    console.log("?????");
    console.log(document.getElementById("modal_edit_text").value);
    // document.getElementById("modal_edit_text").value = comment_value.replace(/<br\s*[\/]?>/gi,"\n");

    document.getElementById("modal_edit_button").onclick = () => {
        let comment = document.getElementById("modal_edit_text").value;
        comment = comment.replace(/\n/g, "<br>");
        if (comment == "") {
            alert("내용을 입력해주세요");
            return;
        }
        let confirm_edit = confirm("수정하시겠습니까?");
        if (confirm_edit) {
            const data = {
                comment: comment,
            };
            fetch(`${backend_base_url}article/comment/${id}/`, {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("user_access_token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }).then((res) => {
                if (res.status == 401) {
                    alert("로그인이 필요합니다.");
                    return;
                }
                res.json().then((res) => {
                    alert("수정 완료");
                    document.getElementById("modal_edit_box").style.display = "none";
                    modal_open(article_id);
                });
            });
        } else {
            return;
        }
    };
};

//댓글 지우기
const CommentDelete = (id, article_id) => {
    let confirm_delete = confirm("삭제하시겠습니까?");
    if (confirm_delete) {
        fetch(`${backend_base_url}article/comment/${id}/`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("user_access_token"),
                "Content-Type": "application/json",
            },
        }).then((res) => {
            if (res.status == 401) {
                alert("로그인이 필요합니다.");
                return;
            }
            res.json().then((res) => {
                alert("삭제 완료");
                modal_open(article_id);
            });
        });
    } else {
        return;
    }
};

// 라이크 유저 리스트
const LikeUserList = (like_user) => {
    if (like_user.length == 0) {
        document.getElementById("like_user_list").innerHTML = "좋아요 없음";
        document.getElementById("like_user_list").style.display = "flex";
    } else {
        document.getElementById("like_user_list").innerHTML = "";
        like_user.forEach((user) => {
            document.getElementById(
                "like_user_list"
            ).innerHTML += `<div>${user}</div>`;
        });
        document.getElementById("like_user_list").style.display = "flex";
    }
    document.getElementById("like_user_list").onclick = () => {
        if (document.getElementById("like_user_list").style.display == "flex") {
            document.getElementById("like_user_list").style.display = "none";
        }
    };
};

// 팔로우 하기
const Follow = (user, article) => {
    const data = {
        username: user,
    };
    fetch(`${backend_base_url}user/follow/`, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("user_access_token"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((res) => {
        if (res.status == 401) {
            alert("로그인이 필요합니다.");
            return;
        }
        res.json().then((res) => {
            alert(res.message);
            modal_open(article);
        });
    });

};