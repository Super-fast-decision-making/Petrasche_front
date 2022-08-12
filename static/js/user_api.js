// 회원가입 
async function handleSignup() {
    const gender_check = document.querySelectorAll("input[name=gender]:checked");

    const day = document.getElementById("day").value.split("일")[0]
    const month = document.getElementById("month").value.split("월")[0]
    const year = document.getElementById("year").value.split("년")[0]


    const birthday = year + "-" + month + "-" + day
    if (birthday == "") {
        swal("입력 오류", "생년월일을 입력해 주세요.", "error");
        return
    }
    if (gender_check.length <= 0) {
        swal("입력 오류", "성별을 입력해 주세요.", "error");
        return
    }
    gender_check.forEach((ch) => {
        gender = ch.value
    })
    const signupData = {
        email: document.getElementById("email").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        birthday_date: birthday,
        is_active_val: document.getElementById("is_active").value,
        gender_choice: gender,
    }
    const response = await fetch(`${backend_base_url}user/`, {
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(signupData)
    })
    response_json = await response.json()
    if (response.status == 200) {
        window.location.replace('/login.html');
    } else {
        if (response_json.email) {
            swal("가입 오류", "중복된 이메일 입니다.", "error");
            window.location.replace('/signup.html');
        }
        else if (response_json.username) {
            swal("가입 오류", "중복된 닉네임 입니다.", "error");
            window.location.replace('/signup.html');
        }
        else {
            swal("가입 오류", "서버 오류가 발생 되었습니다.", "error");
            window.location.replace('/signup.html');
        }
    }
}


// 로그인
async function handleLogin() {
    const loginData = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    }
    const response = await fetch(`${backend_base_url}user/login/`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(loginData)
    })
    response_json = await response.json()
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
        swal("로그인 오류", "아이디 또는 비밀번호가 일치 하지 않습니다.", "error");
    }
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
    sessionStorage.setItem('id', response_json.id)
    sessionStorage.setItem('username', response_json.username)
    return response_json
}
getUserInfo()
// async function loadUserinfo() {
//     const response_json = await getUserInfo()
//     sessionStorage.setItem('id', response_json.id)
//     sessionStorage.setItem('username', response_json.username)
// }

async function putUserInfo(user_id) {
    const chkList = document.querySelectorAll("input[name=gender]:checked");
    gender = ''
    chkList.forEach(function (ch) {

        gender = ch.value
    });

    const userData = {
        phone: document.getElementById("user_profile_phone").value,
        birthday: document.getElementById("user_profile_birthday").value,
        gender: gender
    }

    const response = await fetch(`${backend_base_url}user/authonly/${user_id}/`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        },
        body: JSON.stringify(userData)
    })
    response_json = await response.json()
    return response_json
}


async function postAuthPassword() {
    const input_password = document.getElementById("update_pw_input").value
    const passwordData = {
        password: input_password,
    }
    const response = await fetch(`${backend_base_url}user/auth/`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        },
        body: JSON.stringify(passwordData)
    })
    response_json = await response.json()

    if (response.status == 200) {
        alert(response_json.massege)
        showUpdatePassword(response_json.response)
    } else {
        alert(response_json.massege)
    }
}

async function putPassword(user_id, new_password) {
    const passwordData = {
        password: new_password,
    }
    const response = await fetch(`${backend_base_url}user/authonly/${user_id}/`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        },
        body: JSON.stringify(passwordData)
    })
    response_json = await response.json()

    if (response.status == 200) {
        alert(response_json.massege)
        window.location.reload()
    } else {
        alert(response_json.massege)
    }
}


// 프로필 이미지 변경
async function putProfileImg(who, _id, file) {

    let formData = new FormData();
    for (let i = 0; i < file.length; i++) {
        formData.append('image_file', file[i])
    }
    if (who == 'user') {
        let response = await fetch(`${backend_base_url}user/authonly/${_id}/`, {
            method: 'PUT',
            body: formData,
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("user_access_token")
            },
        })
        response_json = await response.json()
        if (response.status == 200) {
            alert(response_json.massege)
            window.location.reload()
        } else {
            alert(response_json.massege)
        }
    } else {
        let response = await fetch(`${backend_base_url}user/mypet/${_id}/`, {
            method: 'PUT',
            body: formData,
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("user_access_token")
            },
        })
        response_json = await response.json()
        if (response.status == 200) {
            alert(response_json.massege)
            window.location.reload()
        } else {
            alert(response_json.massege)
        }
    }
}


// 프로필 소개글 변경
async function putIntroduction(who, _id, introduction) {

    const introductionData = {
        introduction: introduction
    }

    if (who == 'user') {

        let response = await fetch(`${backend_base_url}user/authonly/${_id}/`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
                'Authorization': "Bearer " + localStorage.getItem("user_access_token")
            },
            body: JSON.stringify(introductionData),
        })
        response_json = await response.json()
        if (response.status == 200) {
            alert(response_json.massege)
            window.location.reload()
        } else {
            alert(response_json.massege)
        }
    } else {

        let response = await fetch(`${backend_base_url}user/mypet/${_id}/`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
                'Authorization': "Bearer " + localStorage.getItem("user_access_token")
            },
            body: JSON.stringify(introductionData),
        })
        response_json = await response.json()
        if (response.status == 200) {
            alert(response_json.massege)
            window.location.reload()
        } else {
            alert(response_json.massege)
        }
    }
}