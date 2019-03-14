'use strict';
var Login = {
	handleLogin:function(){
	        $('.login-form').validate({
	            errorElement: 'span', //default input error message container
	            errorClass: 'help-block', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            rules: {
	                username: {
	                    required:true,
	                    minlength:5,
	                    maxlength:20
	                },
	                pwd:{
	                    required: true,
	                    minlength:6,
	                    maxlength:20
	                },
	                remember: {
	                    required: false
	                }
	            },
	            messages: {
	                username: {
	                    required:'请输入用户名',
	                    minlength:'用户名最少5位',
	                    maxlength:'用户名最多20位'
	                },
	                pwd:{
	                    required:'请输入密码',
	                    minlength:'密码最少6位',
	                    maxlength:'密码最多20位'
	                }
	            },

	            invalidHandler: function(event, validator) { //display error alert on form submit 
	            	$('#alert-danger-msg').text(validator.errorList[0].message);
	                $('.alert-danger', $('.login-form')).show();
	                $(validator.currentElements[0]).focus();
	            },

	            highlight: function(element) { // hightlight error inputs
	                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
	            },

	            success: function(label) {
	                label.closest('.form-group').removeClass('has-error');
	                label.remove();
	            },

	            errorPlacement: function(error, element) {
	                error.insertAfter(element.closest('.input-icon'));
	            },

	            submitHandler: function(form) {
	            	var rememberChecked = $('input[type="checkbox"][name="remember"]').prop("checked");
	            	if(rememberChecked){
	            		Cookies.set('remember_username',$('#username').val());
	            		Cookies.set('remember_pwd',$('#pwd').val());
	            		Cookies.set('rememberChecked',rememberChecked);
	            	}else{
	            		Cookies.remove('remember_username');
	            		Cookies.remove('remember_pwd');
	            		Cookies.remove('rememberChecked');
	            	}
	                form.submit();
	            }
	        });
	},
	init:function(){
		$("#username").focus();
    	var remember_username=Cookies.get('remember_username');
    	var remember_pwd=Cookies.get('remember_pwd');
    	var rememberChecked=Cookies.get('rememberChecked');
    	if(rememberChecked){
    		$('input[type="checkbox"][name="remember"]').prop("checked",true);
    		$('input[type="checkbox"][name="remember"]').parent('span').addClass('checked');
    		if(remember_username){
    			$('#username').val(remember_username);
    		}
    		if(remember_pwd){
    			$('#pwd').val(remember_pwd);
    		}
    	}
		$('.login-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.login-form').validate().form()) {
                    $('.login-form').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });
		$('#btn-close').click(function(){
			$('div.alert-danger').hide();
			return false;
		});
	}
}
$(document).ready(function() {
    Login.init();
    Login.handleLogin();
});