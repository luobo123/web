var DIC_REPAY_MODE = 'REPAY_MODE';

var DIC_FEE_NAME = 'FEE_NAME';
var FEE_NAME_CAPITAL = "001";
var FEE_NAME_INTEREST = "002";

var DIC_FEE_TYPE = 'FEE_TYPE';
var FEE_TYPE_CAPITAL = "001";
var FEE_TYPE_INTEREST = "002";

var DIC_REPAY_TYPE = 'REPAY_TYPE';
var REPAY_TYPE_NORMAL = '001';
var REPAY_TYPE_EXTEND = '002';
var REPAY_TYPE_FORCE_SETTLE = '003';
var REPAY_TYPE_EARLY_SETTLE = '004';
var REPAY_TYPE_OVERDUE = 'overdue';
var REPAY_TYPE_NONE = 'none';

var DIC_BUSI_TYPE = 'BUSI_TYPE';
var BUSI_TYPE_EARLY_SETTLEMENT = '005';
var BUSI_TYPE_ACCOUNT_EXTEND = '007';
var BUSI_TYPE_FORCE_SETTLEMENT = '008';
var BUSI_TYPE_PART_EARLY_REPAY = '012';

//dictionary operate
var OVERDUE_REPAY_TYPE = "OVERDUE_REPAY_TYPE";
var SUPPORT_BUSI_TYPE = "SUPPORT_BUSI_TYPE";
function getDictionary(dictCode, companyId) {
	var result = null;
	$.ajax({
		type : 'GET',
		async : false,
		url : ctx + '/dictionary/select/' + dictCode,
		data : {
			companyId : companyId
		},
		success : function(data) {
			result = data.data;
		}
	});
	
	return result;
}

function getDictionaryOperate(dicOperateCode, companyId) {
	var result = null;
	$.ajax({
		type : 'GET',
		async : false,
		url : ctx + '/dictionaryOperate/select/' + dicOperateCode,
		data : {
			companyId : companyId
		},
		success : function(data) {
			result = data.data;
		}
	});
	
	return result;
}

function getDictionaryItemValue(dictCode, companyId, itemKey) {
	var value = '';
	$.ajax({
		type : 'GET',
		async : false,
		url : ctx + '/dictionary/select/' + dictCode + '/' + itemKey,
		data : {
			companyId : companyId
		},
		success : function(data) {
			if(data != null) {
				value = data.data;
			}
		}
	});
	
	return value;
}

function getDictNameByCode(itemKey, dictCode) {
	return getDictionaryItemValue(dictCode, userCompanyId, itemKey);
};