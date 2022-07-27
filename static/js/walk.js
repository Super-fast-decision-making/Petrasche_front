const backend_base_url = "http://127.0.0.1:8000/"
const frontend_base_url = "http://127.0.0.1:5500/"



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

function goBack() {
    const detail_r_sec=document.getElementById("detail_r_sec")
    const r_sec=document.getElementById("r_sec")
    detail_r_sec.style.display="none"
    r_sec.style.display="flex"
}
//오늘부터 이주일 날짜구하기
let today= new Date();
console.log(today.getDate())
const m_dropdown_region_date = []
for (let i=0;i<14;i++){
    m_dropdown_region_date.push(new Date(today.setDate(today.getDate()+1)).toLocaleDateString());
    
}
//시간 구하기
const m_dropdown_time_list=[]
for (let i=0;i<24;i++){
    m_dropdown_time_list.push(`${i}:00~${i+1}:00`);
    
}

//가로 슬라이더
const slidesContainer = document.getElementById("slides-container");
for (let i=0;i<14;i++){
    let date = m_dropdown_region_date[i].split('2. ')[1].replace(/ /g, '')
    let search_date = '2022.'+date
    slidesContainer.innerHTML+=`<li class="slide" onclick='searchStart(0,"${search_date}")'>${date}</li>`
}


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
    dropdown_gender.innerHTML+=`<a href="#" onclick='searchStart(1,"${gender}")'>${gender}</a>`    
})
m_dropdown_size_list.forEach(size => {
    dropdown_size.innerHTML+=`<a href="#" onclick='searchStart(2,"${size}")'>${size}</a>`    
})
m_dropdown_region_list.forEach(region => {
    dropdown_region.innerHTML+=`<a href="#" onclick='searchStart(3,"${region}")'>${region}</a>`    
})
m_dropdown_hc_list.forEach(number => {
    dropdown_number.innerHTML+=`<a href="#" onclick='searchStart(4,"${number}")'>${number}</a>`    
})



