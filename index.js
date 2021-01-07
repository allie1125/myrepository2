
'use strict';

let gps_use = null; //gps의 사용가능 여부
let gps_lat = null; // 위도
let gps_lng = null; // 경도
let gps_position; // gps 위치 객체

gps_check();
// gps가 이용가능한지 체크하는 함수이며, 이용가능하다면 show location 함수를 불러온다.
// 만약 작동되지 않는다면 경고창을 띄우고, 에러가 있다면 errorHandler 함수를 불러온다.
// timeout을 통해 시간제한을 둔다.
function gps_check(){
    if (navigator.geolocation) {
        var options = {timeout:60000};
        navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
    } else {
        alert("GPS_추적이 불가합니다.");
        gps_use = false;
    }
}


// gps 이용 가능 시, 위도와 경도를 반환하는 showlocation함수.
function showLocation(position) {
    gps_use = true;
    gps_lat = position.coords.latitude;
    gps_lng = position.coords.longitude;

    // console.log('lat: '+gps_lat);    
    // console.log('lng: '+gps_lng);

    // 주소-좌표 변환 객체를 생성합니다
    var geocoder = new kakao.maps.services.Geocoder();

    var callback = function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
    
            // console.log('지역 명칭 : ' + result[0].region_2depth_name +" "+ result[0].region_3depth_name);
            let userCurrentLocation = result[0].region_2depth_name +" "+ result[0].region_3depth_name;
            let locationDiv = document.getElementById('curLocationAddr');
            locationDiv.innerHTML='현재 위치: '+userCurrentLocation;
        }
    };

    // 좌표로 행정동 주소 정보를 요청합니다
    geocoder.coord2RegionCode(gps_lng, gps_lat, callback);  
}



// error발생 시 에러의 종류를 알려주는 함수.
function errorHandler(error) {
    if(error.code == 1) {
        alert("접근차단");
    } else if( err.code == 2) {
        alert("위치를 반환할 수 없습니다.");
    }
    gps_use = false;
}
