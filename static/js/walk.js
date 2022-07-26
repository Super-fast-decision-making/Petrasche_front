const backend_base_url = "http://127.0.0.1:8000/"
const frontend_base_url = "http://127.0.0.1:5500/"

const slidesContainer = document.getElementById("slides-container");
const slide = document.querySelector(".slide");
const prevButton = document.getElementById("slide-arrow-prev");
const nextButton = document.getElementById("slide-arrow-next");

nextButton.addEventListener("click", () => {
    const slideWidth = slide.clientWidth;
    slidesContainer.scrollLeft += slideWidth;
});

prevButton.addEventListener("click", () => {
    const slideWidth = slide.clientWidth;
    slidesContainer.scrollLeft -= slideWidth;
});


// Get the modal
var modal = document.getElementById("myModal");


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
function walkModalOpen() {
    modal.style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        const editor = document.getElementById("editor")
    }
}

//오늘부터 일주일 날짜구하기
let today= new Date();
const m_dropdown_region_date = []
for (let i=0;i<14;i++){
    m_dropdown_region_date.push(new Date(today.setDate(today.getDate()+1)).toLocaleDateString());
}

//시간 구하기
const m_dropdown_time_list=[]
for (let i=0;i<24;i++){
    m_dropdown_time_list.push(`${i}:00~${i+1}:00`);
}
//모달 dropdown구현
const m_dropdown_region_list = ['서울', '경기', '부산','광주','대전', '경상도', '전라도', '충청도', '강원도']

const m_dropdown_gender_list = ['남녀모두', '여자만', '남자만']
const m_dropdown_hc_list = ['2명 이하', '4명 이하', '6명 이하', '8명 이하', '9명 이상']
const m_dropdown_size_list = ['상관없음', '소형견', '중형견', '대형견']

const m_dropdown_region = document.getElementById("m_dropdown_region");
const m_dropdown_date = document.getElementById("m_dropdown_date");
const m_dropdown_time = document.getElementById("m_dropdown_time");
const m_dropdown_gender = document.getElementById("m_dropdown_gender");
const m_dropdown_hc = document.getElementById("m_dropdown_hc");
const m_dropdown_size = document.getElementById("m_dropdown_size");


m_dropdown_region_list.forEach(region => {
    m_dropdown_region.innerHTML+=`<a href="#" onclick='postRegion("${region}")'>${region}</a>`    
});
m_dropdown_region_date.forEach(date => {
    m_dropdown_date.innerHTML+=`<a href="#" onclick='postDate("${date}")'>${date}</a>`    
});
m_dropdown_time_list.forEach(time => {
    m_dropdown_time.innerHTML+=`<a href="#" onclick='postTime("${time}")'>${time}</a>`    
});
m_dropdown_gender_list.forEach(gender => {
    m_dropdown_gender.innerHTML+=`<a href="#" onclick='postGender("${gender}")'>${gender}</a>`    
});
m_dropdown_hc_list.forEach(hc => {
    m_dropdown_hc.innerHTML+=`<a href="#" onclick='postNumber("${hc}")'>${hc}</a>`    
});
m_dropdown_size_list.forEach(size => {
    m_dropdown_size.innerHTML+=`<a href="#" onclick='postSize("${size}")'>${size}</a>`    
});

function postRegion(region){
    const m_dropbtn_r = document.getElementById('m_dropbtn_r')
    m_dropbtn_r.innerText=region
}
function postDate(date){
    const m_dropbtn_d = document.getElementById('m_dropbtn_d')
    m_dropbtn_d.innerText=date
}
function postTime(time){
    const m_dropbtn_t = document.getElementById('m_dropbtn_t')
    m_dropbtn_t.innerText=time
}
function postGender(gender){
    const m_dropbtn_g = document.getElementById('m_dropbtn_g')
    m_dropbtn_g.innerText=gender
}
function postNumber(number){
    const m_dropbtn_n = document.getElementById('m_dropbtn_n')
    m_dropbtn_n.innerText=number
}

function postSize(size){
    const m_dropbtn_s = document.getElementById('m_dropbtn_s')
    m_dropbtn_s.innerText=size
}



//neighbor 페이지 드롭다운 구현
const dropdown_gender = document.getElementById("dropdown_gender")
const dropdown_size = document.getElementById("dropdown_size")
const dropdown_region = document.getElementById("dropdown_region")
const dropdown_number = document.getElementById("dropdown_number")

