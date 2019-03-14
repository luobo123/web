'use strict'
//禁用form表单中所有的input[文本框、复选框、单选框],select[下拉选],多行文本框[textarea]  
function disableForm(formId, isDisabled) {
	var attr = "disable";
	if (!isDisabled) {
		attr = "enable";
	}
	$("form[id='" + formId + "'] :text").attr("disabled", isDisabled);
	$("form[id='" + formId + "'] textarea").attr("disabled", isDisabled);
	$("form[id='" + formId + "'] select").attr("disabled",isDisabled);
	$("form[id='" + formId + "'] :radio").attr("disabled", isDisabled);
	$("form[id='" + formId + "'] :checkbox").attr("disabled", isDisabled);
	/*
	// 禁用jquery easyui中的日期组件dataBox
	$("#" + formId + " input[class='datebox-f combo-f']").each(function() {
		if (this.id) {
			$("#" + this.id).datebox(attr);
		}
	});*/
}

function readonlyForm(formId, isReadonly) {
	$("form[id='" + formId + "'] :text").attr("readonly", isReadonly);
	$("form[id='" + formId + "'] textarea").attr("readonly", isReadonly);
	$("form[id='" + formId + "'] select").prop("disabled", isReadonly);
	if(isReadonly) {
		$("form[id='" + formId + "'] :radio").attr("disabled", 'disabled');
		$("form[id='" + formId + "'] :checkbox").attr("disabled", 'disabled');
	} else {
		$("form[id='" + formId + "'] :radio").attr("disabled", 'enabled');
		$("form[id='" + formId + "'] :checkbox").attr("disabled", 'enabled');
	}
}

/**
 * 禁用按钮
 * @param className Class名
 */
function disabledButton() {
	var tags = document.getElementsByTagName("button");// 获取标签
	for ( var i = 0; i < tags.length; i++) {
		if (tags[i].className.indexOf("btn_disabled")>0) {
			var id = tags[i].id;
			//$("#" + id).disable();// 禁用满足条件的元素
			$("#" + id).addClass('disabled'); 
			$("#" + id).prop('disabled', true); // Does nothing
		}
	}
}

/**
 * 启用按钮
 * @param className Class名
 */
function enabledButton() {
	var tags = document.getElementsByTagName("button");// 获取标签
	for ( var i = 0; i < tags.length; i++) {
		if (tags[i].className.indexOf("btn_disabled")>0) {
			var id = tags[i].id;
			//$("#" + id).linkbutton("enable");// 启用满足条件的元素
			$("#" + id).removeClass('disabled'); 
			$("#" + id).prop('disabled', false);
		}
	}
}

//确认框默认设置
//bootbox.setDefaults("locale","zh_CN");

function setRadioAttr($selector, attr, attrVal) {
	if(attr == "checked") {
		if(attrVal == true) {
			$selector.parent('span').addClass(attr);
		} else {
			$selector.parent('span').removeClass(attr);
		}
		
	} else if(attr == "disabled") {
		if(attrVal == true) {
			$selector.parent('div').addClass(attr);
		} else {
			$selector.parent('div').removeClass(attr);
		}
	}
}

function initDatePicker(selector) {
	selector.datepicker({
		language: "zh-CN",
        autoclose: true,//选中之后自动隐藏日期选择框
        todayBtn : "linked",  //今日按钮
        clearBtn: true,//清除按钮
        format: "yyyy-mm-dd"//日期格式
    });
}

function initDateTimePicker(selector) {
	 $(selector).datetimepicker({
         language: "zh-CN",
         autoclose: true,//选中之后自动隐藏日期选择框
         todayBtn : "linked",  //今日按钮
         clearBtn: true,//清除按钮
         todayHighlight:true,
         forceParse: true,
         //pickerPosition: "bottom-left",
         format: "yyyy-mm-dd hh:ii:ss"//日期格式
     }); 
}

function getQueryString(name) { //输入参数名称
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //根据参数格式，正则表达式解析参数
    var r = window.location.search.substr(1).match(reg);
    if (r !== null)
        return unescape(r[2]);
    return null; //返回参数值
} 

function formateAmount(data){
	var amount = '';
	if(data !== null){
		amount= data.toFixed(2);
		var rs = amount.indexOf('.');    
        if (rs < 0) {    
            rs = amount.length;    
            amount += '.';    
        }    
        while (amount.length <= rs + 2) {    
        	amount += '0';    
        }    
	}
	return amount;
}

//格式化日期 yyyy-mm-dd
Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
	for(var k in o) {
	   if(new RegExp("("+ k +")").test(fmt)){
	        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	    }
	}
   return fmt; 
};

