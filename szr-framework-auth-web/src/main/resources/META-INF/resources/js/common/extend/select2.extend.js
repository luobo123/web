function initObjectSelect2(selector, options, queryParams) {
	if(options.url) {
		var query = {companyId : userCompanyId};
		if(queryParams != null) {
			query = Object.assign(query, queryParams);
		}
		$.ajax({
			type : 'GET',
			url : options.url,
			async : false,
			dataType : 'json',
			data : query
		}).then(function(data) {
			var allowClear = true;
			if(options.allowClear != null) {
				allowClear = options.allowClear;
			}
			
			selector.select2({
				data : data.data,
				language : "zh-CN", //指定语言为中文
				allowClear : allowClear,
				tags : true,
				minimumResultsForSearch : -1,
				
				escapeMarkup : function(markup) {
					return markup;
				}// let our custom formatter work
				//minimumInputLength : 1
			});
			selector.val(options.initValue).trigger('change');
			//selector.val(options.initValue).select2({allowClear: allowClear});
		});
	}
}

function initAjaxSelect2(selector, params) {
	selector.each(function() {
		var item = $(this);
		if(item.data('url')) {
			initObjectSelect2(item, {
				url : item.data('url'),
				initValue : item.data('value')
			}, params);
		}
	});
}

/*function initObjectSelect2(selector, queryParams, initValue) {
	selector.select2({
		language : "zh-CN", //指定语言为中文
		allowClear : true,
		tags : true,
		minimumResultsForSearch : -1,
		ajax : {
			dataType : 'json',
			delay : 250,
			data : function(params) {
				var query = {
					companyId : userCompanyId	//用户公司ID
					//page : pages.page,	//第几页
					//rows : 10	//每页显示行数
				}
				
				if(queryParams != null) {
					query = Object.assign(query, queryParams);
				}
				
				return query;
			},
			processResults : function(data, params) {
				//params.page = params.page || 1;
				data = data.data;
				return {
					results : data
					//pagination: {
					//	more : params.page < data.total
					//}
				}
			},
			cache : true
		}, 
		escapeMarkup : function(markup) {
			return markup;
		}// let our custom formatter work
		//minimumInputLength : 1
	});
	selector.val(initValue).trigger('change');
}*/

function initDictionarySelect2(selector, dictCode, companyId, initValue, options) {
	var results = [];
	var data = getDictionary(dictCode, companyId);
	if (data != null) {
		$.each(data, function(index, val) {
			results.push({
				id : val.itemKey,
				text : val.itemValue
			});
		});
	}
	initSelect2(selector, results, initValue, options);
	
	return results;
}

function initDictOperateSelect2(selector, operateCode, companyId, initValue, options) {
	var results = [];
	var data = getDictionaryOperate(operateCode, companyId);
	if (data != null) {
		$.each(data, function(index, val) {
			results.push({
				id : val.itemKey,
				text : val.itemValue
			});
		});
	}
	initSelect2(selector, results, initValue, options);
	
	return results;
}

function initEnumSelect2(selector, data, initValue, options) {
	if(data != null) {
		$.map(data, function(obj) {
			obj.id = obj.id || obj.itemKey;
			obj.text = obj.text || obj.itemValue;
			return obj;
		});
		initSelect2(selector, data, initValue, options);
	}
}

function initBooleanSelect2(selector, initValue, options) {
	var enabledata = [{id:'true', text: "是"},{ id:"false",text: "否"}];
	initSelect2(selector, enabledata, String(initValue), options);
	return enabledata;
}

function initSelect2(selector, data, initValue, options) {
	var allowClear = true;
	if(options && options.allowClear != null) {
		allowClear = options.allowClear;
	}
	selector.select2({
		allowClear : allowClear,
		tags : true,
		minimumResultsForSearch : -1,
		data : data,
		escapeMarkup : function(markup) {
			return markup;
		}// let our custom formatter work
		//minimumInputLength : 1
	});
	selector.val(initValue).trigger('change');
	//selector.val(initValue).select2({allowClear: allowClear});
}

$(document).ready(function(){
	$.extend($.fn.select2.defaults.defaults,{
		theme:'bootstrap',
		width:"style",//element,style,resolve
		language:'zh_CN'
	});
});

