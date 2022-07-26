let img_lists = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
]

function tournament_start(id, active) {
  const event_div = document.getElementById("tournament");
  const tournament_menu = document.getElementById("tournament_info");
  if (active == false) {
    alert("이벤트 기간이 종료 되었습니다!");
  } else {
    event_div.style.display = "none";
    tournament_menu.style.display = "flex";
  }
}

function event_page_read(id){
   console.log(id);
}

document.getElementById("event_left_img").onclick = function () {
    // let img_list = JSON.parse(sessionStorage.getItem("img_list"));
    console.log(img_lists);
    let random = Math.floor(Math.random() * img_lists.length);
    img_lists.splice(random, 1);
    // sessionStorage.setItem("img_list", JSON.stringify(img_list));
    console.log(img_lists);
  let img = this.childNodes[1];
  let div = this;
  div.style.animation = "leftout 0.5s";
  setTimeout(function () {
    img.src =
      "https://cdn.wadiz.kr/ft/images/green001/2021/1119/20211119210738669_76.gif";
    div.style.animation = "";
  }, 500);
};

document.getElementById("event_right_img").onclick = function () {
  let img_list = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
  ]

  let img = this.childNodes[1];
  let div = this;
  // sessionStorage list set
    sessionStorage.setItem("img_list", JSON.stringify(img_list));
  div.style.animation = "rightout 0.5s";
  setTimeout(function () {
    img.src =
      "https://cdn.wadiz.kr/ft/images/green001/2021/1119/20211119210738669_76.gif";
    div.style.animation = "";
  }, 500);
};
