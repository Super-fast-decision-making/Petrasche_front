const BACK_END_URL = "http://127.0.0.1:8000/article/";

const GetImgList = () => {
  fetch(BACK_END_URL)
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

function upload_modal_submit() {
  let upload_content = document.getElementById("upload_content").value;
  let upload_file = document.getElementById("upload_file").files;
  let upload_modal_content = document.getElementById("upload_model_content");
  if (upload_content == "") {
    upload_modal_content.style.display = "flex";
  } else {
    let upload_content = document
      .getElementById("upload_content")
      .value.replace(/\n/g, "<br>");
    let formData = new FormData();
    formData.append("content", upload_content);
    for (let i = 0; i < upload_file.length; i++) {
      formData.append("image_lists", upload_file[i]);
    }
    document.getElementById("now_loading").style.display = "flex";
    fetch(BACK_END_URL, {
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
  document.getElementById("modal_box").style.display = "flex";
  fetch(`http://127.0.0.1:8000/article/${id}/`)
    .then((res) => res.json())
    .then((data) => {
      let images = data.images;
      let content = data.content;
      let comments = data.comment;
      document.getElementById("modal_box_img").src = images[0];
      document.getElementById("modal_content_text").innerHTML = content;
      document.getElementById("modal_comment_list").innerHTML = "";
      comments.forEach((item) => {
        console.log(item);
        let html = `<div class="modal_comment_text">
                          <div class="balloon_03">
                              <div>
                                  ${item.comment}
                              </div>
                          </div>
                          <div class="modal_comment_user">${item.username} <span>1일전</span></div>
                      </div>
                      `;
        document.getElementById("modal_comment_list").innerHTML += html;
      });
      let comment_html = `<textarea id="modal_comment_text" name="" id="" placeholder="댓글....."></textarea>
        <div onclick="CommentUpload(${id})" id="modal_comment_submit" class="modal_comment_submit">전송</div>`;

      document.getElementById("modal_comment_input").innerHTML = comment_html;
    });
}

const CommentUpload = (id) => {
  let comment_content = document.getElementById("modal_comment_text").value;
  if (comment_content == "") {
    alert("댓글을 입력해주세요");
    return
  }

  const data = {
    comment: comment_content,
  };
  fetch(`${BACK_END_URL}comment/${id}/`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("user_access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      modal_open(id)
    });
};

GetImgList();
