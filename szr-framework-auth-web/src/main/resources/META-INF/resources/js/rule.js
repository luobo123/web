$(function(){
	$.validator.addMethod("validName", function(value, element) {
		var reg =  /^([a-zA-Z\u4e00-\u9fa5. ]){0,}$/;
		return this.optional(element) || reg.test(value);
	}, "请输入正确的姓名格式（字母、汉字、空格和“.”）");
	
	$.validator.addMethod("isMobile", function(value, element) {
		var reg = /^0?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/; 
        return this.optional(element) || reg.test(value);
	}, "请输入正确的手机号码.");
	
	$.validator.addMethod("pattern_a", function(value, element) {
		var pattern = /^\w+$/;
		return this.optional(element) || pattern.test(value);
	}, "请输入字母、数字或下划线。");
	
	$.validator.addMethod("isIdNo", function(value, element) {
		if(this.optional(element)) {
			return true;
		}
		
		var num = value.toUpperCase();
		if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
			return false;
		}
		
		var len, re;
		len = num.length;
		if (len == 18) {
			re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
			var arrSplit = num.match(re);

			// 检查生日日期是否正确
			var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/"
					+ arrSplit[4]);
			var bGoodDay;
			bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2]))
					&& ((dtmBirth.getMonth() + 1) == Number(arrSplit[3]))
					&& (dtmBirth.getDate() == Number(arrSplit[4]));
			if (!bGoodDay) {
				return false;
			} else {
				/* 检验18位身份证的校验码是否正确。
				 * 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
				*/
				var valnum;
				var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5,
						8, 4, 2);
				var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4',
						'3', '2');
				var nTemp = 0, i;
				for (i = 0; i < 17; i++) {
					nTemp += num.substr(i, 1) * arrInt[i];
				}
				valnum = arrCh[nTemp % 11];
				if (valnum != num.substr(17, 1)) {
					return false;
				}
				return true;
			}
		}
		
		return false;
		
	}, "请输入正确的身份证号码.");
	
	$.validator.addMethod("isPassportNo", function(value, element) {
		var reg = /^(P\d{7})|(G\d{8})$/;
		return this.optional(element) || reg.test(value);
	}, "请输入正确的护照号.");
})