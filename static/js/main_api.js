// page 전역변수
let page_num = 1;
let page = true;

function page_loading(){
  document.getElementById("now_loading_page").style.display = "flex";
}

function page_loading_hide(){
  document.getElementById("now_loading_page").style.display = "none";
}

function article_loading() {
  const article_list = document.getElementById("main_article_list")
  for (let i = 0; i < 20; i++) {
  let html = `<div onmouseover="article_box_hover(this)" onclick="modal_open()" style="transform: rotate();" class="article_list_box">
            <img src="https://blog.kakaocdn.net/dn/c3Rwqs/btqVugu1Dvv/SWkENtL39bcQ7fTrWNBxu0/img.gif" alt="">
        <div id="article_list_like" class="article_list_like">
        <div><i style="color: red;" class="fa-solid fa-heart"></i><span></span></div>
        <div><i style="color: #cecece;" class="fa-solid fa-comment"></i><span></span></div>
        </div>
        </div>`;

  article_list.innerHTML += html;
  }
}

function top_article_loading() {
  const top_article = document.getElementById("top_article")

  for (let i = 0; i < 9; i++) {
    let html = `<div onclick="modal_open()" class="top_article_list">
    <img src="https://blog.kakaocdn.net/dn/c3Rwqs/btqVugu1Dvv/SWkENtL39bcQ7fTrWNBxu0/img.gif" alt="">
    <div class="top_article_info">
        <div class="article_like_info">
          <div>읽어 오는중.....</div>
          <div>읽어 오는중.....</div>
        </div>
        <div>
            <img src="https://blog.kakaocdn.net/dn/c3Rwqs/btqVugu1Dvv/SWkENtL39bcQ7fTrWNBxu0/img.gif" alt="">
            <div onclick='profile()' class="top_article_user_name">읽어 오는중..</div>
        </div>
        <div>
            읽어 오는중....
        </div>
    </div>`;
    top_article.innerHTML += html;
  }
}

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

// 펫 메뉴 부분
const GetSelectPetArticle = (pet_id) => {
  article_loading();
  fetch(`${backend_base_url}article/pet/${pet_id}/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("user_access_token")}`,
    },
  })
    .then((res) => {
      if (res.status == 401) {
        alert("로그인이 필요합니다.");
        return;
      } else {
        res.json()
        .then((res) => {
          document.getElementById("main_article_list").innerHTML = "";
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
      }
    })
    
};

// 페이지 리스트 불러오기
const GetImgListPage = (page) => {
  page_loading();
  fetch(`${backend_base_url}article/page/${page}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("user_access_token"),
    },
  }).then((res) => {
    page_loading_hide();
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
  article_loading();
  fetch(`${backend_base_url}article/`)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("main_article_list").innerHTML = "";
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
  top_article_loading();
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
          document.getElementById("now_loading").style.display = "none";
          swal("로그인", "로그인후 이용이 가능합니다.", "error").then(() => {
            window.location.href = "./login.html";
          });
        } else {
          document.getElementById("now_loading").style.display = "none";
          swal("업로드 완료", "업로드가 정상으로 완료 되셨습니다.", "success").then(() => {
            window.location.reload();
          });
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

GetImgList();
GetTopList();