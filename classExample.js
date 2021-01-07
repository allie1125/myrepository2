class distanceFromPointToPoint {
    constructor(lat1,lng1,lat2,lng2){
        this.lat1 = lat1;
        this.lng1 = lng1; 
        this.lat2 = lat2;
        this.lng2 = lng2;
    }

    

    //Getter
    get gps_check(){
        // gps가 이용가능한지 체크하는 함수이며, 이용가능하다면 show location 함수를 불러온다.
        // 만약 작동되지 않는다면 경고창을 띄우고, 에러가 있다면 errorHandler 함수를 불러온다.
        // timeout을 통해 시간제한을 둔다.
            if (navigator.geolocation) {
                var options = {timeout:60000};
                return navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
            } else {
                alert("GPS_추적이 불가합니다.");
                gps_use = false;
            }
        
    }


    // gps 이용 가능 시, 위도와 경도를 반환하는 showlocation함수.
     showLocation(position) {
        gps_use = true;
        gps_lat = position.coords.latitude;
        gps_lng = position.coords.longitude;

        return gps_use,gps_lat,gps_lng;  
    }



    // error발생 시 에러의 종류를 알려주는 함수.
    errorHandler(error) {
        if(error.code == 1) {
            alert("접근차단");
        } else if( err.code == 2) {
            alert("위치를 반환할 수 없습니다.");
        }
        gps_use = false;
    }

}

const check = new distanceFromPointToPoint();
console.log(check.gps_check());