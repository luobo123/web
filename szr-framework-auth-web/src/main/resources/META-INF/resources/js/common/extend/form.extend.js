'use strict';
$.fn.serializeObject = function() {    
   var o = {};    
   var a = this.serializeArray();    
   $.each(a, function() {    
	   var arr = this.name.split('.');
	   var len = arr.length;
	   if(len == 1) {
		   if (o[this.name]) {    
			   if (!o[this.name].push) {    
				   o[this.name] = [o[this.name]];    
			   }    
			   o[this.name].push(this.value || '');    
		   } else {    
	           o[this.name] = this.value || '';    
		   }  
	   } else {
		   //o[arr[len - 1]] = this.value || '';
		   getObject(arr, len - 1, len, o, this.value);
	   }
         
   });    
   return o;    
}; 

function getObject(arr, index, len, o, value) {
	var obj = {};
	if(index == len - 1) {
		obj[arr[len - 1]] = value;
	} 
	
	if(index > 0) {
		if(o[arr[index -1]]) {
			o[arr[index - 1]] = Object.assign(obj, o[arr[index - 1]]);
		} else {
			o[arr[index - 1]] = obj;
		}
		index--;
		getObject(arr, index, o);
	}
} 


$.fn.loadData = function(obj) {
	var key,value,tagName,type,arr;
	var x = this[0];
	for(var i = 0; i < x.length; i++) {
		key = x.elements[i].name;
		arr = key.split('.');
		if(arr.length > 1){
			value = obj[arr[0]]
			for(var j = 1; j < arr.length && value; j++) {
				value = value[arr[j]];
			}
		} else if (arr.length == 1){
			value = obj[key];
		} else {
			continue;
		}
		
		$("[name='"+key+"'],[name='"+key+"[]']").each(function() {
			tagName = $(this)[0].tagName;
			type = $(this).attr('type');
			if(tagName=='INPUT'){
				if(type=='radio'){
					$(this).attr('checked',$(this).val()==value);
				}else if(type=='checkbox'){
					arr = value.split(',');
					for(var i =0;i<arr.length;i++){
						if($(this).val()==arr[i]){
							$(this).attr('checked',true);
							break;
						}
					}
				}else{
					$(this).val(value);
				}
			} else if(tagName=='SELECT'){
				if(value == null || value == undefined) {
					return;
				}
				if(typeof(value) == "boolean") {
					$(this).val(String(value)).trigger('change');
				} else if(typeof(value) == 'object') {	//对象类型
					$(this).val(value.id).trigger('change'); //对于对象类型必须有id用于显示
				} else {
					$(this).val(value).trigger('change');
				}
				
			} else if(tagName=='TEXTAREA' ) {
				$(this).val(value);
			}
		});
	}
}

var validator={
		validate:function(frm,error,rules,messages){
			frm.validate({
				errorElement : 'span', //default input error message container
				errorClass : 'help-block help-block-error', // default input error message class
				focusInvalid : false, // do not focus the last invalid input
				ignore : "", // validate all fields including form hidden input
				rules : rules,
				messages : messages,
				invalidHandler : function(event, validator) { //display error alert on form submit              
					error.show();
					App.scrollTo(error, -200);
				},
				errorPlacement : function(error, element) { // render error placement for each input type
					var icon = $(element).parent('.input-icon').children('i');
					icon.removeClass('fa-check').addClass("fa-warning");
					icon.attr("data-original-title", error.text()).tooltip();
				},
				highlight : function(element) { // hightlight error inputs
					$(element).closest('.form-group').removeClass("has-success").addClass('has-error'); // set error class to the control group   
				},
				unhighlight : function(element) { // revert the change done by hightlight

				},
				success : function(label, element) {
					var icon = $(element).parent('.input-icon').children('i');
					$(element).closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
					icon.removeClass("fa-warning").addClass("fa-check");
				}
			});
		}
};