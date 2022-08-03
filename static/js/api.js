

// 회원가입
async function handleSignup() {
    const gender_check = document.querySelectorAll("input[name=gender]:checked");

    const day = document.getElementById("day").value.split("일")[0]
    const month = document.getElementById("month").value.split("월")[0]
    const year = document.getElementById("year").value.split("년")[0]
    console.log(year + "-" + month + "-" + day)

    const birthday = year + "-" + month + "-" + day
    if (birthday == "") {
        alert("생년월일을 입력해 주세요!")
        return
    }
    if (gender_check.length <= 0) {
        alert("성별을 선택해 주세요!")
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
        window.location.replace(`${frontend_base_url}login.html`);
    } else {
        if (response_json.email) {
            alert("중복된 이메일 입니다.")
            window.location.replace(`${frontend_base_url}signup.html`);
        }
        else if (response_json.username) {
            alert("중복된 닉네임 입니다.")
            window.location.replace(`${frontend_base_url}signup.html`);
        }
        else {
            alert("오류가 발생했습니다.")
            window.location.replace(`${frontend_base_url}signup.html`);
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
        alert("아이디 또는 비밀번호가 일치하지 않습니다.")
    }
}

// 내 게시물 불러오기(전체)
async function getMyArticle(page_num) {
    const response = await fetch(`${backend_base_url}article/myarticle/?p=${page_num}`, {
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


// 특정 id값에 해당하는 게시물 불러오기 (디테일 모달)
async function getDetailArticle(id) {
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


// 댓글 달기
async function postComment(id, comment) {
    const commentData = {
        comment: comment
    }
    console.log(commentData)
    const response = await fetch(`${backend_base_url}article/comment/${id}/`, {
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

    const userData = {
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
        body: JSON.stringify(userData)
    })
    response_json = await response.json()
    return response_json
}

// 반려동물 등록
async function postPetProfile(file, name, birthday, gender, size) {
    let formData = new FormData();
    formData.append('name', name)
    formData.append('birthday', birthday)
    formData.append('gender', gender)
    formData.append('size', size)
    for (let i = 0; i < file.length; i++) {
        formData.append('image_file', file[i])
    }
    const response = await fetch(`${backend_base_url}user/mypet/`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            // 'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        },
        body: formData
    })
    response_json = await response.json()
    return response_json
}

// 반려동물 정보 수정
async function putPetInfo(pet_id, name, birthday, type, gender, size) {
    const petProfileData = {
        name: name,
        birthday: birthday,
        type: type,
        gender: gender,
        size: size
        // pet_profile_img: pet_profile_img
    }
    const response = await fetch(`${backend_base_url}user/mypet/${pet_id}/`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        },
        body: JSON.stringify(petProfileData)
    })
    response_json = await response.json()
    return response_json
}

//코멘트 삭제
function CommentDelete(id, article_id) {
    let confirm_delete = confirm("삭제하시겠습니까?");
    if (confirm_delete) {
        fetch(`${backend_base_url}article/comment/${id}/`, {
            method: "DELETE",
            headers: {
                Accept: 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("user_access_token"),
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((res) => {
                alert("삭제 완료");
                openDetailModal(article_id);
            });
    } else {
        return;
    }
};
//코멘트 수정
function CommentEdit(id, article_id) {
    console.log(id)
    console.log(article_id)
    document.getElementById("modal_edit_box").style.display = "flex";
    let node = event.target.parentNode;
    let comment_value = node.parentNode.childNodes[1].childNodes[1].innerText;
    document.getElementById("modal_edit_text").value = comment_value.replace(
        /<br>/g,
        "\n"
    );
    document.getElementById("modal_edit_button").onclick = () => {
        let comment = document.getElementById("modal_edit_text").value;
        comment = comment.replace(/\n/g, "<br>");
        if (comment == "") {
            alert("내용을 입력해주세요");
            return;
        }
        let confirm_edit = confirm("수정하시겠습니까?");
        if (confirm_edit) {
            const data = {
                comment: comment,
            };
            fetch(`${backend_base_url}article/comment/${id}/`, {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("user_access_token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then((res) => res.json())
                .then((res) => {
                    alert("수정 완료");
                    document.getElementById("modal_edit_box").style.display = "none";
                    openDetailModal(article_id);
                });
        } else {
            return;
        }
    };
}


//팔로우 +언팔로우

function Follow(author, article_id) {
    const data = {
        username: author,
    };
    fetch(`${backend_base_url}user/follow/`, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("user_access_token"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((res) => {
            alert(res.message)
            openDetailModal(article_id);
        });
};

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

//아티클 삭제
function articleDelete(id) {
    let confirm_delete = confirm("삭제하시겠습니까?");
    if (confirm_delete) {
        fetch(`${backend_base_url}article/myarticle/${id}/`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("user_access_token"),
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((res) => {
                alert("삭제 완료");
                window.location.reload();
            });
    } else {
        return;
    }
}

//아티클 수정
function articleEdit(id) {
    document.getElementById("modal_edit_box").style.display = "flex";
    document.getElementById("modal_edit_button").onclick = () => {
        let content = document.getElementById("modal_edit_text").value;
        content = content.replace(/\n/g, "<br>");
        if (content == "") {
            alert("내용을 입력해주세요");
            return;
        }
        let confirm_edit = confirm("수정하시겠습니까?");
        if (confirm_edit) {
            const data = {
                content: content,
            };
            console.log(content)
            fetch(`${backend_base_url}article/myarticle/${id}/`, {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("user_access_token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then((res) => res.json())
                .then((res) => {
                    alert("수정 완료");
                    document.getElementById("modal_edit_box").style.display = "none";
                    openDetailModal(id);
                });
        } else {
            return;
        }
    };

}

//아이디별 반려동물 불러오기
async function getPetArticle(id) {
    const response = await fetch(`${backend_base_url}user/mypet/${id}`, {
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

// 반려동물 프로필 삭제
async function deletePetProfile(pet_id) {
    const response = await fetch(`${backend_base_url}user/mypet/${pet_id}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    if (response.status == 200) {
        alert(response_json.massege)
        window.location.reload()
    } else {
        alert(response_json.massege)
    }
}
//좋아요
const LikeOn = (id) => {
    fetch(`${backend_base_url}article/like/${id}/`, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("user_access_token"),
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((res) => {
            document.getElementById("heart_ani").style.display = "block";
            setTimeout(() => {
                document.getElementById("heart_ani").style.display = "none";
            }, 500);
            openDetailModal(id);
        });
};

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