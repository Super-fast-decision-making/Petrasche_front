function event_get() {
  const event = document.getElementById("event");
  event.innerHTML = "";
  let url = backend_base_url + "tournament/period/";
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("user_access_token"),
    },
  })
    .then((res) => res.json())
    .then((res) => {
      res.forEach((element) => {
        console.log(element.active);
        if (element.active == "Before") {
          active_html = `<div style="background-color:skyblue;" class="event_active">진행전</div>`;
        } else if (element.active == "Participation") {
          active_html = `<div style="background-color:red;" class="event_active">참여하기</div>`;
        } else {
          active_html = `<div class="event_active">만료</div>`;
        }
        let html = `<div onclick='tournament_start(${element.id});' class="event_list">
      <div class="event_title">
          ${element.event_name}
          <div style="font-size:15px; color: blue;">
              <i class="fa-solid fa-circle-info"></i> ${element.event_desc}
          </div>
      </div>
      <div class="event_time">기간 ${element.event_start} ~ ${element.event_end}</div>
      ${active_html}
      </div>`;

        event.innerHTML += html;
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function tournament_start(id) {
  const event_div = document.getElementById("tournament");
  const tournament_menu = document.getElementById("tournament_info");
  fetch(backend_base_url + "tournament/period/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("user_access_token"),
    },
  }).then((res) => {
    if (res.ok == false) {
      alert("기간이 만료 되었거나 참여가 불가능합니다.");
      return
    } else {
      res.json().then((res) => {
        event_start(res);
      });
    }
  });
}

function event_start(data) {
  const event_div = document.getElementById("tournament");
  const tournament_menu = document.getElementById("tournament_info");

  let img_lists = data.pet;
  top_rank(data.rank_pet); 

  event_div.style.display = "none";
  tournament_menu.style.display = "flex";

  // random_img(img_lists);

  document.getElementById("event_left_img").src = img_lists[0].image;
  document.getElementById("event_right_img").src = img_lists[1].image;

  // document.getElementById("event_left_img").onclick = function () {
  //   let random = Math.floor(Math.random() * img_lists.length);
  //   if (img_lists.length == 1) {
  //     alert(img_lists[0].image + "번째 사진이 남았습니다!");
  //     return;
  //   } else {
  //     let image_file = img_lists.splice(random, 1);
  //     let img = this.childNodes[1];
  //     let div = this;
  //     div.style.animation = "leftout 0.5s";
  //     setTimeout(function () {
  //       img.src = image_file[0].image;
  //       div.style.animation = "";
  //     }, 500);
  //   }
  // };

  // document.getElementById("event_right_img").onclick = function () {
  //   let random = Math.floor(Math.random() * img_lists.length);
  //   if (img_lists.length == 1) {
  //     alert(img_lists[0].image + "번째 사진이 남았습니다!");
  //     return;
  //   } else {
  //     let image_file = img_lists.splice(random, 1);
  //     let img = this.childNodes[1];
  //     let div = this;
  //     div.style.animation = "rightout 0.5s";
  //     setTimeout(function () {
  //       img.src = image_file.image;
  //       div.style.animation = "";
  //     }, 500);
  //   }
  // };
}
function random_img(img_lists) {
  let random = Math.floor(Math.random() * img_lists.length);
  img_lists.splice(random, 1);
  console.log(img_lists);
}

function top_rank(rank) {
  let rank_list = document.getElementById("event_rank");
  console.log(rank);
  rank_list.innerHTML = "";
  for (let i = 0; i < rank.length; i++) {
    let html = `<div id="event_rank_img" class="event_rank_img">
    <div class="rank_num">${i+1}위</div>
    <img src="${rank[i].image}">
    </div>`
    rank_list.innerHTML += html;
  }
}

function event_img_uoload_open() {
  document.getElementById("event_modal").style.display = "flex";
}

document.getElementById("event_img_upload").ondragover = function (e) {
  e.preventDefault();
  e.stopPropagation();
  this.style.border = "3px dashed #0099ff";
  this.childNodes[3].style.display = "none";
};

document.getElementById("event_img_upload").ondragleave = function (e) {
  e.preventDefault();
  e.stopPropagation();
  this.style.border = "none";
};

document.getElementById("event_img_upload").ondrop = function (e) {
  e.preventDefault();
  e.stopPropagation();
  this.style.border = "none";
  this.childNodes[3].style.display = "none";
  let file = e.dataTransfer.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (e) {
    document.getElementById("event_img").src = e.target.result;
  };
  document.getElementById("event_img").style.display = "block";
  document.getElementById("event_up_btn").style.display = "block";

  document.getElementById("event_up_btn").onclick = function () {
    let once_event = confirm(
      "이벤트는 회원별로 한번만 참여 가능합니다.\n참여하시겠습니까?"
    );
    if (once_event == true) {
      console.log("참여");
    } else {
      console.log("취소");
    }
  };
};

event_get();
