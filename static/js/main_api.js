// page 전역변수
let page_num = 1;
let page = true;

// 스크롤 이벤트 부분
window.onscroll = function () {
  let timer;
  let scroll_top = document.documentElement.scrollTop;
  let scroll_height = document.documentElement.scrollHeight;
  let window_height = document.documentElement.clientHeight;
  let scroll_percent = (scroll_top / (scroll_height - window_height)) * 100;
  if (scroll_percent > 99 && page == true) {
    page = false;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      GetImgListPage(page_num);
      page_num++;
      page = true;
    }, 1000);
  }
};

// 로그인 부분
async function handleLogin() {
  const loginData = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };
  const response = await fetch(`${backend_base_url}user/login/`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(loginData),
  });
  response_json = await response.json();
  if (response.status == 200) {
    localStorage.setItem("user_access_token", response_json.access);
    localStorage.setItem("user_refresh_token", response_json.refresh);

    const base64Url = response_json.access.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    localStorage.setItem("payload", jsonPayload);
    window.location.reload();
  } else {
    alert("아이디 또는 비밀번호가 일치하지 않습니다.");
  }
}

// 펫 메뉴 부분
const GetSelectPetArticle = (pet_id) => {
  document.getElementById("main_article_list").innerHTML = "";
  fetch(`${backend_base_url}article/pet/${pet_id}/`,{
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("user_access_token")}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      res.forEach((item) => {
        let random = Math.floor(Math.random() * 10) - 5;
        if (window.innerWidth < 500) {
          random = 0;
        }
        let html = `<div onmouseover="article_box_hover(this)" onclick="modal_open(${item.id})" style="transform: rotate(${random}deg);" class="article_list_box">
            <img src="${item.images[0]}" alt="">
        <div id="article_list_like" class="article_list_like">
        <div><i style="color: red;" class="fa-solid fa-heart"></i><span> ${item.like_num}</span></div>
        <div><i style="color: #cecece;" class="fa-solid fa-comment"></i><span> ${item.comments.length}</span></div>
        </div>
        </div>`;
        document.getElementById("main_article_list").innerHTML += html;
      });
    });
};

