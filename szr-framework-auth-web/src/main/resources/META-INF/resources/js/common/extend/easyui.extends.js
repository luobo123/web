'use strict';

var my = my || {};
var gridParams={
		fitColumns:false,
		striped:true,
		loadMsg:"数据正在加载中......",
		pagination:true,
		rownumbers:true,
		pageSize:10000,
		pageList:[10,20,30,40,50,100,1000,10000,100000],
		singleSelect:false,
		nowrap:true,
		pagePosition:"bottom",
		remoteSort:true
};

//初始化清除按钮
function initClear(target){
    var jq = $(target);
    var opts = jq.data('combo').options;
    var combo = jq.data('combo').combo;
    var arrow = combo.find('span.combo-arrow');
    
    var clear = arrow.siblings("span.combo-clear");
    if(clear.size()==0){
        //创建清除按钮。
        clear = $('<span class="combo-clear" style="height: 20px;"></span>');
        
        //清除按钮添加悬停效果。
        clear.unbind("mouseenter.combo mouseleave.combo").bind("mouseenter.combo mouseleave.combo",
            function(event){
                var isEnter = event.type=="mouseenter";
                clear[isEnter ? 'addClass' : 'removeClass']("combo-clear-hover");
            }
        );
        //清除按钮添加点击事件，清除当前选中值及隐藏选择面板。
        clear.unbind("click.combo").bind("click.combo",function(){
            jq.combo("setValue","").combo("setText","");
            jq.combo('hidePanel');
        });
        arrow.before(clear);
    };
    var input = combo.find("input.combo-text");
    input.outerWidth(input.outerWidth()-clear.outerWidth());
    
    opts.initClear = true;//已进行清除按钮初始化。
}

//扩展easyui combo添加清除当前值。
var oldResize = $.fn.combo.methods.resize;

$.extend($.fn.combo.methods,{
    initClear:function(jq){
        return jq.each(function(){
             initClear(this);
        });
    },
    resize:function(jq){
        //调用默认combo resize方法。
        var returnValue = oldResize.apply(this,arguments);
        var opts = jq.data("combo").options;
        if(opts.initClear){
            jq.combo("initClear",jq);
        }
        return returnValue;
    }
});
/**
 * 更改easyui加载panel时的提示文字
 * @requires jQuery,EasyUI
 */
$.extend($.fn.panel.defaults, {
	loadingMessage : '数据正在加载中......'
});

/**
 * 更改easyui加载grid时的提示文字
 * @requires jQuery,EasyUI
 */
$.extend($.fn.datagrid.defaults,gridParams);
$.extend($.fn.treegrid.defaults,gridParams);
/**
 * panel关闭时回收内存，主要用于layout使用iframe嵌入网页时的内存泄漏问题
 * @requires jQuery,EasyUI
 * 
 */
$.extend($.fn.panel.defaults, {
	onBeforeDestroy : function() {
		var frame = $('iframe', this);
		try {
			if (frame.length > 0) {
				for (var i = 0; i < frame.length; i++) {
					frame[i].src = '';
					frame[i].contentWindow.document.write('');
					frame[i].contentWindow.close();
				}
				frame.remove();
				if (navigator.userAgent.indexOf("MSIE") > 0) {// IE特有回收内存方法
					try {
						CollectGarbage();
					} catch (e) {
					}
				}
			}
		} catch (e) {
		}
	}
});

$.extend($.fn.datagrid.defaults,{
	onBeforeLoad:function(param){
		parent.$.messager.progress({title:"提示",msg:"数据正在加载中..."});
		return true;
	},
	onLoadSuccess:function(data){
		parent.$.messager.progress("close");
	   var tooltipObj=$(".note");
	   if(tooltipObj!=null&&tooltipObj!=undefined){
		   $(".note").tooltip({ 
			   deltaX:20,
			   onShow: function(){  
				   $(this).tooltip('tip').css({   
					   width:'300', 
					   boxShadow: '1px 1px 3px #292929'                          
				   });  
			   }
		   });		   
	   }
    },
    onLoadError:function(){
		parent.$.messager.progress("close");
	},
	onAfterRender:function(target){
		parent.$.messager.progress("close");
	}
});
/**
 * 防止panel/window/dialog组件超出浏览器边界
 * @requires jQuery,EasyUI
 */
