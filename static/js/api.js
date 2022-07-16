const backend_base_url = "http://127.0.0.1:8000/"
const frontend_base_url = "http://127.0.0.1:5500/"


//회원가입
async function handleSignup(){
    const gender_check = document.querySelectorAll("input[name=gender]:checked");
    gender_check.forEach((ch) => {
        gender = ch.value
    })

    const signupData = {
        email: document.getElementById("email").value,
        username: document.getElementById("username").value,
        password:document.getElementById("password").value,
        birthday_date:document.getElementById("birthday").value,
        is_active_val:document.getElementById("is_active").value,
        gender_choice:gender,
    }

    const response = await fetch(`${backend_base_url}user/`,{
        headers:{
            Accept:'application/json',
            'Content-type':'application/json'
        },
        method:'POST',
        body:JSON.stringify(signupData)
    })
    response_json=await response.json()

    if (response.status==200) {
        window.location.replace(`${frontend_base_url}login.html`);
    }else{
        alert(response_json['username'],response_json['email'],response_json['password'], response_json['error'])
    }
}

//로그인
async function handleLogin() {
    const loginData={
        email:document.getElementById("email").value,
        password:document.getElementById("password").value        
    }

    const response=await fetch(`${backend_base_url}user/login/`, {
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method:'POST',
        body:JSON.stringify(loginData)
    })
    response_json=await response.json()

    if (response.status == 200) {
        localStorage.setItem("user_access_token", response_json.access)
        localStorage.setItem("user_refresh_token", response_json.refresh)

        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        localStorage.setItem("payload", jsonPayload)
        window.location.replace(`${frontend_base_url}`)
    } else {
        alert(response_json)
    }
}

// 내 게시물 불러오기(전체)
async function getMyArticle() {
    const response = await fetch(`${backend_base_url}article/myarticle/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    return response_json
}


async function getUserInfo() {
    const response = await fetch(`${backend_base_url}user/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    return response_json
}


//특정 id값에 해당하는 게시물 불러오기 (디테일 모달)
async function getDetailArticle(id){
    const response = await fetch(`${backend_base_url}article/${id}/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    return response_json
}


//댓글 달기
async function postComment(id, comment){
    const commentData={
        comment: comment
    }
    console.log(commentData)
    const response = await fetch(`http://127.0.0.1:8000/article/comment/${id}/`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        },
        body: JSON.stringify(commentData)
    }).then(response => response.json())
        .then(data => {
            // ResponseloadComments(data)

        })
}

async function putUserInfo(user_id) {
    const chkList = document.querySelectorAll("input[name=gender]:checked");
    gender = ''
    chkList.forEach(function (ch) {
        console.log(ch.value);
        gender = ch.value
    });

    const userData={
        phone: document.getElementById("user_profile_phone").value,
        birthday: document.getElementById("user_profile_birthday").value,
        gender: gender      
    }
    console.log(userData)
    const response = await fetch(`${backend_base_url}user/authonly/${user_id}/`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        },
        body:JSON.stringify(userData)
    })
    response_json = await response.json()
    return response_json
}

