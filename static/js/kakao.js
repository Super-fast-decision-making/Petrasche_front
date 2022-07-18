// const backend_base_url = "http://127.0.0.1:8000/"
// const frontend_base_url = "http://127.0.0.1:5500/"


Kakao.init("b1ae05cf3f44682ccf7ffba8606235b3")
function kakaoLogin() {
    window.Kakao.Auth.login({
        scope: 'profile_nickname, account_email, gender',
        success: function (authoObj) {
            window.Kakao.API.request({
                url: '/v2/user/me',
                success: res => {
                    const kakao_account = res.kakao_account;
                    const signupData = {
                        email: kakao_account.email,
                        username: kakao_account.profile.nickname
                    }
                    handleKakaoSignup(authoObj, signupData)
                }
            });
        },
        fail: function (error) {
            console.log(error);
        }
    });
}

function handleKakaoSignup(authoObj, signupData) {
    const kakaoSignupData = Object.assign({}, authoObj, signupData);
    const response = fetch(`${backend_base_url}user/kakao/`, {
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(kakaoSignupData)
    })
        .then((res) => {
            console.log(res.status)
            console.log(res.error)
            if (res.status === 200) {
                res.json().then((res) => {
                    localStorage.setItem("user_access_token", res.access);
                    localStorage.setItem("user_refresh_token", res.refresh);
                    // window.location.replace("http://127.0.0.1:5500/index.html");
                    const base64Url = res.access.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    localStorage.setItem("payload", jsonPayload)
                    window.location.replace(`${frontend_base_url}index.html`)
                })
            } else if (res.status === 201) {
                alert("회원가입에 성공하셨습니다. 로그인을 해주세요.");
                window.location.replace(`${frontend_base_url}login.html`);
            } else if (res.status === 400) {
                res.json().then((res) => {
                    alert(res.error)
                    window.location.replace(`${frontend_base_url}signup.html`);
                })

            }
        })
}
