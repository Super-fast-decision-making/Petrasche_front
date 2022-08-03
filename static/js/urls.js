// const backend_base_url = "http://127.0.0.1:8000/"
const backend_base_url = "http://3.39.219.239/"
const frontend_base_url = "http://127.0.0.1:5500/"

async function profile (user_id){
    sessionStorage.setItem('profile_page_id', user_id)
    payload = localStorage.getItem("payload")
    if (user_id==JSON.parse(payload).user_id){
        UserPage()
    }else{
        window.location.href = "/personal.html"
    }  
}


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

function walk() {
    window.location.href = "/walk.html"
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


// 로그인 했을때만 해당 유저 인포 가져온다
const GetUserInfo = () => {
    // payload = localStorage.getItem("payload")
    // console.log(JSON.parse(payload))
    if (localStorage.getItem("payload")!=null){
        fetch(`${backend_base_url}user/`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("user_access_token"),
            },
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.username == null) {

            } else {
                document.getElementById("user").innerHTML = res.username;
                console.log(res.profile_img)
                document.getElementById('user_img').src=res.profile_img
            }
        });
        
    
    } 
    else{
        console.log("***")
        let user_profile = document.getElementById('user_profile')
        user_profile.style.display='none';
        document.getElementById('loginout').innerHTML='로그인';
    }
};
GetUserInfo()

