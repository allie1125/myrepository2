
$(document).ready(function(){

    //id를 name으로 갖는 element의 길이(메인화면 카드의 갯수)
    let length = document.getElementsByName('id').length;
    let array = new Array();    //JsonArray를 위한 배열생성

    for (let i=0; i<length; i++){
        let obj = new Object();     //JsonObject를 위한 객체생성

        let id = document.getElementsByName('id')[i].value;
        let lat = document.getElementsByName('lat')[i].value;
        let lng = document.getElementsByName('lng')[i].value;
        obj.id = id;
        obj.lat = lat;
        obj.lng = lng;
        array.push(obj);

    }

    console.log(array)

    // /**DB에서 트럭의 lat, lon 값을 요청 */
    // $.ajax({
    //     url:'calculateDistanceProcess.php',
    //     type:'POST',
    //     dataType:'json',
    //     data: {dataArray: array},
    //     // contentType:false,
    //     // processData:false,
    //     success: function(data){
    //         console.log(data)
    //     },
    //     error:function(xhr, ajaxOptions,thrownError){
    //         console.log(xhr.status);
    //         console.log(thrownError);
    //     }
    // })




/**클라이언트의 현재 위치값 */
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

    for (let i=0; i<length; i++){
        document.getElementsByName('distance')[i].innerHTML = getDistanceFromLatLonInKm(gps_lat,gps_lng,array[i].lat,array[i].lng);
    }

    };

// error발생 시 에러의 종류를 알려주는 함수.
function errorHandler(error) {
    if(error.code == 1) {
        alert("접근차단");
    } else if( err.code == 2) {
        alert("위치를 반환할 수 없습니다.");
    }
    gps_use = false;
}



/**DB의 위치값과 현재사용자의 위치로 두 지점간의 거리를 m로 계산하기 */
function getDistanceFromLatLonInKm(lat1,lng1,lat2,lng2) { 


    function deg2rad(deg) { 
        return deg * (Math.PI/180) 
    } 
    
    var R = 6371; // Radius of the earth in km 
    var dLat = deg2rad(lat2-lat1); // deg2rad below 
    var dLon = deg2rad(lng2-lng1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km 
    var result = (Math.round(d*100)/100)*100
    // console.log('d:'+d);
    // console.log('distance: '+distance);
    // distance.innerHTML=d;

    return '나와의 거리 '+result+' m'; 
}

})