my.onMove = {
	onMove : function(left, top) {
		var l = left;
		var t = top;
		if (l < 1) {
			l = 1;
		}
		if (t < 1) {
			t = 1;
		}
		var width = parseInt($(this).parent().css('width')) + 14;
		var height = parseInt($(this).parent().css('height')) + 14;
		var right = l + width;
		var buttom = t + height;
		var browserWidth = $(window).width();
		var browserHeight = $(window).height();
		if (right > browserWidth) {
			l = browserWidth - width;
		}
		if (buttom > browserHeight) {
			t = browserHeight - height;
		}
		$(this).parent().css({/* 修正面板位置 */
			left : l,
			top : t
		});
	}
};
$.extend($.fn.dialog.defaults,my.onMove);
$.extend($.fn.window.defaults,my.onMove);
$.extend($.fn.panel.defaults,my.onMove);

/**
 * 
 * 通用错误提示
 * 用于datagrid/treegrid/tree/combogrid/combobox/form加载数据出错时的操作
 * @requires jQuery,EasyUI
 */
my.onLoadError = {
	onLoadError : function(XMLHttpRequest) {
		if (parent.$ && parent.$.messager) {
			parent.$.messager.progress('close');
			parent.$.messager.alert('错误', XMLHttpRequest.responseText);
		} else {
			$.messager.progress('close');
			$.messager.alert('错误', XMLHttpRequest.responseText);
		}
	}
};
$.extend($.fn.datagrid.defaults,my.onLoadError);
$.extend($.fn.treegrid.defaults,my.onLoadError);
$.extend($.fn.tree.defaults,my.onLoadError);
$.extend($.fn.combogrid.defaults,my.onLoadError);
$.extend($.fn.combobox.defaults,my.onLoadError);
$.extend($.fn.form.defaults,my.onLoadError);
$.extend($.fn.dialog.defaults,my.onLoadError);

/**
 * 扩展combobox在自动补全模式时，检查用户输入的字符是否存在于下拉框中，如果不存在则清空用户输入
 * @requires jQuery,EasyUI
 */
$.extend($.fn.combobox.defaults, {
	onShowPanel : function() {
		var _options = $(this).combobox('options');
		if (_options.mode == 'remote') {/* 如果是自动补全模式 */
			var _value = $(this).combobox('textbox').val();
			var _combobox = $(this);
			if (_value.length > 0) {
				$.post(_options.url, {
					q : _value
				}, function(result) {
					if (result && result.length > 0) {
						_combobox.combobox('loadData', result);
					}
				}, 'json');
			}
		}
	},
	onHidePanel : function() {
		var _options = $(this).combobox('options');
		if (_options.mode == 'remote') {/* 如果是自动补全模式 */
			var _data = $(this).combobox('getData');/* 下拉框所有选项 */
			var _value = $(this).combobox('getValue');/* 用户输入的值 */
			var _b = false;/* 标识是否在下拉列表中找到了用户输入的字符 */
			for (var i = 0; i < _data.length; i++) {
				if (_data[i][_options.valueField] == _value) {
					_b = true;
				}
			}
			if (!_b) {/* 如果在下拉列表中没找到用户输入的字符 */
				$(this).combobox('setValue', '');
			}
		}
	}
});

/**
 * 扩展combogrid在自动补全模式时，检查用户输入的字符是否存在于下拉框中，如果不存在则清空用户输入
 * @requires jQuery,EasyUI
 */
