function initialize(){

    //영업장소 인풋필드에 적힌 주소를 가져와서 검색한다.
    var addressEl= document.getElementById('inputFieldAddress');
    var searchBox = new google.maps.places.SearchBox(addressEl);

    google.maps.event.addListener(searchBox,'places_changed', function(){

        // console.log(searchBox.getPlaces());
        var places = searchBox.getPlaces(),
        bounds = new google.maps.LatLngBounds(),
        i, place;
        var formattedAddress = places[0].formatted_address

        // 주소-좌표 변환 객체를 생성합니다
        var geocoder = new kakao.maps.services.Geocoder();

        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(formattedAddress, function(result, status) {
        // console.log('주소로 좌표를 검색');

        // 정상적으로 검색이 완료됐으면 
        if (status === kakao.maps.services.Status.OK) {

            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            
            //해당 장소에 마커를 찍는다.
            displayMarker(coords);

            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
            map.setCenter(coords);

            /**
             * DB에 있는 마커 정보를 확인해서, 
             * 해당 마커가 설정한 반경안에 존재한다면,
             * DB에서 해당마커들의 정보를 가져오고,
             * 지도에 마커를 찍는다.
             * (설정한 반경 밖에 존재하는 마커들은 가져오지 않는다.)
             */

             //사용자의 종류선택 & 거리선택
            let searchType = document.getElementById('searchType');
            let searchRadius = document.getElementById('searchRadius');
            let type = searchType.options[searchType.selectedIndex].value;
            let radius = searchRadius.options[searchRadius.selectedIndex].value;

                //**검색을 끝내고 이동한 지도중심 주변의 푸드트럭 마커를 지도에 표시 */
                //서버에 HTTP 요청을 하여 DB에서 데이터를 가져온다...
                $.ajax({
                    url: "../trucksNearbyMeProcess.php",    // 클라이언트가 요청을 보낼 서버의 URL 주소
                    data: {           // HTTP 요청과 함께 서버로 보낼 데이터
                        searchPositionLat: result[0].y,
                        searchPositionLng: result[0].x,
                        type: type, //사용자가 검색시 선택한 트럭종류
                        radius: radius  //사용자가 검색시 선택한 거리(트럭과 사용자간)
                    },                
                    type:"POST",      // HTTP 요청 방식(GET, POST)
                    dataType:"json",   // 서버에서 보내줄 데이터의 타입
                    success: function(data){    //Ajax 통신에 성공했을 때 실행되는 이벤트.
                        // alert(data);
                        //통신에 성공했으면, 마커정보 가져와서 지도에 마커 그리기
                        for(i=0; data.content.length>i ;i++){

                            //마커 이미지 생성
                            var position = new kakao.maps.LatLng(data.content[i].lat, data.content[i].lng);
                            var imageSrc = "./public/image/food-truck.png";
                            var imageSize = new kakao.maps.Size(35, 35); 
                            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

                            // 마커를 생성합니다
                            var marker = new kakao.maps.Marker({
                                map: map, // 마커를 표시할 지도
                                position: position, // 마커의 위치
                                title : position,
                                clickable: true,
                                image : markerImage
                            });
                            // var image = data.beenzipData[i].image;            
                            // var address = data.beenzipData[i].doroAddress;

                            // 마커에 표시할 인포윈도우를 생성합니다 
                            var infowindow = new kakao.maps.InfoWindow({
                                content: data.content[i].id+'<br/>', // 인포윈도우에 표시할 내용
                                removable: true // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다
                            });

                            kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow));
                        }

                        // 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
                        function makeOverListener(map, marker, infowindow) {
                            return function() {
                                infowindow.open(map, marker);
                            };
                        }
                    },
                
                    error: function (request, status, error){   //Ajax 통신에 실패했을 때 실행되는 이벤트. request, status, error로 에러 정보를 확인할 수 있다.
                        console.log(error)
                    }

                })

                //검색한 주소창 값 세팅
                document.getElementById('inputFieldAddress').value=places[0].name;

            } else{
                //유효하지 않은 주소를 검색하였을 시 경고창을 띄우고, 주소를 지운다.
                alert('유효하지 않은 주소입니다. 다시 입력해 주세요.');
                document.getElementById('inputFieldAddress').value='';
            }
        });
    })

    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        mapOption = { 
            center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };

    // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
    var map = new kakao.maps.Map(mapContainer, mapOption); 


    // HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
    if (navigator.geolocation) {
        
        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition(function(position) {
            
            var lat = position.coords.latitude, // 위도
                lon = position.coords.longitude; // 경도
            let type = searchType.options[searchType.selectedIndex].value;


                //서버에 HTTP 요청을 하여 DB에서 데이터를 가져온다...
                $.ajax({
                    url: "../trucksNearbyMeProcess.php",    // 클라이언트가 요청을 보낼 서버의 URL 주소
                    data: {           // HTTP 요청과 함께 서버로 보낼 데이터
                        searchPositionLat: lat,
                        searchPositionLng: lon,
                        type:type
                    },                
                    type:"POST",      // HTTP 요청 방식(GET, POST)
                    dataType:"json",   // 서버에서 보내줄 데이터의 타입
                    success: function(data){    //Ajax 통신에 성공했을 때 실행되는 이벤트.
                        // alert(data);
                        //통신에 성공했으면, 마커정보 가져와서 지도에 마커 그리기
                        for(i=0; data.content.length>i ;i++){

                            //마커 이미지 생성
                            var position = new kakao.maps.LatLng(data.content[i].lat, data.content[i].lng);
                            var imageSrc = "./public/image/food-truck.png";
                            var imageSize = new kakao.maps.Size(35, 35); 
                            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

                            // 마커를 생성합니다
                            var marker = new kakao.maps.Marker({
                                map: map, // 마커를 표시할 지도
                                position: position, // 마커의 위치
                                title : position,
                                clickable: true,
                                image : markerImage
                            });
                            // var image = data.beenzipData[i].image;            
                            // var address = data.beenzipData[i].doroAddress;

                            // 마커에 표시할 인포윈도우를 생성합니다 
                            var infowindow = new kakao.maps.InfoWindow({
                                content: data.content[i].id+'<br/>', // 인포윈도우에 표시할 내용
                                removable: true // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다
                            });

                            kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow));
                        }

                        // 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
                        function makeOverListener(map, marker, infowindow) {
                            return function() {
                                infowindow.open(map, marker);
                            };
                        }
                    },
                
                    error: function (request, status, error){   //Ajax 통신에 실패했을 때 실행되는 이벤트. request, status, error로 에러 정보를 확인할 수 있다.
                        alert(error);
                    }

                })

            
            var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
                message = '<div style="padding:5px;">내위치</div>'; // 인포윈도우에 표시될 내용입니다
            
            // 마커와 인포윈도우를 표시합니다
            displayMarker(locPosition, message);
                
        });

    } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
        
        var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),    
            message = 'geolocation을 사용할수 없어요..'
            
        displayMarker(locPosition, message);
    }

    // 지도에 현재위치의 마커와 인포윈도우를 표시하는 함수입니다
    function displayMarker(locPosition, message) {

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({  
            map: map, 
            position: locPosition
        }); 
        
        if(!isEmpty){

            var iwContent = message, // 인포윈도우에 표시할 내용
            iwRemoveable = true;

            // 인포윈도우를 생성합니다
            var infowindow = new kakao.maps.InfoWindow({
                content : iwContent,
                removable : iwRemoveable
            });
        
            // 인포윈도우를 마커위에 표시합니다 
            infowindow.open(map, marker);
        }

        
        // 지도 중심좌표를 접속위치로 변경합니다
        map.setCenter(locPosition);      
    }   

        /**
         * 문자열이 빈 문자열인지 체크하여 결과값을 리턴한다.
         * @param str       : 체크할 문자열
         */
        function isEmpty(str){
            
            if(typeof str == "undefined" || str == null || str == "")
                return true;
            else
                return false ;
        }

    //출처: https://fruitdev.tistory.com/200 [과일가게 개발자]

}


