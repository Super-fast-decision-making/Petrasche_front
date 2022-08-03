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
function handleKakaoSignup(authoObj, signupData) {//signup
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


//카카오맵 api


function mapOn(search){
    var infowindow = new kakao.maps.InfoWindow({zIndex:1});
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        mapOption = {
            center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };  
    var map = new kakao.maps.Map(mapContainer, mapOption);
    var ps = new kakao.maps.services.Places(); 
    
    // 키워드로 장소를 검색합니다
    ps.keywordSearch(search, placesSearchCB); 
    var bounds = new kakao.maps.LatLngBounds();
    function placesSearchCB (data, status, pagination) {
        if (status === kakao.maps.services.Status.OK) {
            // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
            // LatLngBounds 객체에 좌표를 추가합니다
            var bounds = new kakao.maps.LatLngBounds();
    
            for (var i=0; i<data.length; i++) {
                displayMarker(data[i]);    
                bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
            }       
            // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
            map.setBounds(bounds);
        }
    }
    function displayMarker(place) {
        
        // 마커를 생성하고 지도에 표시합니다
        var marker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(place.y, place.x) 
        });
        kakao.maps.event.addListener(marker, 'mouseover', function() {
        // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
            infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
            infowindow.open(map, marker);
        });
        // 마커에 클릭이벤트를 등록합니다
        kakao.maps.event.addListener(marker, 'click', function() {

            alert(place.place_name)
            document.getElementById('m_input_p').value = place.place_name
            document.getElementById('map_modal').style.display='none'
            
        });
        
    }
    if (navigator.geolocation) {

        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition(function(position) {
    
            var lat = position.coords.latitude, // 위도
                lon = position.coords.longitude; // 경도
            var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png' // 마커이미지의 주소입니다    
            var imageSize = new kakao.maps.Size(44, 49) // 마커이미지의 크기입니다
            var imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
            // var locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
            var locPosition = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(lat, lon) ,
                image: new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
            });
            kakao.maps.event.addListener(locPosition, 'mouseover', function() {
                // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
                infowindow.setContent('<div style="padding:5px;">현위치</div>');
                infowindow.open(map, marker);
            });
            // 마커와 인포윈도우를 표시합니다
            
        });
    }

    
}
function startMap(){
    const search = m_input_p.value;
    if (search==''){
        alert("검색할 장소를 넣어주세요!")
    }else{        
        document.getElementById('map_modal').style.display='inline'
        mapOn(search)
    }
}
function startMap2(search){
    document.getElementById('map_modal').style.display='inline'
    mapOn(search)
}

