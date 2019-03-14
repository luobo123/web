/**
 * 式化字符串,
两种调用方式
var template1="我是{0}，今年{1}了";
var result1=template1.format("loogn",22);
 
var template2="我是{name}，今年{age}了";
var result2=template2.format({name:"loogn",age:22});
*/
String.prototype.format = function(args) {
	var result = this;
	if (arguments.length < 1) {
		return result;
	}

	var data = arguments; // 如果模板参数是数组
	if (arguments.length == 1 && typeof (args) == "object") {
		// 如果模板参数是对象
		data = args;
	}
	for ( var key in data) {
		var value = data[key];
		if(value == null){
			value = "";
		}
		if (undefined != value) {
			result = result.replaceAll("{" + key + "}", value);
		}
	}
	return result;
};
/**以str开始*/
String.prototype.startWith = function(str) {
	var reg = new RegExp("^" + str);
	return reg.test(this);
};

/**以str结束*/
String.prototype.endWith = function(str) {
	var reg = new RegExp(str + "$");
	return reg.test(this);
};

/** 去掉value两边的空格 */
String.prototype.trim=function(){
	if(this == null){
		return null;
	}
	return this.replace(/(^\s*)|(\s*$)/g,"");
}

String.prototype.replaceAll=function(reallyDo,replaceWith,ignoreCase) { 
	if(!RegExp.prototype.isPrototypeOf(reallyDo)){ 
		return this.replace(new RegExp(reallyDo,(ignoreCase?"gi":"g")),replaceWith); 
	}else {
		return this.replace(reallyDo, replaceWith); 
	}
};