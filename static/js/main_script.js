const GetImgList = () => {
  let img_lists = [
    "https://cdn.pixabay.com/photo/2017/09/25/13/12/cocker-spaniel-2785074__480.jpg",
    "https://cdn.pixabay.com/photo/2016/12/13/05/15/puppy-1903313__340.jpg",
    "https://cdn.pixabay.com/photo/2016/10/31/14/55/rottweiler-1785760__340.jpg",
    "https://cdn.pixabay.com/photo/2019/05/27/19/08/puppy-4233378__340.jpg",
    "https://cdn.pixabay.com/photo/2016/01/05/17/51/maltese-1123016__480.jpg",
    "https://cdn.pixabay.com/photo/2017/07/31/21/15/dog-2561134__480.jpg",
    "https://cdn.pixabay.com/photo/2016/11/29/05/09/child-1867463__480.jpg",
    "https://cdn.pixabay.com/photo/2016/11/21/15/48/dog-1846066__480.jpg",
    "https://cdn.pixabay.com/photo/2019/07/30/05/53/dog-4372036__480.jpg",
    "https://cdn.pixabay.com/photo/2017/09/25/13/12/cocker-spaniel-2785074__480.jpg",
    "https://cdn.pixabay.com/photo/2016/12/13/05/15/puppy-1903313__340.jpg",
    "https://cdn.pixabay.com/photo/2016/10/31/14/55/rottweiler-1785760__340.jpg",
    "https://cdn.pixabay.com/photo/2019/05/27/19/08/puppy-4233378__340.jpg",
    "https://cdn.pixabay.com/photo/2016/01/05/17/51/maltese-1123016__480.jpg",
    "https://cdn.pixabay.com/photo/2017/07/31/21/15/dog-2561134__480.jpg",
    "https://cdn.pixabay.com/photo/2016/11/29/05/09/child-1867463__480.jpg",
    "https://cdn.pixabay.com/photo/2016/11/21/15/48/dog-1846066__480.jpg",
    "https://cdn.pixabay.com/photo/2019/07/30/05/53/dog-4372036__480.jpg",
  ];

  img_lists.forEach(function (item, index) {
    let random = 0;
    // let random = Math.floor(Math.random() * (10 - (-10) + 1)) + (-10);
    let html = `<div onclick="modal_open()" style="transform: rotate(${random}deg);" class="article_list_box">
    <img src="${item}" alt="">
</div>`;
    document.getElementById("main_article_list").innerHTML += html;
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

function modal_open() {
  document.getElementById("modal_box").style.display = "flex";
  document.body.style.overflow = "hidden";
  document.body.style.touchAction = "none";
}

function modal_desc_info() {
  document.getElementById("modal_info_btn").style.display = "none";
  document.getElementById("modal_desc").style.display = "flex";
  document.getElementById("modal_info_colse_btn").style.display = "flex";
}

function modal_close() {
  document.getElementById("modal_box").style.display = "none";
  document.getElementById("modal_desc").style.display = "none";
  document.getElementById("modal_info_colse_btn").style.display = "none";
  // document.getElementById("modal_info_btn").style.display = "flex";
  document.body.style.overflow = "auto";
  document.body.style.touchAction = "auto";
}

//바디 클릭시 모달 창 닫기 기본 모달
document.body.addEventListener("click", function (e) {
  if (e.target.id == "modal_box") {
    modal_close();
  }
});

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