$.extend($.fn.combogrid.defaults, {
	onShowPanel : function() {
		var _options = $(this).combogrid('options');
		if (_options.mode == 'remote') {/* 如果是自动补全模式 */
			var _value = $(this).combogrid('textbox').val();
			if (_value.length > 0) {
				$(this).combogrid('grid').datagrid("load", {
					q : _value
				});
			}
		}
	},
	onHidePanel : function() {
		var _options = $(this).combogrid('options');
		if (_options.mode == 'remote') {/* 如果是自动补全模式 */
			var _data = $(this).combogrid('grid').datagrid('getData').rows;/* 下拉框所有选项 */
			var _value = $(this).combogrid('getValue');/* 用户输入的值 */
			var _b = false;/* 标识是否在下拉列表中找到了用户输入的字符 */
			for (var i = 0; i < _data.length; i++) {
				if (_data[i][_options.idField] == _value) {
					_b = true;
				}
			}
			if (!_b) {/* 如果在下拉列表中没找到用户输入的字符 */
				$(this).combogrid('setValue', '');
			}
		}
	}
});


/**
 * 扩展validatebox，添加新的验证功能
 * @requires jQuery,EasyUI
 */
$.extend($.fn.validatebox.defaults.rules, {
	eqPwd : {/* 验证两次密码是否一致功能 */
		validator : function(value, param) {
			return value == $(param[0]).val();
		},
		message : '密码不一致！'
	}
});

/**
 * 扩展tree和combotree，使其支持平滑数据格式
 * @requires jQuery,EasyUI
 * 
 */
my.loadFilter = {
	loadFilter : function(data, parent) {
		var opt = $(this).data().tree.options;
		var idField, textField, parentField;
		if (opt.parentField) {
			idField = opt.idField || 'id';
			textField = opt.textField || 'text';
			parentField = opt.parentField || 'pid';
			var i, l, treeData = [], tmpMap = [];
			for (i = 0, l = data.length; i < l; i++) {
				tmpMap[data[i][idField]] = data[i];
			}
			for (i = 0, l = data.length; i < l; i++) {
				if (tmpMap[data[i][parentField]] && data[i][idField] != data[i][parentField]) {
					if (!tmpMap[data[i][parentField]]['children'])
						tmpMap[data[i][parentField]]['children'] = [];
					data[i]['text'] = data[i][textField];
					tmpMap[data[i][parentField]]['children'].push(data[i]);
				} else {
					data[i]['text'] = data[i][textField];
					treeData.push(data[i]);
				}
			}
			return treeData;
		}
		return data;
	}
};
$.extend($.fn.combotree.defaults,my.loadFilter);
$.extend($.fn.tree.defaults,my.loadFilter);

/**
 * 扩展treegrid，使其支持平滑数据格式
 * @requires jQuery,EasyUI
 */
$.extend($.fn.treegrid.defaults, {
	onBeforeLoad:function(param){
		parent.$.messager.progress({title:"提示",msg:"数据正在加载中..."});
		return true;
	},
	onLoadSuccess:function(data){
		parent.$.messager.progress("close");
	},
	onLoadError:function(){
		parent.$.messager.progress("close");
	},
	loadFilter : function(data, parentId) {
		var opt = $(this).data().treegrid.options;
		var idField, treeField, parentField;
		if (opt.parentField) {
			idField = opt.idField || 'id';
			treeField = opt.textField || 'text';
			parentField = opt.parentField || 'pid';
			var i, l, treeData = [], tmpMap = [];
			for (i = 0, l = data.length; i < l; i++) {
				tmpMap[data[i][idField]] = data[i];
			}
			for (i = 0, l = data.length; i < l; i++) {
				if (tmpMap[data[i][parentField]] && data[i][idField] != data[i][parentField]) {
					if (!tmpMap[data[i][parentField]]['children'])
						tmpMap[data[i][parentField]]['children'] = [];
					data[i]['text'] = data[i][treeField];
					tmpMap[data[i][parentField]]['children'].push(data[i]);
				} else {
					data[i]['text'] = data[i][treeField];
					treeData.push(data[i]);
				}
			}
			return treeData;
		}
		return data;
	}
});

/**
 * 创建一个模式化的dialog
 * @requires jQuery,EasyUI
 * 
 */
