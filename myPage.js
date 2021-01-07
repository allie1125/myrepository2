'use strict';

$(document).ready(function(){
    
    //대표사진 업로드
    $(document).on('change', '#file', function(){
        let property = document.getElementById("file").files[0];
        // console.log('property'+property);
        let imageName = property.name;
        // console.log('imageName: '+imageName);
        let imageExtension = imageName.split('.').pop().toLowerCase();
        // console.log('imageExtension: '+imageExtension);
        // console.log('property.size: '+property.size);

        if(jQuery.inArray(imageExtension, ['gif', 'png', 'jpg', 'jpeg']) == -1){
            alert("이미지 파일을 선택해 주세요.");
        }
        let imageSize = property.size;
        if(imageSize > 2000000){
            alert("2MB 이하만 업로드 가능합니다.");
        }else{
            let formData = new FormData();
            // console.log(formData);
            formData.append("file", property);
            // formData.append("id",'truck1'); //아이디값을 붙여서 함께 전달(?)
            $.ajax({
                url:"myPageUploadTruckImage.php",
                method:"POST",
                data:formData,
                contentType:false,
                cache:false,
                processData:false,
                beforeSend:function(){
                    $('.truckImage').html("<label class='text-success'>이미지를 업로드 중입니다.</label>");
                },
                success:function(data){
                    //truckImage 엘리먼트의 style속성을 비움으로써 이전에 있던 이미지를 화면에서 지운다.
                    document.getElementById('truckImage').setAttribute('style','');
                    //사용자가 선택한 새로운 이미지를 화면에 표시한다.
                    $('.truckImage').html(data);

                }
            })
        }
    })


    //메뉴이미지 업로드
    $('#updateImagesBtn').on('change', function(e) {
        
        let formData = new FormData();
        
        //Read Selected Files
        let totalfiles = document.getElementById('updateImagesBtn').files.length;
        //Loop on the selected files and append in form_data Array type key-files[].
        //Files have been read by this key name in the PHP file.
        for(let i=0; i<totalfiles; i++){
            formData.append('files[]',document.getElementById('updateImagesBtn').files[i]);
        }
        
        $.ajax({
            url: 'myPageUploadMenuImages.php',
            type:'POST',
            data: formData,
            dataType: 'json',
            contentType:false,
            processData:false,
            // beforeSend:function(){
            //     $('.menuImageFile').html("<label class='text-success'>이미지를 업로드 중입니다.</label>");
            // },
            success: function(data){

                for(let i=0; i<data.length;i++){
                    let src = data[i];

                    //Add img element in <div id="preview">
                    // $('.menuImageFile').append('<img src="'+src+'" width=180px height=150px>');

                    $('.menuContent').append('<div class="menu1"><div class="menuImageFile" id="menuImageFile" style="background-image: url('+src+')"></div><div class="menuImageFileName">메뉴1.jpg</div></div>');


                    // var newDiv = document.createElement('div');
                    // var newContent = document.getElementById('menuImageFile').setAttribute('style','background-image: url("'+src+'")');
                    // newDiv.append(newContent);
                }

                // $('.menuImageFile').html(data);
                // alert('Image uploaded');
            },
            error:function(xhr, ajaxOptions,thrownError){
                // alert(xhr.status);
                console.log(xhr.status);
                // alert(thrownError);
                console.log(thrownError);
            }
        })
    })

    //메뉴판 업로드
    $('#addMenuBtn').on('click',function(e) {
        let menuName = $('.inputMenuName').val();
        let menuPrice = $('.inputMenuPrice').val();

        //메뉴이름과 가격 둘 중 하나라도 입력하지 않은 채로 등록 버튼을 누르면,
        if(isEmpty(menuName) || isEmpty(menuPrice)){
            alert('모두 입력하세요.');
        }else{
            //사용자가 입력한 메뉴이름과 가격을 formData 형식으로 서버에 전송한다.
            let formData = new FormData();
            formData.append("menuName", menuName);
            formData.append("menuPrice", menuPrice);            

            //서버 통신
            $.ajax({
                url:'myPageUploadMenu.php',
                type:'POST',
                data:formData,
                dataType: 'json',
                contentType:false,
                processData:false,

                success: function(data) {
                    
                    //text 추가
                    $('.menupan').append('<div class="menuList1"><div class="menuName">'+data.menuName+'</div><div class="menuPrice">'+data.menuPrice+' 원'+'</div></div>');
                    
                    //text area 값 지우기
                    $('.inputMenuName').val('');
                    $('.inputMenuPrice').val('');
                },
                error:function(xhr, ajaxOptions,thrownError){
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            })
        }
    })

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

})