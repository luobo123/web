/** 用途：校验ip地址的格式 
输入：strIP：ip地址
返回：如果通过验证返回true,否则返回false；
*/ 
function isIP(strIP) {
	if(isNull(strIP)){return false;}; 
	var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g; // 匹配IP地址的正则表达式
	if(re.test(strIP)){ 
		if(RegExp.$1 <256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256){return true;}; 
	} 
	return false; 
}


/**
用途：检查输入字符串是否为空或者全部都是空格 
输入：str 
返回：
如果全是空返回true,否则返回false 
*/ 
function isNull(str){ 
	if (str== ""){return true;}; 
	var regu = "^[ ]+$"; 
	var re = new RegExp(regu); 
	return re.test(str); 
} 


/**
用途：检查输入对象的值是否符合整数格式
输入：str 输入的字符串
返回：如果通过验证返回true,否则返回false
*/
function isInteger( str ){
	var regu = /^[-]{0,1}[0-9]{1,}$/;
	return regu.test(str);
}

/**
用途：检查输入手机号码是否正确
输入：s：字符串
返回：如果通过验证返回true,否则返回false
*/
function isMobile(s){  
	var regu =/^[1][3|5|8][0-9]{9}$/;
	var re = new RegExp(regu);
	if(re.test(s)){
		return true;
	}else{
		return false;
	}
}

/**
用途：检查输入字符串是否符合正整数格式
输入：s：字符串
返回：如果通过验证返回true,否则返回false
*/
function isNumber(s){  
	var regu = "^[0-9]+$";
	var re = new RegExp(regu);
	if (s.search(re) != -1) {
		return true;
	} else {
		return false;
	}
}



/**
用途：检查输入字符串是否是带小数的数字格式,可以是负数
输入：s：字符串
返回：如果通过验证返回true,否则返回false
*/

function isDecimal( str ){  
	if(isInteger(str)) return true;
	var re = /^[-]{0,1}(\d+)[\.]+(\d+)$/;
	if (re.test(str)) {
		if(RegExp.$1==0&&RegExp.$2==0){
			return false;
		}else{
			return true;
		}
	} else {
		return false;
	}
}

/**
用途：检查输入对象的值是否符合端口号格式
输入：str 输入的字符串
返回：如果通过验证返回true,否则返回false
*/
function isPort(str){
	return (isNumber(str) && str<65536);
}

/**
用途：检查输入对象的值是否符合E-Mail格式
输入：str 输入的字符串
返回：如果通过验证返回true,否则返回false
*/
function isEmail(str){
	var myReg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
	if(myReg.test(str)){
		return true;
	}
	return false;
}

/**
用途：检查输入字符串是否符合金额格式
格式定义为带小数的正数，小数点后最多三位
输入：s：字符串
返回：如果通过验证返回true,否则返回false
*/

function isMoney( s ){  
	var regu = "^[0-9]+[\.][0-9]{0,3}$";//8
	var re = new RegExp(regu);
	if (re.test(s)) {
		return true;
	} else {
		return false;
	}
}

/**
用途：检查输入字符串是否只由英文字母和数字和下划线组成
输入：s：字符串
返回：如果通过验证返回true,否则返回false
*/
function isNumberOr_Letter(s){//判断是否是数字或字母
	var regu = "^[0-9a-zA-Z\_]+$";
	var re = new RegExp(regu);
	if (re.test(s)) {
		return true;
	}else{
		return false;
	}
}

/**
用途：检查输入字符串是否只由和数字组成
输入：s：字符串
返回：如果通过验证返回true,否则返回false
*/
function isNumberOnly(s){//判断是否是数字
	var regu = "^[0-9]+$";
	var re = new RegExp(regu);
	if (re.test(s)) {
		return true;
	}else{
		return false;
	}
}

/**
用途：检查输入字符串是否只由英文字母和数字组成
输入：s：字符串
返回：如果通过验证返回true,否则返回false
*/
function isNumberOrLetter(s){//判断是否是数字或字母
	var regu = "^[0-9a-zA-Z]+$";
	var re = new RegExp(regu);
	if (re.test(s)) {
		return true;
	}else{
		return false;
	}
}

/**
用途：检查输入字符串是否只由汉字、字母、数字组成
输入：value：字符串
返回：如果通过验证返回true,否则返回false
*/
function isChinaOrNumbOrLett( s ){//判断是否是汉字、字母、数字组成
	var regu = "^[0-9a-zA-Z\一-\龥]+$";  
	var re = new RegExp(regu);
	if (re.test(s)) {
		return true;
	}else{
		return false;
	}
}

/**
用途：检查输入字符串是否只由汉字、字母、数字下划线组成
输入：value：字符串
返回：如果通过验证返回true,否则返回false
*/
function isChinaOrNumbOr_Lett( s ){//判断是否是汉字、字母、数字组成
	var regu = "^[a-zA-Z0-9_\u4e00-\u9fa5]+$";  
	var re = new RegExp(regu);
	if (re.test(s)) {
		return true;
	}else{
		return false;
	}
}

