function tournament_start(id, active) {
  const event_div = document.getElementById("tournament");
  const tournament_menu = document.getElementById("tournament_info");
  if (active == false) {
    alert("이벤트 기간이 종료 되었습니다!");
    return;
  } else {
    event_div.style.display = "none";
    tournament_menu.style.display = "flex";
  }
}

function event_start(id, active) {
  const event_div = document.getElementById("tournament");
  const tournament_menu = document.getElementById("tournament_info");

  let img_lists = [
    "https://blog.kakaocdn.net/dn/WTD2V/btrzifPHTmf/MHtFXGZ4bymk8pPzm15qv1/img.png",
    "https://blog.kakaocdn.net/dn/bpGVsT/btritMc5uNF/OtLdZpEpzZTaPhVXpQ1p11/img.webp",
    "https://t1.daumcdn.net/cfile/tistory/2446CD5053741A9F18",
    "https://blog.kakaocdn.net/dn/bDvLtp/btrzdOekBQ1/97wPAt3knfNKwTMiZvqkpk/img.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ66BdtAujxZGe9JQo_MbuGd6V8vNGVSS3DBw&usqp=CAU",
    "https://t1.daumcdn.net/cfile/tistory/243E4337529C3DDA18",
    "https://t1.daumcdn.net/cfile/tistory/2509CF3359673E7F21",
    "https://t1.daumcdn.net/cfile/tistory/011E535051D5249029",
    "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbtkmMZ%2FbtrAc5MZeZT%2FBYPTD6qy8wgkpGdIGpRwGk%2Fimg.jpg",
    "https://blog.kakaocdn.net/dn/b3b2Y9/btrz0tIoVAd/f0X0s5Ub8N0zDHRqGEVxo1/img.jpg",
  ]

  if (active == false) {
    alert("이벤트 기간이 종료 되었습니다!");
    return;
  } else {
    event_div.style.display = "none";
    tournament_menu.style.display = "flex";
  }

  document.getElementById("event_left_img").onclick = function () {
    let random = Math.floor(Math.random() * img_lists.length);
    if (img_lists.length == 1) {
      alert(img_lists[0] + "번째 사진이 남았습니다!");
      return;
    } else {
      let image_file = img_lists.splice(random, 1);
      let img = this.childNodes[1];
      let div = this;
      div.style.animation = "leftout 0.5s";
      setTimeout(function () {
        img.src =
          image_file;
        div.style.animation = "";
      }, 500);
    }
  };

  document.getElementById("event_right_img").onclick = function () {
    let random = Math.floor(Math.random() * img_lists.length);
    if (img_lists.length == 1) {
      alert(img_lists[0] + "번째 사진이 남았습니다!");
      return;
    } else {
      let image_file = img_lists.splice(random, 1);
      let img = this.childNodes[1];
      let div = this;
      div.style.animation = "rightout 0.5s";
      setTimeout(function () {
        img.src =
          image_file;
        div.style.animation = "";
      }, 500);
    }
  };
}

