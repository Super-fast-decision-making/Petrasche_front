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
  document.getElementById("event_img_upload").ondrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.style.border = "none";
    this.childNodes[3].style.display = "none";
    let file = e.dataTransfer.files[0];
    e.target.childNodes[5].src = URL.createObjectURL(file);
    document.getElementById("event_img").style.display = "block";
    document.getElementById("event_up_btn").style.display = "block";

    document.getElementById("event_up_btn").onclick = function () {
      let once_event = confirm(
        "이벤트는 회원별로 한번만 참여 가능합니다.\n참여하시겠습니까?"
      );
      if (once_event == true) {
        image_upload(file, id);
      } else {
        console.log("취소");
      }
    };
  };

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
      swal("기간 만료", "기간이 만료 되었거나 참여가 불가능합니다.", "error");
      return;
    } else {
      res.json().then((res) => {
        event_start(res);
      });
    }
  });
}

function event_start(data) {
  const event_date = document.getElementById("event_join");
  const event_div = document.getElementById("tournament");
  const tournament_menu = document.getElementById("tournament_info");
  const event_vote = document.getElementById("event_vote");
  const event_rank = document.getElementById("event_rank");

  event_date.innerHTML = `이벤트 기간은 ${data.event_start} ~ ${data.event_end} 입니다. 참여를 원하시면 <button onclick="event_img_uoload_open()" class="event_join_btn">이벤트 참여</button> 버튼을 눌러주세요!`;

  if (data.pet.length < 5) {

    event_div.style.display = "none";
    event_vote.innerHTML =
      "참여자가 5인 이하라 이벤트를 진행할수 없습니다. 이벤트 참여 버튼을 눌러주세요!";
    tournament_menu.style.display = "flex";
    event_rank.innerHTML = `현재 참여자는 ${data.pet.length}명 입니다.`;
    event_rank.style.alignItems = "center";
    event_rank.style.justifyContent = "center";
    event_rank.style.fontSize = "20px";
    return;
  }

  let img_lists = data.pet;
  let event_id = data.id;
  top_rank(data.rank_pet);

  event_div.style.display = "none";
  tournament_menu.style.display = "flex";

  event_vote.innerHTML = `<div class="versus">
  VS
</div>
<div id="event_left" class="event_left_img">
  <img id="event_left_img" src="https://t1.daumcdn.net/cfile/tistory/18307B4A4FD94B051A">
  <div id="left_win"><img src="/static/load_img/thank.gif" alt="" srcset=""></div>
</div>
<div id="event_right" class="event_right_img">
  <img id="event_right_img" src="http://openimage.interpark.com/goods_image_big/3/9/9/0/7658923990_l.jpg">
  <div id="right_win"><img src="/static/load_img/thank.gif" alt="" srcset=""></div>
</div>`;

  document.getElementById("event_left_img").src = img_lists[0].image;
  document.getElementById("event_right_img").src = img_lists[img_lists.length - 1].image;

  document.getElementById("event_left").onclick = function () {
    const right_img = document.getElementById("event_right_img");

    if (img_lists.length == 2) {
      event_point_up(img_lists[0].id, event_id, "left");
      return;
    } else {
      img_lists.splice(-1, 1);
      right_img.style.animation = "rightout 0.5s";
      setTimeout(function () {
        right_img.src = img_lists[img_lists.length - 1].image;
        right_img.style.animation = "";
      }, 500);
    }
  };

  document.getElementById("event_right").onclick = function () {
    const left_img = document.getElementById("event_left_img");

    if (img_lists.length == 2) {
      event_point_up(img_lists[img_lists.length - 1].id, event_id, "right");
      return;
    } else {
      img_lists.splice(0, 1);
      left_img.style.animation = "leftout 0.5s";
      setTimeout(function () {
        left_img.src = img_lists[0].image;
        left_img.style.animation = "";
      }, 500);
    }
  };
}

function top_rank(rank) {
  let rank_list = document.getElementById("event_rank");
  rank_list.innerHTML = "";
  for (let i = 0; i < rank.length; i++) {
    let html = `<div id="event_rank_img" class="event_rank_img">
    <div class="rank_num">${i + 1}위</div>
    <img src="${rank[i].image}">
    </div>`;
    rank_list.innerHTML += html;
  }
}

function event_img_uoload_open() {
  document.getElementById("event_modal").style.display = "flex";
}

function event_img_uoload_close() {
  document.getElementById("event_modal").style.display = "none";
  document.getElementById("event_img").style.display = "none";
  document.getElementById("img_drag").style.display = "block";
  document.getElementById("event_up_btn").style.display = "none";
}

function image_upload(file, id) {
  let formData = new FormData();
  formData.append("image_file", file);
  formData.append("event", id);

  fetch(backend_base_url + "tournament/", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("user_access_token"),
    },
  }).then((res) => {
    if (res.ok == false) {
      swal("업로드 실패", "업로드에 실패 하였거나 이미 참여하셨습니다.", "error");
      event_img_uoload_close();
      return;
    } else {
      res.json().then((res) => {
        swal("참여 완료", "이벤트 참여에 성공했습니다.", "success");
        tournament_start(id);
        event_img_uoload_close();
        return;
      });
    }
  });
}

function event_point_up(id, period, user) {
  if (user == "left") {
    document.getElementById("left_win").style.display = "block";
  } else {
    document.getElementById("right_win").style.display = "block";
  }
  fetch(backend_base_url + "tournament/" + id + "/", {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("user_access_token"),
    },
  }).then((res) => {
    if (res.ok == false) {
      res.json().then((res) => {
        swal("중복 참여 불가", res.message, "error");
        tournament_start(period);
      });
      return;
    } else {
      res.json().then((res) => {
        swal("투표 완료", "투표가 완료 되셨습니다.", "success");
        tournament_start(period);
        return;
      });
    }
  });
}

document.body.addEventListener("click", function (e) {
  if (e.target.id == "event_modal") {
    event_img_uoload_close();
  }
});

document.getElementById("event_img_upload").ondragover = function (e) {
  e.preventDefault();
  e.stopPropagation();
  this.style.border = "3px dashed #0099ff";
  this.childNodes[3].style.display = "none";
};

document.getElementById("event_img_upload").ondragleave = function (e) {
  e.preventDefault();
  e.stopPropagation();
  this.childNodes[3].style.display = "block";
  this.style.border = "none";
};

event_get();