//////////////////////////////////////api
// 산책 페이지 전체 아티클 불러오기
async function getWalkArticle(gender, size, region, number) {

    let url= `${backend_base_url}walk/?`
    if (gender!='gender'){
        url = url+`gender=${gender}&`
    }
    if (size!='size'){
        url = url+`size=${size}&`
    }
    if (region!='region'){
        url = url+`region=${region}&`
    }
    if (number!='number'){
        url = url+`number=${number}&`
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    console.log(response_json)
    return response_json
}


async function loadWalkArticle(gender,size, region, number){
    console.log(gender,size, region, number)
    const res = await getWalkArticle(gender,size, region, number)
    customers = document.getElementById('customers')
    res.forEach(post => {
        let masTime = post.start_time
        // console.log(masTime)
        let masTimeMonth= masTime.split('.')[1];
        let masTimeDate=masTime.split('.')[2].split(' ')[0];
        let masTimeTime =masTime.split(' ')[1].split(':')[0];
        // console.log(masTimeMonth, masTimeDate, masTimeTime)
        let today = new Date()
        let month = ('0' + (today.getMonth() + 1)).slice(-2);
        let day = ('0' + today.getDate()).slice(-2);
        var hours = ('0' + today.getHours()).slice(-2); 
        // console.log(month, day, hours);

        // 결과 : 2021-05-30
        customers.innerHTML+=
            `<tr id='post_row${post.id}' onclick='openWalkDetailArticle(${post.id})'>
                <td>${post.start_time.split(' ')[1].substring(0,5)}~${post.end_time.split(' ')[1].substring(0,5)}</td>
                <td>${post.place}<br><span style='font-size:0.6rem'>&#127822; ${post.region} , ${post.gender}, ${post.size}</span></td>
                <td>${post.people_num}</td>
                <td id='gowalkbutton${post.id}'>산책가기</td>
            </tr>`

        if (masTimeDate<day & masTimeTime<hours){
            document.getElementById('gowalkbutton'+post.id).innerText= '마감'
            document.getElementById('post_row'+post.id).style.backgroundColor = 'gray'
            document.getElementById('post_row'+post.id).setAttribute('onclick', '')

        }
    }); 
}
loadWalkArticle('gender', 'size', 'region', 'number')

function searchStart(filter_num, click_name){

    let dropbtn_g= document.getElementById("dropbtn_g")
    let dropbtn_s= document.getElementById("dropbtn_s")
    let dropbtn_r= document.getElementById("dropbtn_r")
    let dropbtn_n= document.getElementById("dropbtn_n")
    
    // if (filter_num ==0){
    //     console.log(click_name)
    //     const start_date=click_name
    // }
    if (filter_num==1){        
        dropbtn_g.innerText=click_name        
    }
    if(filter_num==2){       
        dropbtn_s.innerText=click_name
    }
    if(filter_num==3){        
        dropbtn_r.innerText=click_name
    }
    if(filter_num==4){        
        dropbtn_n.innerText=click_name
    }
    // console.log(start_date)
    const gender= dropbtn_g.innerText
    const size=dropbtn_s.innerText
    const region=dropbtn_r.innerText
    const number=dropbtn_n.innerText

    customers.innerHTML=""
    loadWalkArticle(gender, size, region, number)
}

async function goWalk(id, attending_user){
    console.log(id, attending_user)
    const updataWalkData = {
        attending_user:attending_user
    }
    const response = await fetch(`${backend_base_url}walk/attend/${id}/`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        },
        body: JSON.stringify(updataWalkData)
    })
    response_json = await response.json()
    if (response.status == 200) {
        alert("산책에 참여해주셔서 감사합니다")
        attend_walk.style.backgroundColor='#ADD8E6'
        attend_walk.innerText='모임에 참여 신청 하셨습니다'
    } else {
        alert("잘못된 결과입니다")
    }
}
async function goHome(id, attending_user){
    const response = await fetch(`${backend_base_url}walk/attend/${id}/`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        },
        // body: JSON.stringify(updataWalkData)
    })
    response_json = await response.json()
    if (response.status == 200) {
        alert("산책을 취소하셨습니다")
        attend_walk.style.backgroundColor='pink'
        attend_walk.innerText='모임 참여를 취소하셨습니다'
    } else {
        alert("잘못된 결과입니다")

}
}
async function submitWalkArticle(){
    s_date = document.getElementById('m_dropbtn_d').innerText
    s_list = s_date.replace(/ /g, '').split(".")
    const walkData = {
        place: document.getElementById('m_input_p').value,
        region: document.getElementById('m_dropbtn_r').innerText,
        start_date: s_list[0]+'-'+s_list[1]+'-'+s_list[2],
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

function diffDay() {
    //타이머
    the_date = sessionStorage.getItem('meeting_date')
    const timer = document.getElementById("timer")
    const masTime = new Date(the_date);
    const todayTime = new Date();
    const diff = masTime -todayTime;
    const diffDay = Math.floor(diff / (1000*60*60*24));
    const diffHour = Math.floor((diff / (1000*60*60)) % 24);
    const diffMin = Math.floor((diff / (1000*60)) % 60);
    const diffSec = Math.floor(diff / 1000 % 60);
    timer.innerHTML = `<span style="font-size=0.5rem">모임까지 남은 시간</span><br>${diffDay}일 ${diffHour}시간 ${diffMin}분 ${diffSec}초`;


}


//디테일 페이지 들어가는 함수
async function openWalkDetailArticle(id){

    const detail_r_sec=document.getElementById("detail_r_sec")
    const r_sec=document.getElementById("r_sec")
    detail_r_sec.style.display="inline"
    r_sec.style.display="none"

    console.log(id)
    const response = await fetch(`${backend_base_url}walk/${id}/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    console.log(response_json)
    const host_name = document.getElementById("host_name")
    const detail_contents = document.getElementById("detail_contents")
    const detail_date = document.getElementById("detail_date")
    const detail_gender = document.getElementById("detail_gender")
    const detail_place = document.getElementById("detail_place")
    const detail_number = document.getElementById("detail_number")
    const left_seat = document.getElementById("left_seat")
    const attend_walk = document.getElementById('attend_walk')
    

    host_name.innerText='모임장 '+response_json.host_name+'님'
    detail_contents.innerHTML=response_json.contents
    detail_date.innerText=response_json.start_date
    detail_gender.innerText=response_json.gender
    detail_place.innerText=response_json.place
    detail_number.innerText=response_json.people_num
    left_seat.innerText=response_json.left_seat
    sessionStorage.setItem('meeting_date',response_json.start_date)
    const PayLoad = JSON.parse(localStorage.getItem("payload"))
    console.log(PayLoad.user_id)
    
    if (response_json.attending==true){
        attend_walk.innerText='모임에 참여 신청 하셨습니다'
        attend_walk.style.backgroundColor='#ADD8E6'
        attend_walk.setAttribute('onclick', `goHome(${response_json.id}, ${response_json.attending_user})`)
    }else if(response_json.host==PayLoad.user_id){
        attend_walk.innerText='모임 주최자입니다'
        attend_walk.style.backgroundColor='#98FB98'
    }else{
        attend_walk.setAttribute('onclick', `goWalk(${response_json.id}, ${response_json.attending_user})`)
    }
    
}






diffDay()
setInterval(diffDay,1000)
