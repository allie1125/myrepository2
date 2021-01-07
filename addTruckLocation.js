function initialize(){

    //영업장소 인풋필드에 적힌 주소를 가져와서 검색한다.
    var addressEl= document.getElementById('inputFieldAddress');
    var searchBox = new google.maps.places.SearchBox(addressEl);

    google.maps.event.addListener(searchBox,'places_changed', function(){

        console.log(searchBox.getPlaces());
        var places = searchBox.getPlaces(),
        bounds = new google.maps.LatLngBounds(),
        i, place;
        var formattedAddress = places[0].formatted_address
        // console.log(formattedAddress);
        // console.log(bounds);

        // 주소-좌표 변환 객체를 생성합니다
        var geocoder = new kakao.maps.services.Geocoder();

        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(formattedAddress, function(result, status) {
        console.log('주소로 좌표를 검색');

        // 정상적으로 검색이 완료됐으면 
        if (status === kakao.maps.services.Status.OK) {

            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

            /**
             * PHP form을 통해서 저장할 수 있도록 HTML element에 위도와 경도를 추가한다.
             */
            
            //create Element (input)
            var lat = document.createElement('input');
            var lng = document.createElement('input');

            //set attribute (input)
            lat.setAttribute("type", "hidden");
            lat.setAttribute("name","lat");
            lat.setAttribute("value",result[0].y);

            lng.setAttribute("type", "hidden");
            lng.setAttribute("name","lng");
            lng.setAttribute("value",result[0].x);

            //기존 form에 위에 만든 input 추가
            var currentForm = document.getElementById("form");
            currentForm.appendChild(lat);
            currentForm.appendChild(lng);

            //append form to body
            document.body.appendChild(currentForm);

            /**end of PHP form을 통해서 저장할 수 있도록 HTML element에 위도와 경도를 추가한다. */ 
            
            //해당 장소에 좌표를 찍는다.
            displayMarker(coords);

            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
            map.setCenter(coords);
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


출처: https://fruitdev.tistory.com/200 [과일가게 개발자]

//date picker
$(function() {
    $("#date").datepicker({
        showOn: "both", // 버튼과 텍스트 필드 모두 캘린더를 보여준다.

        buttonImage: "https://jqueryui.com/resources/demos/datepicker/images/calendar.gif", // 버튼 이미지
      
        buttonImageOnly: true, // 버튼에 있는 이미지만 표시한다.
      
        changeMonth: true, // 월을 바꿀수 있는 셀렉트 박스를 표시한다.
      
        changeYear: false, // 년을 바꿀 수 있는 셀렉트 박스를 표시한다.
      
        minDate: '0d', // 오늘 이전의 날짜는 선택할 수 없다.
      
        nextText: '다음 달', // next 아이콘의 툴팁.
      
        prevText: '이전 달', // prev 아이콘의 툴팁.
      
        numberOfMonths: [1,1], // 한번에 얼마나 많은 월을 표시할것인가. [2,3] 일 경우, 2(행) x 3(열) = 6개의 월을 표시한다.
      
        stepMonths: 1, // next, prev 버튼을 클릭했을때 얼마나 많은 월을 이동하여 표시하는가. 
      
        yearRange: 'c-100:c+10', // 년도 선택 셀렉트박스를 현재 년도에서 이전, 이후로 얼마의 범위를 표시할것인가.
      
        showButtonPanel: true, // 캘린더 하단에 버튼 패널을 표시한다. 
      
        currentText: '오늘 날짜' , // 오늘 날짜로 이동하는 버튼 패널
      
        closeText: '닫기',  // 닫기 버튼 패널
      
        dateFormat: "yy-mm-dd", // 텍스트 필드에 입력되는 날짜 형식.
      
        showAnim: "slide", //애니메이션을 적용한다.
      
        showMonthAfterYear: true , // 월, 년순의 셀렉트 박스를 년,월 순으로 바꿔준다. 
      
        dayNamesMin: ['월', '화', '수', '목', '금', '토', '일'], // 요일의 한글 형식.
      
        monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'], // 월의 한글 형식.
      
        yearRange: "2020:2023" //연도 범위
    });
});

//time picker
$('.inputOpeningHour').timepicker({
    timeFormat: 'HH:mm',
    interval: 60,
    minTime: '09',
    maxTime: '11:00pm',
    defaultTime: '09',
    startTime: '00:00',
    dynamic: false,
    dropdown: true,
    scrollbar: true
});

$('.inputClosingHour').timepicker({
    timeFormat: 'HH:mm',
    interval: 60,
    minTime: '09',
    maxTime: '11:00pm',
    defaultTime: '18',
    startTime: '00:00',
    dynamic: false,
    dropdown: true,
    scrollbar: true
});

}

//input 태그 엔터시 submit 방지
document.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
    };
  }, true);