my.modalDialog = function(options) {
	var opts = $.extend({
		title : '',
		width : 640,
		height : 480,
		modal : true,
		cache: false,
		onClose : function() {
			$(this).dialog('destroy');
		}
	}, options);
	opts.modal = true;// 强制此dialog为模式化，无视传递过来的modal参数
	if (options.url) {
		opts.content = '<iframe src="' + options.url + '" allowTransparency="true" scrolling="auto" name="centerIframe" id="centerIframe" width="100%" height="98%" frameBorder="0" name=""></iframe>';
	}
	return $('<div></div>').dialog(opts);
};

/**
 * 等同于原form的load方法，但是这个方法支持{data:{name:''}}形式的对象赋值
 */
$.extend($.fn.form.methods, {
	loadData : function(jq, data) {
		return jq.each(function() {
			load(this, data);
		});

		function load(target, data) {
			if (!$.data(target, 'form')) {
				$.data(target, 'form', {
					options : $.extend({}, $.fn.form.defaults)
				});
			}
			var opts = $.data(target, 'form').options;

			if (typeof data == 'string') {
				var param = {};
				if (opts.onBeforeLoad.call(target, param) == false)
					return;

				$.ajax({
					url : data,
					data : param,
					dataType : 'json',
					success : function(data) {
						_load(data);
					},
					error : function() {
						opts.onLoadError.apply(target, arguments);
					}
				});
			} else {
				_load(data);
			}
			function _load(data) {
				var form = $(target);
				var formFields = form.find("input[name],select[name],textarea[name]");
				formFields.each(function() {
					var name = this.name;
					var value = jQuery.proxy(function() {
						try {
							return eval('this.' + name);
						} catch (e) {
							return "";
						}
					}, data)();
					var rr = _checkField(name, value);
					if (!rr.length) {
						var f = form.find("input[numberboxName=\"" + name + "\"]");
						if (f.length) {
							f.numberbox("setValue", value);
						} else {
							$("input[name=\"" + name + "\"]", form).val(value);
							$("textarea[name=\"" + name + "\"]", form).val(value);
							$("select[name=\"" + name + "\"]", form).val(value);
						}
					}
					_loadCombo(name, value);
				});
				opts.onLoadSuccess.call(target, data);
				$(target).form("validate");
			}

			function _checkField(name, val) {
				var rr = $(target).find('input[name="' + name + '"][type=radio], input[name="' + name + '"][type=checkbox]');
				rr._propAttr('checked', false);
				rr.each(function() {
					var f = $(this);
					if (f.val() == String(val) || $.inArray(f.val(), val) >= 0) {
						f._propAttr('checked', true);
					}
				});
				return rr;
			}

			function _loadCombo(name, val) {
				var form = $(target);
				var cc = [ 'combobox', 'combotree', 'combogrid', 'datetimebox', 'datebox', 'combo' ];
				var c = form.find('[comboName="' + name + '"]');
				if (c.length) {
					for (var i = 0; i < cc.length; i++) {
						var type = cc[i];
						if (c.hasClass(type + '-f')) {
							if (c[type]('options').multiple) {
								c[type]('setValues', val);
							} else {
								c[type]('setValue', val);
							}
							return;
						}
					}
				}
			}
		}
	}
});

/**
 * 更换主题
 * @requires jQuery,EasyUI
 * @param themeName
 */
my.changeTheme = function(themeName) {
	var $easyuiTheme = $('#easyuiTheme');
	var url = $easyuiTheme.attr('href');
	var href = url.substring(0, url.indexOf('themes')) + 'themes/' + themeName + '/easyui.css';
	$easyuiTheme.attr('href', href);

	var $iframe = $('iframe');
	if ($iframe.length > 0) {
		for (var i = 0; i < $iframe.length; i++) {
			var ifr = $iframe[i];
			try {
				$(ifr).contents().find('#easyuiTheme').attr('href', href);
			} catch (e) {
				try {
					ifr.contentWindow.document.getElementById('easyuiTheme').href = href;
				} catch (e) {
				}
			}
		}
	}

	my.cookie('easyuiTheme', themeName, {
		expires : 7
	});
};

/**
 * 滚动条
 * @requires jQuery,EasyUI
 */
