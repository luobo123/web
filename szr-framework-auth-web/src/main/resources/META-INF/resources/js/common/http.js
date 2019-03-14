'use strict';
/**
 * http请求常用方法
 */
var http={
		tableAjax:function(url,processCallback,data){
			var self=this;
			var option=self.ajax(url,null,processCallback);
			option.success=undefined;
			option.data=data;
			option.dataSrc=function (response) {
				if(self.ajaxResponseCodeHandle(response)){
					if(processCallback && (processCallback instanceof Function)){
						response = processCallback(response);
					}else{
						if(ucs){
							console.error("加载数据出错，请重试...");	
						}
						console.error("dataTableAjax错误");
					}
				}
    	      	return response.data.content?response.data.content:[];
			};
			return option;
		},
		ajax:function(url,data,successCallBack,errorCallBack){
			var self=this;
			var option={
					url:url,
					method:"POST",
					dataType:"json",
					timeout:30000,
					success:function(data){self.ajaxSuccess(data,successCallBack);},
					error:function(event,jqXHR,ajaxOptions,thrownError,errorCallBack){self.ajaxError(event,jqXHR,ajaxOptions,thrownError,errorCallBack)}
			}
			if(data){
				option.data=data;
			}
			return option;
		},
		get:function(url,data,successCallBack,errorCallBack){
			var option=this.ajax(url,data,successCallBack,errorCallBack);
			option.method="GET";
			$.ajax(option);
		},
		post:function(url,data,successCallBack,errorCallBack){
			var option=this.ajax(url,data,successCallBack,errorCallBack);
			option.method="POST";
			$.ajax(option);
		},
		jsonp:function(url,data,successCallBack,errorCallBack){
			var option=this.ajax(url,data,successCallBack,errorCallBack);
			option.dataType="JSONP";
			$.ajax(option);
		},
		ajaxResponseCodeHandle:function(data){
			var self=this;
			$.unblockUI();
			var statusCode=self.statusCode;
			var code = data.statusCode;
			if(code == statusCode.SC_40000){
				szr.Notify.danger(data.message,2);
			}else if(code == statusCode.SC_50000){
				return true;
			}else if(code == statusCode.SC_50001){
				szr.Notify.danger(data.message,2);
			}else if(code == statusCode.SC_50005){
				szr.Notify.danger(data.message,2);
			}else if(code == statusCode.SC_200){
				return true;
			}else if(code == statusCode.SC_NONE_LOGIN){
				szr.Notify.danger("登录信息过期，3秒后重新跳转到登录页面!",2);
			}else if(code == statusCode.SC_EXISTS){
				return true;
			}else if(code == statusCode.SC_USED){
				return true;
			}else{
				console.error("the ajax request is error");
				console.error("请求错误,请联系管理员！");
				szr.Notify.danger("请求错误,请联系管理员！",2);
			}
			return false;
		},
		ajaxSuccess:function(data,successCallBack){
			var self=this;
			if(self.ajaxResponseCodeHandle(data)){
				if(successCallBack && (successCallBack instanceof Function)){
					successCallBack(data);
				}
			}
		},
		ajaxError:function(event,jqXHR,ajaxOptions,thrownError,errorCallBack){
			if(errorCallBack && (errorCallBack instanceof Function)){
				errorCallBack(event,jqXHR,ajaxOptions,thrownError);
			}else{
				console.error(event);
			}
		},
		statusCode:{
			SC_200:200,
			SC_40000:40000,
			SC_40100:40001,
			SC_40300:40003,
			SC_40400:40004,
			SC_40500:40005,
			SC_40600:40006,
			SC_40800:40008,
			SC_40900:40009,
			SC_41500:40015,
			SC_40022:40022,
			SC_40023:40023,
			SC_40029:40029,
			SC_50000:50000,
			SC_50001:50001,
			SC_50005:50005,
			SC_51000:51000,
			SC_EXISTS:10001,
			SC_NONE_LOGIN:10000,
			SC_20001:20001,
			SC_20002:20002,
			SC_20003:20003,
			SC_USED:10002,
		}
};