// 페이지 리스트 불러오기
const GetImgListPage = (page) => {
  fetch(`${backend_base_url}article/page/${page}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("user_access_token"),
    },
  }).then((res) => {
    if (res.status == 401) {
      document.getElementById("login_modal_box").style.display = "flex";
      return;
    }
    res.json().then((data) => {
      if (data.length == 0) {
        return;
      } else {
        data.forEach((item) => {
          let random = Math.floor(Math.random() * 10) - 5;
          if (window.innerWidth < 500) {
            random = 0;
          }
          let html = `<div onmouseover="article_box_hover(this)" onclick="modal_open(${item.id})" style="transform: rotate(${random}deg);" class="article_list_box">
            <img src="${item.images[0]}" alt="">
            <div id="article_list_like" class="article_list_like">
            <div><i style="color: red;" class="fa-solid fa-heart"></i><span> ${item.like_num}</span></div>
            <div><i style="color: #cecece;" class="fa-solid fa-comment"></i><span> ${item.comments.length}</span></div>
            </div>
            </div>`;

          document.getElementById("main_article_list").innerHTML += html;
        });
      }
    });
  });
};

// 메인 이미지 리스트 불러오기 (비회원 20개)
const GetImgList = () => {
  fetch(`${backend_base_url}article/`)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((item) => {
        let random = Math.floor(Math.random() * 10) - 5;
        if (window.innerWidth < 500) {
          random = 0;
        }
        let html = `<div onmouseover="article_box_hover(this)" onclick="modal_open(${item.id})" style="transform: rotate(${random}deg);" class="article_list_box">
          <img src="${item.images[0]}" alt="">
          <div id="article_list_like" class="article_list_like">
          <div><i style="color: red;" class="fa-solid fa-heart"></i><span> ${item.like_num}</span></div>
          <div><i style="color: #cecece;" class="fa-solid fa-comment"></i><span> ${item.comments.length}</span></div>
          </div>
          </div>`;
        document.getElementById("main_article_list").innerHTML += html;
      });
    });
};

// 메인 인기게시물 불러오기 (비회원 9개)
const GetTopList = () => {
  fetch(`${backend_base_url}article/top/`)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("top_article").innerHTML = "";

      data.forEach((item) => {
        let html = `<div onclick="modal_open(${item.id})" class="top_article_list">
      <img src="${item.images[0]}" alt="">
      <div class="top_article_info">
          <div class="article_like_info">
            <div>좋아요 ${item.like_num}개</div>
            <div>댓글 ${item.comments.length}개</div>
          </div>
          <div>
              <img src="${item.images[0]}" alt="">
              <div onclick='profile(${item.user})' class="top_article_user_name">${item.author}</div>
          </div>
          <div>
              ${item.content}
          </div>
      </div>`;
        document.getElementById("top_article").innerHTML += html;
      });
    });
};

//이미지 업로드 부분
function upload_modal_submit() {
  let upload_content = document.getElementById("upload_content").value;
  let upload_file = document.getElementById("upload_file").files;
  let upload_modal_content = document.getElementById("upload_model_content");
  let pet_check = document.getElementsByName("pet_profile");
  let pet_profile_check = "";
  for (let i = 0; i < pet_check.length; i++) {
    if (pet_check[i].checked) {
      pet_profile_check = pet_check[i].value;
    }
  }
  if (upload_content == "") {
    upload_modal_content.style.display = "flex";
    fetch(`${backend_base_url}user/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("user_access_token"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let pet_profile = res.petprofile;
        if (pet_profile.length == 0) {
          document.getElementById("pet_profile_title").innerText =
            "펫 프로필 없음";
          document.getElementById("pet_profile_title").style.background = "red";
          document.getElementById("pet_profile_title").style.color = "white";
        } else {
          document.getElementById("pet_profile_title").innerText =
            "펫 프로필 선택";
          document.getElementById("pet_profile_title").style.background =
            "rgb(48, 48, 48)";
          document.getElementById("pet_profile_title").style.color = "white";
        }
        pet_profile.forEach((item) => {
          let html = `<input type="radio" name="pet_profile" id="pet-${item.id}" value="${item.id}">
        <label for="pet-${item.id}">
            <div><i class="fa-solid fa-circle-check"></i></div>
            <p class="pet_name">${item.name}</p>
            <img src="${item.pet_profile_img}" alt="" srcset="">
        </label>`;

          document.getElementById("pet_profile_select").innerHTML += html;
        });
      });
  } else {
    let upload_content = document
      .getElementById("upload_content")
      .value.replace(/\n/g, "<br>");
    let formData = new FormData();
    formData.append("content", upload_content);
    formData.append("user_pet", pet_profile_check);
    for (let i = 0; i < upload_file.length; i++) {
      formData.append("image_lists", upload_file[i]);
    }
    document.getElementById("now_loading").style.display = "flex";

    fetch(`${backend_base_url}article/`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user_access_token"),
      },
    })
      .then((res) => {
        if (res.status === 401) {
          alert("로그인이 필요합니다.");
          window.location.href = "/login.html";
        } else {
          alert("업로드 완료");
          window.location.reload();
        }
      })
      .catch((err) => {
        alert("서버 오류가 발생 되었습니다.");
        window.location.reload();
      });
  }
}

// 디테일 모달 열기+보여주기
async function openDetailModal(id) {
  document.getElementById("mypage_modal_comment_list").innerHTML = "";
  const PayLoad = JSON.parse(localStorage.getItem("payload"));
  const modal_box = document.getElementById("modal_box");

  modal_box.style.display = "flex";

  const article = await getDetailArticle(id);

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
  author_profile_img.src = article.profile_img[0];
  content.innerHTML = tagToLink(article.content);
  modal_like_num1.innerText = article.like_num;
  modal_like_num2.innerText = article.like_num;
  modal_box_img.src = article.images[0];
  article_delete.setAttribute("onClick", `articleDelete(${article.id})`);
  article_edit.setAttribute("onClick", `articleEdit(${article.id})`);
  modal_edit_text.innerHTML = article.content;

  submit_button.setAttribute("onClick", `sendComment(${article.id})`);
  modal_follow.setAttribute(
    "onClick",
    `Follow('${article.author}', ${article.id})`
  );

  //이미지
  let images = article.images;
  document.getElementById("slide_left").onclick = () => {
    let index = images.indexOf(document.getElementById("modal_box_img").src);
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
    let index = images.indexOf(document.getElementById("modal_box_img").src);
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
}

// 아티클 모달 페이지 보여주기
function modal_open(id) {
  const PayLoad = JSON.parse(localStorage.getItem("payload"));
  if (PayLoad == null) {
    alert("로그인이 필요합니다.");
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
        alert("로그인이 필요합니다.");
        window.location.href = "/login.html";
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

GetImgList();
GetTopList();
