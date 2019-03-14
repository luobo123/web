var modifyPwdHandler={
	modifyPwdModalForm:null,
	init:function(){
		this.modifyPwdModalForm = $('#modify_pwd_modal_frm');
		this.btnBindClick();
		this.formValidate();
	},
	btnBindClick:function(){
		var self=this;
		$("#change-user-pwd").click(function(){
			$("#modify_pwd_modal").modal();
		});
		
		$("#password_m_update").blur(function(){
			var pwdAgain = $("#password_again_m").val();
			if(pwdAgain.length>5){
				var pwd = $("#password_m_update").val();
				$("label.validator-error").remove();
	            $(".validator-error").removeClass("validator-error");
				if(pwd != pwdAgain){
					$("#password_again_m").addClass("validator-error")
					$("#password_again_div").append('<label id="pwd_again-error" class="validator-error">密码不一致,请重新输入</label>');
				}else{
					$("label.validator-error").remove();
		            $(".validator-error").removeClass("validator-error");
				}
			}
		});
		
		$("#password_again_m").blur(function(){
			var pwdAgain = $("#password_again_m").val();
			if(pwdAgain.length>5){
				var pwd = $("#password_m_update").val();
				$("label.validator-error").remove();
	            $(".validator-error").removeClass("validator-error");
				if(pwd != pwdAgain){
					$("#password_again_m").addClass("validator-error")
					$("#password_again_div").append('<label id="pwd_again-error" class="validator-error">密码不一致,请重新输入</label>');
				}else{
					$("label.validator-error").remove();
		            $(".validator-error").removeClass("validator-error");
				}
			}
		});
		
		$("#btn_sure_user").click(function(){
			//表单校验
            if(self.modifyPwdModalForm.valid()){
            	var pwd = $("#password_m_update").val();
                var pwdAgain = $("#password_again_m").val();
                if(pwd != pwdAgain){
    				$("#password_again_m").addClass("validator-error")
    				$("#password_again_div").append('<label id="pwd_again-error" class="validator-error">密码不一致,请重新输入</label>');
    				return;
                }
                $.blockUI({message: '<h5>正在修改...</h5>'});
                $.ajax({ 
                	type:'POST',
                	url: ctx+'/user/change/password', 
                	data:{
                		password: pwd
                	},
                	success: function(response){
                		$.unblockUI();
                    	if(response.statusCode != 200){
                			szr.Notify.danger("修改密码失败，" + response.message + "！", 2);
                			return;
                        }
                    	
                    	self.modifyPwdModalForm[0].reset();
            			$("#modify_pwd_modal").modal('hide');
                    	szr.Notify.success("修改密码成功！", 2);
                    	setTimeout(function(){
                    		window.location.href = ctx + '/logout';
    					},1000);
                	},
                	error:function(){
                		$.unblockUI();
                	}
                });
            }
		});
		
		$("#btn_cancel_user").click(function(){
			self.modifyPwdModalForm[0].reset();
			$("label.validator-error").remove();
			$(".validator-error").removeClass("validator-error");
			$("#modify_pwd_modal").modal('hide');
		});
	},
	formValidate: function () {
        var self = this;
        self.validator = self.modifyPwdModalForm.validate({
            errorClass: 'validator-error', 
            errorPlacement: function (error, element) { 
            	var div = $(element).parent('div');
                error.appendTo(div);
            },
            focusInvalid: true, 
            ignore: ":hidden", 
            rules: {
            	passwordm: { required: true,minlength:6,maxlength:20 },
            	passwordAgain: { required: true,minlength:6,maxlength:20 }
            },
            messages: {
            	passwordm: { required: '请输入密码',minlength:"密码最少6位", maxlength:'密码最多20位' },
            	passwordAgain: { required: '请输入确认密码',minlength:"密码最少6位", maxlength:'密码最多20位' }
            }
        });
    }
};
$(function(){
	modifyPwdHandler.init();
});
