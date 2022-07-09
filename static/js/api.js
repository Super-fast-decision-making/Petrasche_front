const backend_base_url = "http://127.0.0.1:8000/"
const frontend_base_url = "http://127.0.0.1:5500/"


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