m_dropdown_gender_list.forEach(gender => {
    dropdown_gender.innerHTML+=`<a href="#" onclick='searchGender("${gender}")'>${gender}</a>`    
})
m_dropdown_size_list.forEach(size => {
    dropdown_size.innerHTML+=`<a href="#" onclick='searchSize("${size}")'>${size}</a>`    
})
m_dropdown_region_list.forEach(region => {
    dropdown_region.innerHTML+=`<a href="#" onclick='searchRegion("${region}")'>${region}</a>`    
})
m_dropdown_hc_list.forEach(number => {
    dropdown_number.innerHTML+=`<a href="#" onclick='searchNumber("${number}")'>${number}</a>`    
})



//////////////////////////////////////api
// 산책 페이지 전체 아티클 불러오기
async function getWalkArticle() {
    const response = await fetch(`${backend_base_url}walk/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    // console.log(response_json)
    return response_json
}


async function loadWalkArticle(){
    const res = await getWalkArticle()
    customers = document.getElementById('customers')
    res.forEach(post => {
        console.log(res)
        customers.innerHTML+=
            `<tr onclick='openWalkDetailArticle(${post.id})'>
                <td>${post.start_time.split(' ')[1]}~${post.end_time.split(' ')[1]}</td>
                <td>${post.place}</td>
                <td>${post.people_num}</td>
                <td>산책가기</td>
            </tr>`
    }); 
}
loadWalkArticle()


function searchGender(gender_name){
    dropbtn_g= document.getElementById("dropbtn_g")
    dropbtn_g.innerText=gender_name
}
function searchSize(size_name){

    dropbtn_s= document.getElementById("dropbtn_s")
    dropbtn_s.innerText=size_name
}

function searchRegion(region_name){
    dropbtn_r= document.getElementById("dropbtn_r")
    dropbtn_r.innerText=region_name
}

function searchNumber(number_name){
    dropbtn_n= document.getElementById("dropbtn_n")
    dropbtn_n.innerText=number_name
}

console.log(editor.value)
async function submitWalkArticle(){
    const walkData = {
        place: document.getElementById('m_input_p').value,
        region: document.getElementById('m_dropbtn_r').innerText,
        date: document.getElementById('m_dropbtn_d').innerText,
        // start_time: document.getElementById('m_dropbtn_t').innerText.split('~')[0],
        time: document.getElementById('m_dropbtn_t').innerText,
        gender: document.getElementById('m_dropbtn_g').innerText,
        people_num: document.getElementById('m_dropbtn_n').innerText,
        size: document.getElementById('m_dropbtn_s').innerText,
        contents: theEditor.getData(),
    }
    if (document.getElementById('m_dropbtn_d').innerText=="날짜"){
        alert("날짜를 정해주세요")
    }else if (document.getElementById('m_dropbtn_r').innerText=="지역"){
        alert("지역을 정해주세요")
    }else if (document.getElementById('m_dropbtn_t').innerText=="시간"){
        alert("시간을 정해주세요")
    }else if (document.getElementById('m_dropbtn_g').innerText=="성별"){
        alert("성별을 정해주세요")
    }else if (document.getElementById('m_dropbtn_n').innerText=="인원수"){
        alert("인원수를 정해주세요")
    }else if (document.getElementById('m_dropbtn_s').innerText=="강아지크기"){
        alert("강아지 크기를 정해주세요")
    }
    console.log(walkData)
    const response = await fetch(`${backend_base_url}walk/`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        },
        body: JSON.stringify(walkData)
    })
    response_json = await response.json()
    if (response.status == 200) {
        alert("게시글이 업로드 되었습니다")
        window.location.reload()
    } else {
        alert("잘못된 게시글입니다")
    }
}


//디테일 페이지 들어가는 함수
async function openWalkDetailArticle(id){
    window.location.replace(`${frontend_base_url}walk-detail.html`);
    await loadWalkDetailArticle(id)
    // const response = await fetch(`${backend_base_url}walk/${id}/`, {
    //     method: 'GET',
    //     headers: {
    //         Accept: 'application/json',
    //         'Content-type': 'application/json',
    //         'Authorization': "Bearer " + localStorage.getItem("user_access_token")
    //     }
    // })
    // response_json = await response.json()
    // console.log(response_json)
    // return response_json
}

