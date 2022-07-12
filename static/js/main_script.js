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
</div>`
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
  document.getElementById("modal_info_btn").style.display = "flex";
}
//body click modal close
document.body.addEventListener("click", function (e) {
  if (e.target.id == "modal_box") {
    modal_close();
  }
});

GetImgList();