my.progressBar = function(options) {
	if (typeof options == 'string') {
		if (options == 'close') {
			$('#syProgressBarDiv').dialog('destroy');
		}
	} else {
		if ($('#syProgressBarDiv').length < 1) {
			var opts = $.extend({
				title : '&nbsp;',
				closable : false,
				width : 300,
				height : 60,
				modal : true,
				content : '<div id="syProgressBar" class="easyui-progressbar" data-options="value:0"></div>'
			}, options);
			$('<div id="syProgressBarDiv"/>').dialog(opts);
			$.parser.parse('#syProgressBarDiv');
		} else {
			$('#syProgressBarDiv').dialog('open');
		}
		if (options.value) {
			$('#syProgressBar').progressbar('setValue', options.value);
		}
	}
};

/**
 * 将字符串参数转换成果断对象
 * 例:id=1&name=zhangsan&age=13
 * 返回:{"id":"1","name":"zhangsan","age":"13"}
 */

my.transParamToJson=function(str){
	if(str==null||str==""){
		return {};
	}else{
		var paramArr=str.split("&");
		var keyValueArr=[];
		var result="{";
		for(var i=0,len=paramArr.length;i<len;i++){
			keyValueArr=paramArr[i].split("=");
			result+="\""+keyValueArr[0]+"\":\""+keyValueArr[1]+"\",";
		}
		result=result.length>1?result.substring(0,result.length-1):result;
		result+="}";
		return $.parseJSON(result);
	}
};

/**
 * 去字符串空格
 */
my.trim = function(str) {
	return str.replace(/(^\s*)|(\s*$)/g, '');
};
my.ltrim = function(str) {
	return str.replace(/(^\s*)/g, '');
};
my.rtrim = function(str) {
	return str.replace(/(\s*$)/g, '');
};

/**
 * 判断开始字符是否是XX
 */
my.startWith = function(source, str) {
	var reg = new RegExp("^" + str);
	return reg.test(source);
};
/**
 * 判断结束字符是否是XX
 */
my.endWith = function(source, str) {
	var reg = new RegExp(str + "$");
	return reg.test(source);
};

/**
 * iframe自适应高度
 * @param iframe
 */
my.autoIframeHeight = function(iframe) {
	iframe.style.height = iframe.contentWindow.document.body.scrollHeight + "px";
};

/**
 * 设置iframe高度
 * @param iframe
 */
my.setIframeHeight = function(iframe, height) {
	iframe.height = height;
};

/**
 * 设置iframe高度
 * @param iframe
 */
my.setIframeWidth = function(iframe, width) {
	iframe.width = width;
};

/* 
 * 定义图标样式的数组
 */
my.iconData=[
              {value:'',text : '默认'},
              {value : 'icon-search',text : 'icon-search'},
              {value : 'icon-add',text : 'icon-add'},
              {value : 'icon-adds',text : 'icon-adds'},
              {value : 'icon-edit',text : 'icon-edit'},
              {value : 'icon-ok',text : 'icon-ok'},
              {value : 'icon-remove',text : 'icon-remove'},
              {value : 'icon-cancel',text : 'icon-cancel'},
              {value : 'icon-tip',text : 'icon-tip'},
              {value : 'icon-back',text : 'icon-back'},
              {value : 'icon-undo',text : 'icon-undo'},
              {value : 'icon-save',text : 'icon-save'},
              {value : 'icon-config',text : 'icon-config'},
              {value : 'icon-comp',text : 'icon-comp'},
              {value : 'icon-sys',text : 'icon-sys'},
              {value : 'icon-db',text : 'icon-db'},
              {value : 'icon-pro',text : 'icon-pro'},
              {value : 'icon-role',text : 'icon-role'},
              {value : 'icon-end',text : 'icon-end'},
              {value : 'icon-bug',text : 'icon-bug'},
              {value : 'icon-badd',text : 'icon-badd'},
              {value : 'icon-bedit',text : 'icon-bedit'},
              {value : 'icon-bdel',text : 'icon-bdel'},
              {value : 'icon-item',text : 'icon-item'},
              {value : 'icon-excel',text : 'icon-excel'},
              {value : 'icon-auto',text : 'icon-auto'},
              {value : 'icon-time',text : 'icon-time'}
              ];
