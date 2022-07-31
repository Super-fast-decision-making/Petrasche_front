const backend_base_url = "http://127.0.0.1:8000/"
// const backend_base_url = "http://3.34.181.243/"
const frontend_base_url = "http://127.0.0.1:5500/"

const DM = () => {
    window.location.href = "/dm.html";
}
const home = () => {
    window.location.href = "/index.html";
}
const UserPage = () => {
    window.location.href = "/mypage.html";
}
const Logout = () => {
    localStorage.removeItem("user_access_token");
    localStorage.removeItem("user_refresh_token");
    localStorage.removeItem("payload");
    window.location.href = "./login.html";
};

function petevent() {
    window.location.href = "/tournament.html";
}

function alarm(id) {
    id.childNodes[3].innerHTML = "";
    fetch(`${backend_base_url}user/history/`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("user_access_token"),
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.length == 0) {
                id.childNodes[3].innerHTML = "알림이 없습니다.";
            } else {
                res.forEach((history) => {
                    if (history.type == "like") {
                        id.childNodes[3].innerHTML += `<div>${history.user}님이 게시물을 <span style="color: red">좋아요</span> 했습니다. ${history.time}</div>`;
                    }
                    if (history.type == "follow") {
                        id.childNodes[3].innerHTML += `<div>${history.user}님이 <span style="color: blue">팔로우</span> 했습니다. ${history.time}</div>`;
                    }
                    if (history.type == "comment") {
                        id.childNodes[3].innerHTML += `<div>${history.user}님이 게시물에 <span style="color: green">댓글</span>을 남겼습니다. ${history.time}</div>`;
                    }
                });
            }
        });

    id.childNodes[3].style.display = "block";
    let alarm = true;
    id.onclick = () => {
        if (alarm) {
            id.childNodes[3].style.display = "none";
            alarm = false;
        } else {
            id.childNodes[3].style.display = "block";
            alarm = true;
        }
    };
}