/**
用途：判断是否是日期
输入：date：日期；fmt：日期格式
返回：如果通过验证返回true,否则返回false
*/
function isDate(date,fmt) {
	if (fmt==null) fmt="yyyyMMdd";
	var yIndex = fmt.indexOf("yyyy");
	if(yIndex==-1) return false;
	var year = date.substring(yIndex,yIndex+4);
	var mIndex = fmt.indexOf("MM");
	if(mIndex==-1) return false;
	var month = date.substring(mIndex,mIndex+2);
	var dIndex = fmt.indexOf("dd");
	if(dIndex==-1){
		return false;
	}
	var day = date.substring(dIndex,dIndex+2);
	if(!isNumber(year)||year>"2100" || year< "1900") return false;
	if(!isNumber(month)||month>"12" || month< "01") return false;
	if(day>getMaxDay(year,month) || day< "01") return false;
	return true;
}

function getMaxDay(year,month) {
	if(month==4||month==6||month==9||month==11){
		return "30";
	}
	if(month==2){
		if(year%4==0&&year%100!=0 || year%400==0){
			return "29";			
		}else{
			return "28";
		}
	}
	return "31";
}



/**
用途：字符1是否以字符串2结束
输入：str1：字符串；str2：被包含的字符串
返回：如果通过验证返回true,否则返回false
*/
function isEndWith(str1,str2){
	var index = str1.lastIndexOf(str2);
	if(str1.length==index+str2.length){
		return true;
	}
	return false;
}



/**
用途：字符1是否以字符串2开始
输入：str1：字符串；str2：被包含的字符串
返回：如果通过验证返回true,否则返回false
*/
function isStartWidth(str1,str2){
	var index = str1.indexOf(str2);
	if(index==0) return true;
	return false;
}

/**
用途：字符1是包含字符串2
输入：str1：字符串；str2：被包含的字符串
返回：如果通过验证返回true,否则返回false
*/
function isContain(str1,str2){
	var index = str1.indexOf(str2);
	if(index==-1){
		return false;
	}
	return true;
}

/**
用途：检查输入的起止日期是否正确，规则为两个日期的格式正确，
且结束如期>=起始日期
输入：startDate：起始日期，字符串
endDate：结束如期，字符串
返回：如果通过验证返回true,否则返回false
*/
function checkTwoDate(startDate,endDate ) {
	if(!isDate(startDate)) {
		alert("起始日期不正确!");
		return false;
	} else if( !isDate(endDate) ) {
		alert("终止日期不正确!");
		return false;
	} else if( startDate > endDate ) {
		alert("起始日期不能大于终止日期!");
		return false;
	}
	return true;
}

/**
用途：检查复选框被选中的数目
输入：checkboxID：字符串
返回：返回该复选框中被选中的数目
*/
function checkSelectCount(checkboxID) {
	var check = 0;
	var i=0;
	if(document.all(checkboxID).length>0) {
		for( i=0; i<document.all(checkboxID).length; i++ ) {
			if( document.all(checkboxID).item(i).checked ) {
				check += 1;
			}
		}
	}else{
		if( document.all(checkboxID).checked )
			check = 1;
	}
	return check;
}

/**
 * 全选
 * @param checkboxID
 * @param status
 * @returns
 */
function selectAll(checkboxID,status ){
	if( document.all(checkboxID) == null)
		return;
	if(document.all(checkboxID).length > 0 ){
		for(var i=0;i<document.all(checkboxID).length; i++ ){
			document.all(checkboxID).item(i).checked = status;
		}
	} else {
		document.all(checkboxID).checked =status;
	}
}

/**
 * 反选
 * @param checkboxID
 * @returns
 */
function selectInverse(checkboxID ) {
	if( document.all(checkboxID) == null)
		return;
	if( document.all(checkboxID).length > 0 ) {
		for(var i=0; i<document.all(checkboxID).length; i++ ) {
			document.all(checkboxID).item( i ).checked = !document.all(checkboxID).item( i ).checked;
		}
	} else {
		document.all(checkboxID).checked = !document.all(checkboxID).checked;
	}
}

/**
用途：检查证券代码是否正确
输入：secCode:证券代码
返回：如果通过验证返回true,否则返回false
*/
function checkSecCode(secCode) {
	if( secCode.length !=6 ){
		alert("证券代码长度应该为6位");
		return false;
	}
	if(!isNumber( secCode ) ){
		alert("证券代码只能包含数字");
		return false;
	}
	return true;
}

/**
 * 删除左右两端的空格
 * @param str
 * @returns
 */
function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 删除左边的空格
 * @param str
 * @returns
 */
function ltrim(str){
    return str.replace(/(^\s*)/g,"");
}

/**
 * 删除右边的空格
 * @param str
 * @returns
 */
