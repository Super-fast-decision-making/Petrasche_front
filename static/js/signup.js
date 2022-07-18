function moveToProfileInput() {
    let pass = document.getElementById('password').value;
    let pass2 = document.getElementById('password2').value;
    if (pass != pass2) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }
    document.getElementById('sign-in-first-page').style.display = "none"
    document.getElementById('sign-in-2nd-page').style.display = "inline"
    document.getElementById('next-page').style.display = "none"
    document.getElementById('signup').style.display = "flex"
}



//날짜 드롭다운 처리
const yearSelect = document.getElementById("year");
const monthSelect = document.getElementById("month");
const daySelect = document.getElementById("day");

const months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

//Months are always the same
(function populateMonths(){
    for(let i = 0; i < months.length; i++){
        const option = document.createElement('option');
        option.textContent = months[i];
        monthSelect.appendChild(option);
    }
    monthSelect.value = "1월";
})();

let previousDay;

function populateDays(month){
    //Delete all of the children of the day dropdown
    //if they do exist
    while(daySelect.firstChild){
        daySelect.removeChild(daySelect.firstChild);
    }
    //한달에 있는 날짜수를 저장하는 변수
    let dayNum;
    //Get the current year
    let year = yearSelect.value.split("년")[0];
    if(month === '1월' || month === '3월' || 
    month === '5월' || month === '7월' || month === '8월' 
    || month === '10월' || month === '12월') {
        dayNum = 31;
    } else if(month === '4월' || month === '6월' 
    || month === '9월' || month === '11월') {
        dayNum = 30;
    }else{ 
        //2월 윤년 확인
        if(new Date(year, 1, 29).getMonth() === 1){
            dayNum = 29;
        }else{
            dayNum = 28;
        }
    }
    //Insert the correct days into the day <select>
    for(let i = 1; i <= dayNum; i++){
        const option = document.createElement("option");
        option.textContent = i+"일";
        daySelect.appendChild(option);
    }
    if(previousDay){
        daySelect.value = previousDay;
        if(daySelect.value === ""){
            daySelect.value = previousDay - 1;
        }
        if(daySelect.value === ""){
            daySelect.value = previousDay - 2;
        }
        if(daySelect.value === ""){
            daySelect.value = previousDay - 3;
        }
    }
}

function populateYears(){
    //Get the current year as a number
    let year = new Date().getFullYear();
    //100년을 옵션으로 지정
    for(let i = 0; i < 101; i++){
        const option = document.createElement("option");
        option.textContent = (year - i)+"년";
        yearSelect.appendChild(option);
    }
}

populateDays(monthSelect.value);
populateYears();

yearSelect.onchange = function() {
    populateDays(monthSelect.value);
}
monthSelect.onchange = function() {
    populateDays(monthSelect.value);
}
daySelect.onchange = function() {
    previousDay = daySelect.value;
}
