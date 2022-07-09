const backend_base_url = "http://127.0.0.1:8000/"
const frontend_base_url = "http://127.0.0.1:5500/petrasche_f/"
// const frontend_base_url = "http://127.0.0.1:5500/"


//회원가입
async function handleSignup(){
    const signupData = {
        email: document.getElementById("email").value,
        username: document.getElementById("username").value,
        password:document.getElementById("password").value
    }
    console.log(signupData)
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
        alert(response.status)
    }
}

//로그인
async function handleLogin() {
    const loginData={
        email:document.getElementById("email").value,
        password:document.getElementById("password").value        
    }
    console.log(loginData)
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
        alert(response.status)
    }
}