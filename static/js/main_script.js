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

function image_slider(img) {
  document.getElementById("modal_box_img").src = img;
  document
    .getElementById("modal_box_img")
    .animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 1000,
      fill: "forwards",
    });
}

function article_box_hover(target) {
  target.children[1].style.display = "flex";
  target.children[1].style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  target.addEventListener("mouseleave", function (e) {
    target.children[1].style.display = "none";
    target.children[1].style.backgroundColor = null
  }
  );
}

function modal_desc_info(id) {
  document.getElementById("modal_info_btn").style.display = "none";
  document.getElementById("modal_desc").style.display = "flex";
  document.getElementById("modal_info_colse_btn").style.display = "flex";
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
  document.body.style.overflow = "auto";
  document.body.style.touchAction = "auto";
}

function modal_edit_cancel() {
  document.getElementById("modal_edit_box").style.display = "none";
}