   
// if( $("input['type='truckType']").is(':checked')){
//     var type = $("input[type='truckType']:checked").val();
//     alert(type);
// }
   
   $(function(){

        //아이디-사용자 입력 전에는 모든 경고문구 숨기기
        $("#idInput-success").hide();
        $("#idInput-validation").hide();
        $("#idInput-empty").hide();
        $("#idInput-existId").hide();

        //비밀번호 경고문구 숨기기
        $("#passwordInput-success").hide();
        $("#passwordInput-danger").hide();

        //비밀번호 확인 경고문구 숨기기
        $("#passwordConfirmInput-success").hide();
        $("#passwordConfirmInput-danger").hide();
        
        //이메일 정규식 경고문구 숨기기
        $("#emailInput-danger").hide();

        //가입버튼 회색처리
        $("#submit").css('background-color','lightgray');

        // 아이디와 패스워드가 적합한지 검사할 정규식
        var getCheck= RegExp(/^[a-zA-Z0-9]{4,12}$/);

        // 이메일이 적합한지 검사할 정규식
        var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;


        $("input").keyup(function(){

            var idInput = $("#idInput").val();
            var passwordInput = $("#passwordInput").val();
            var passwordConfirmInput = $("#passwordConfirmInput").val();
            var emailInput = $("#emailInput").val();
            var foodTruckNameInput = $("#foodTruckNameInput").val();

            //아이디필드에 사용자의 입력값이 있을 때
            if(idInput != ""){

                //id가 유효성체크를 통과하지 못했을 경우
                if(!getCheck.test(idInput)){
                    $("#idInput-success").hide();
                    $("#idInput-empty").hide();
                    $("#idInput-validation").css('color','#FF0000').show();
                    //submit버튼 비활성화
                    $("#submit").css('background-color','lightgray').attr("disabled", "disabled");
                }else{
                //입력한 id가 유효성 체크를 통과한 경우
                    $("#idInput-empty").hide();
                    $("#idInput-validation").hide();
                    $("#idInput-success").css('color','#33CC00').show();
                }
            
            //idInput필드가 비어있는 경우
            }else{
                //아이디를 입력하세요 경고문구를 띄우고, 다른 경고 문구는 모두 숨기기
                $("#idInput-success").hide();
                $("#idInput-validation").hide();
                $("#idInput-empty").css('color','#FF0000').show();
                //submit버튼 비활성화
                $("#submit").css('background-color','lightgray').attr("disabled", "disabled");
            }


            if(passwordInput !="" || passwordConfirmInput !=""){

               if(passwordInput == passwordConfirmInput) {
                   $("#passwordConfirmInput-success").css('color','#33CC00').show();
                   $("#passwordConfirmInput-danger").hide();
                   $("#submit").removeAttr("disabled");
               }else{
                    $("#passwordConfirmInput-success").hide();
                    $("#passwordConfirmInput-danger").css('color','#FF0000').show();
                    $("#submit").css('background-color','lightgray').attr("disabled", "disabled");
               }
            }

            //이메일필드에 사용자 입력값이 있을 때
            if(emailInput != "") {
                if(!regExp.test(emailInput)) {
                    $("#emailInput-danger").css('color','#FF0000').show();
                    //submit버튼 비활성화
                    $("#submit").css('background-color','lightgray').attr("disabled", "disabled");
                }else{
                    $("#emailInput-danger").hide();
                }
            }
            
            //모든 인풋필드가 입력되었다면, 가입버튼을 활성화
            if(getCheck.test(idInput) && regExp.test(emailInput) 
                && passwordInput == passwordConfirmInput 
                && foodTruckNameInput !=""){

                $("#submit").css('background-color','orange').removeAttr("disabled");

            }

        })

        /**radio button 값 가져오기 */
        // $('#submit').click(function(){
        //     var radioVal = $('input[name="truckType"]:checked').val();
        //     alert(radioVal);
        // })

    })
