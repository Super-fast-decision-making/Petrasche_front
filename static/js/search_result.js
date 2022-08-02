
const GetUserInfo = () => {
  fetch(`${backend_base_url}user`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("user_access_token"),
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.username == null) {
        window.location.href = "./login.html";
      } else {
        document.getElementById("user").innerHTML = res.username;
      }
    });
};

const Refresh_Token = () => {
  const PayLoad = JSON.parse(localStorage.getItem("payload"));
  if (PayLoad.exp > Date.now() / 1000) {
    return;
  } else {
    fetch(`${backend_base_url}user/refresh/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("user_access_token"),
      },
      body: JSON.stringify({
        refresh: localStorage.getItem("user_refresh_token"),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        localStorage.setItem("user_access_token", res.access);
      });
  }
};

const GetImgList = () => {
  document.getElementById("main_article_list").innerHTML = "";
  fetch(`${backend_base_url}article/`)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((item) => {
        // 기울기 0
        // let random = 0;
        // 기울기 -5 ~ 5
        let random = Math.floor(Math.random() * 10) - 5;
        let html = `<div onmouseover="article_box_hover(this)" onclick="modal_open(${item.id})" style="transform: rotate(${random}deg);" class="article_list_box">
          <img src="${item.images[0]}" alt="">
          <div id="article_list_like" class="article_list_like">
          <div><i style="color: red;" class="fa-solid fa-heart"></i><span> ${item.like_num}</span></div>
          <div><i style="color: #cecece;" class="fa-solid fa-comment"></i><span> ${item.comment.length}</span></div>
          </div>
          </div>`;
        document.getElementById("main_article_list").innerHTML += html;
      });
    });
};

const GetSearchResultList = () => {
  var search_results = JSON.parse(localStorage.getItem('search_results'));
  document.getElementById("top_article").innerHTML = "";

  search_results.forEach((item) => {
    let html = `<div onclick="modal_open(${item.id})" class="top_article_list">
      <img src="${item.images[0]}" alt="">
      <div class="top_article_info">
          <div class="article_like_info">
            <div>좋아요 ${item.like_num}개</div>
            <div>댓글 ${item.comment.length}개</div>
          </div>
          <div>
              <img src="${item.images[0]}" alt="">
              <div class="top_article_user_name">${item.author}</div>
          </div>
          <div>
              ${item.content}
          </div>
      </div>`;
    document.getElementById("top_article").innerHTML += html;
  });
  localStorage.removeItem('search_results');

};

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
    fetch(`${backend_base_url}article`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user_access_token"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        alert("업로드 완료");
        window.location.reload();
      });
  }
}

function modal_open(id) {
  const PayLoad = JSON.parse(localStorage.getItem("payload"));
  let user_name = PayLoad.username;
  let user_id = PayLoad.user_id;
  document.body.style.overflow = "hidden";
  document.body.style.touchAction = "none";
  document.getElementById("modal_box").style.display = "flex";
  fetch(`${backend_base_url}article/${id}/`)
    .then((res) => res.json())
    .then((data) => {
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
      let content = tagToLink(content_raw)

      let comments = data.comment;
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
      document.getElementById("modal_edit_text").value = content_raw;
      comments.forEach((item) => {
        if (item.user == user_id) {
          let html = `<div class="modal_comment_text">
                          <div class="balloon_03">
                              <div>
                                  ${item.comment}
                              </div>
                          </div>
                          <div class="modal_comment_user">
                          <div>${item.username}</div>
                          <div>${item.date}</div>
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
                      <div>${item.date}</div>
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

const CommentUpload = (id) => {
  let comment_content = document.getElementById("modal_comment_text").value;
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
  })
    .then((res) => res.json())
    .then((res) => {
      modal_open(id);
    });
};


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
const ArticleDelete = (id) => {
  let confirm_delete = confirm("삭제하시겠습니까?");
  if (confirm_delete) {
    fetch(`${backend_base_url}article/myarticle/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user_access_token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        alert("삭제 완료");
        window.location.reload();
      });
  } else {
    return;
  }
};

const ArticleEdit = (id) => {
  document.getElementById("modal_edit_box").style.display = "flex";

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
      })
        .then((res) => res.json())
        .then((res) => {
          alert("수정 완료");
          document.getElementById("modal_edit_box").style.display = "none";
          modal_open(id);
        });
    } else {
      return;
    }
  };
};

const CommentEdit = (id, article_id, text) => {
  document.getElementById("modal_edit_box").style.display = "flex";
  let node = event.target.parentNode;
  let comment_value = node.parentNode.childNodes[1].childNodes[1].innerText;
  document.getElementById("modal_edit_text").value = comment_value.replace(
    /<br>/g,
    "\n"
  );

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
      })
        .then((res) => res.json())
        .then((res) => {
          alert("수정 완료");
          document.getElementById("modal_edit_box").style.display = "none";
          modal_open(article_id);
        });
    } else {
      return;
    }
  };
};

const CommentDelete = (id, article_id) => {
  let confirm_delete = confirm("삭제하시겠습니까?");
  if (confirm_delete) {
    fetch(`${backend_base_url}article/comment/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user_access_token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        alert("삭제 완료");
        modal_open(article_id);
      });
  } else {
    return;
  }
};

const LikeUserList = (like_user) => {
  if (like_user.length == 0) {
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
  })
    .then((res) => res.json())
    .then((res) => {
      alert(res.message);
      modal_open(article);
    });
};

GetUserInfo();
// GetImgList();
GetSearchResultList();
Refresh_Token();
