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

//팔로우 +언팔로우

// function Follow(author, article_id) {
//     const data = {
//         username: author,
//     };
//     fetch(`${backend_base_url}user/follow/`, {
//         method: "POST",
//         headers: {
//             Authorization: "Bearer " + localStorage.getItem("user_access_token"),
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//     })
//         .then((res) => res.json())
//         .then((res) => {
//             alert(res.message)
//             openDetailModal(article_id);
//         });
// };


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