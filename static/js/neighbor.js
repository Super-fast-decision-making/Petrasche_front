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
    m_dropdown_region.innerHTML+=`<a href="#">${region}</a>`    
});
m_dropdown_region_date.forEach(date => {
    m_dropdown_date.innerHTML+=`<a href="#">${date}</a>`    
});
m_dropdown_time_list.forEach(time => {
    m_dropdown_time.innerHTML+=`<a href="#">${time}</a>`    
});
m_dropdown_gender_list.forEach(gender => {
    m_dropdown_gender.innerHTML+=`<a href="#">${gender}</a>`    
});
m_dropdown_hc_list.forEach(hc => {
    m_dropdown_hc.innerHTML+=`<a href="#">${hc}</a>`    
});
m_dropdown_size_list.forEach(size => {
    m_dropdown_size.innerHTML+=`<a href="#">${size}</a>`    
});


function searchGender(gender) {
    console.log((gender))
    // document.getElementById('dropbtn_g').innerText=gender
}

//neighbor 페이지 드롭다운 구현
const dropdown_gender = document.getElementById("dropdown_gender")
const dropdown_size = document.getElementById("dropdown_size")
const dropdown_region = document.getElementById("dropdown_region")
const dropdown_number = document.getElementById("dropdown_number")

m_dropdown_gender_list.forEach(gender => {
    dropdown_gender.innerHTML+=`<a href="#" onclick='searchGender(${gender})'>${gender}</a>`    
})
m_dropdown_size_list.forEach(size => {
    dropdown_size.innerHTML+=`<a href="#">${size}</a>`    
})
m_dropdown_region_list.forEach(region => {
    dropdown_region.innerHTML+=`<a href="#">${region}</a>`    
})
m_dropdown_hc_list.forEach(number => {
    dropdown_number.innerHTML+=`<a href="#">${number}</a>`    
})