function rtrim(str){
    return str.replace(/(\s*$)/g,"");
}

/**
 * 验证身份证号码
 * 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
 * @param card
 * @returns {Boolean}
 */
function isCardNo(card){
   var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
   if(reg.test(card) === false){
       return  false;
   }
}


/**
 * 判断是否是汉字
 * @param str
 * @returns {Boolean}
 */
function isCN(str){
	if (/^[\u4e00-\u9fa5]+$/.test(str)) {
	  return true;
	}
	return false;
}

/**
判断是否为小写英文字母，是则返回true,否则返回false
*/
function isLowercase(val){   	
	if (/^[a-z]+$/.test(val)) {
	   return true;
	} 
   return false;
}

/**
判断是否为大写英文字母，是则返回true,否则返回false 
*/ 
function isUppercase(val){   	
	if (/^[A-Z]+$/.test(val)){
	   return true;
	} 
	return false;
}

/**
判断是否为英文字母，是则返回true,否则返回false 
*/ 
function isLetter(obj){   	
	if (/^[A-Za-z]+$/.test( obj.value )) 
	{
	   return true;
	} 
	f_alert(obj,"请输入英文字母");
	return false;
}

/**
用途：检查输入字符串是否只由汉字、字母、数字组成 ,如果通过验证返回true,否则返回false 
*/ 
function isCNOrNumOrLett(val){
	var regu = "^[0-9a-zA-Z\u4e00-\u9fa5]+$";   
	var re = new RegExp(regu);
	if (re.test(val)) {
	  return true;
	}
	return false;
}
/**
用途：检查输入字符串是否只由汉字、字母、数字下划线中划线组成 ,如果通过验证返回true,否则返回false 
 */ 
function isCNOrNumOrLettOrz(val){
	var regu = "^[a-zA-Z0-9_\u4e00-\u9fa5\-]+$";   
	var re = new RegExp(regu);
	if (re.test(val)) {
		return true;
	}
	return false;
}


/**
要求：一、电话号码由数字、"("、")"和"-"构成 
二、电话号码为3到8位 
三、如果电话号码中包含有区号，那么区号为三位或四位 
四、区号用"("、")"或"-"和其他部分隔开 
用途：检查输入的电话号码格式是否正确 
*/ 
function isPhone(val) {
	var regu =/(^([0][1-9]{2,3}[-])?\d{3,8}(-\d{1,6})?$)|(^\([0][1-9]{2,3}\)\d{3,8}(\(\d{1,6}\))?$)|(^\d{3,8}$)/; 
	var re = new RegExp(regu);
	if (re.test(val)) {
	  return true;
	}
	return false;
}

/**
功能：验证身份证号码是否有效 
提示信息：未输入或输入身份证号不正确！ 
*/ 
function isIdCardNo(val){ 
	var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
	var iSum = 0;
	var strIDno =val;
	var idCardLength = strIDno.length;  
	if(!/^\d{17}(\d|x)$/i.test(strIDno)&&!/^\d{15}$/i.test(strIDno)){
		return false;
	}
	//在后面的运算中x相当于数字10,所以转换成a
	strIDno = strIDno.replace(/x$/i,"a");
	if(aCity[parseInt(strIDno.substr(0,2))]==null){
		return false;
	}
	if (idCardLength==18){
		sBirthday=strIDno.substr(6,4)+"-"+Number(strIDno.substr(10,2))+"-"+Number(strIDno.substr(12,2));
		var d = new Date(sBirthday.replace(/-/g,"/"));
		if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())){		
			return false;
		}
		for(var i = 17;i>=0;i --)
			iSum += (Math.pow(2,i) % 11) * parseInt(strIDno.charAt(17 - i),11);
		if(iSum%11!=1){
			return false;
		}
	}
	else if(idCardLength==15){
		sBirthday = "19" + strIDno.substr(6,2) + "-" + Number(strIDno.substr(8,2)) + "-" + Number(strIDno.substr(10,2));
		var d = new Date(sBirthday.replace(/-/g,"/"));
		var dd = d.getFullYear().toString() + "-" + (d.getMonth()+1) + "-" + d.getDate();   
		if(sBirthday != dd){
			return false;
		}
	}
	return true; 
}
/**
 * 格式化金额
 * @param m 需要格式化的金额
 * @param n 格式化后输出位数，仅支持1~20位
 * @returns {string}
 */
function formatMoney(m, n) {
    n = n > 0 && n <= 20 ? n : 2;
    m = parseFloat((m + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var left = m.split(".")[0].split("").reverse(), right = m.split(".")[1];
    var t = "";
    for (i = 0; i < left.length; i++) {
        t += left[i] + ((i + 1) % 3 == 0 && (i + 1) != left.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + right;
}
/**
 *  还原已经格式化的金额
 * @param s
 * @returns {Number}
 */
function reFormatMoney(s) {
    return parseFloat(s.replace(/[^\d\.-]/g, ""));
}