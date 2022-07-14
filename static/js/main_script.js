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

const GetImgList = () => {
  fetch("http://127.0.0.1:8000/article/")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((item) => {
        let random = Math.floor(Math.random() * (10 - -10 + 1)) + -10;
        let html = `<div onclick="modal_open(${item.id})" style="transform: rotate(${random}deg);" class="article_list_box">
        <img src="${item.images[0]}" alt="">
        </div>`;
        document.getElementById("main_article_list").innerHTML += html;
      });
    });
};

function top_left_scroll() {
  let scroll_left = document.getElementById("top_article").scrollLeft;
  if (scroll_left > 0) {
    document.getElementById("top_article").scrollLeft = scroll_left - 1;
    setTimeout("top_left_scroll()", 1);
  }
}

function top_right_scroll() {
  let scroll_left = document.getElementById("top_article").scrollLeft;
  let scroll_width = document.getElementById("top_article").scrollWidth;
  if (scroll_left < scroll_width) {
    document.getElementById("top_article").scrollLeft = scroll_left + 1;
    setTimeout("top_right_scroll()", 1);
  }
}

function modal_open(id) {
  fetch(`http://127.0.0.1:8000/article/${id}/`)
    .then((res) => res.json())
    .then((data) => {
      let images = data.images
      let content = data.content
      let comments = data.comment
      // console.log(comments)
      document.getElementById("modal_box_img").src = images[0];
      document.getElementById("modal_content_text").innerHTML = content
      document.getElementById("modal_comment_list").innerHTML = ""
      comments.forEach((item) => {
        console.log(item)
        let html = `<div class="modal_comment_text">
                        <div class="balloon_03">
                            <div>
                                ${item.comment}asdsad
                            </div>
                        </div>
                        <div class="modal_comment_user">${item.user} <span>1일전</span></div>
                    </div>
                    `
        document.getElementById("modal_comment_list").innerHTML += html
      })
      document.getElementById("modal_comment_submit").addEventListener("click", function () {

        let src = document.getElementById("modal_box_img").src;
        console.log('53번째줄 src는?' + src)
        let index = images.findIndex((item) => item == src);
        console.log('인덱스 번호 :' + index)
        console.log('이미지 갯수 :' + images.length)
        console.log('이미지 링크 :' + src);
        if (index < images.length - 1) {
          image_slider(images[index + 1]);
        } else {
          image_slider(images[0]);
        }
      }
      )
    });
}

function image_slider(img) {
  document.getElementById("modal_box_img").src = img
  document
    .getElementById("modal_box_img")
    .animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 1000,
      fill: "forwards",
    });
}

function modal_desc_info(id) {
  document.getElementById("modal_info_btn").style.display = "none";
  document.getElementById("modal_desc").style.display = "flex";
  document.getElementById("modal_info_colse_btn").style.display = "flex";
}

function modal_close() {
  document.getElementById("modal_box").style.display = "none";
  document.getElementById("modal_box_img").src = "";
  document.body.style.overflow = "auto";
  document.body.style.touchAction = "auto";

  // document.getElementById("modal_comment_submit").removeEventListener("click", myHandler);
}

function upload_file() {
  document.getElementById("upload_file").click();
  document
    .getElementById("upload_file")
    .addEventListener("change", function (e) {
      let files = e.target.files;
      document.getElementById("upload_modal_btn").style.display = "none";
      if (files.length > 1) {
        document.getElementById("upload_modal_btn").style.display = "none";
        document.getElementById("preview_img").src = URL.createObjectURL(
          files[0]
        );
        document.getElementById("preview_img").style.display = "flex";
        document.getElementById("preview_multi_img").innerHTML = "";
        for (let i = 0; i < files.length - 1; i++) {
          let src = URL.createObjectURL(files[i + 1]);
          let html = `<img src="${src}" alt="">`;
          document.getElementById("preview_multi_img").innerHTML += html;
        }
        document.getElementById("preview_multi_img").style.display = "flex";
        document.getElementById("upload_submit_button").style.display = "flex";
      } else {
        document.getElementById("upload_modal_btn").style.display = "none";
        document.getElementById("preview_img").src = URL.createObjectURL(
          files[0]
        );
        document.getElementById("preview_img").style.display = "flex";
        document.getElementById("upload_submit_button").style.display = "flex";
      }
      // console.log(files);
    });
}
function upload_modal_open() {
  document.getElementById("upload_modal").style.display = "flex";
  document.body.style.overflow = "hidden";
  document.body.style.touchAction = "none";
}
function upload_modal_cancel() {
  document.getElementById("upload_content").value = "";
  document.getElementById("upload_file").value = "";
  document.getElementById("upload_modal").style.display = "none";
  document.getElementById("preview_img").style.display = "none";
  document.getElementById("preview_multi_img").style.display = "none";
  document.getElementById("upload_submit_button").style.display = "none";
  document.getElementById("upload_model_content").style.display = "none";
  document.getElementById("upload_modal_btn").style.display = "flex";
}

function upload_modal_submit() {
  let upload_content = document.getElementById("upload_content").value;
  let upload_file = document.getElementById("upload_file").files;
  let upload_modal_content = document.getElementById("upload_model_content");
  console.log(upload_content);
  if (upload_content == "") {
    upload_modal_content.style.display = "flex";
  } else {
    let formData = new FormData();
    formData.append("content", upload_content);
    for (let i = 0; i < upload_file.length; i++) {
      formData.append("image_lists", upload_file[i]);
    }
    document.getElementById("now_loading").style.display = "flex";
    fetch("http://127.0.0.1:8000/article/", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user_access_token"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        upload_modal_cancel();
        document.getElementById("now_loading").style.display = "none";
      });
  }
}

GetImgList();
