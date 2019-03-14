$(document).ready(function(){
	/*
	$.extend($.jstree.defaults.core,{
		'multiple':true,
		'strings' : {
			'Loading ...' : '正在加载...'
	    }
	});
	*/
	$.extend($.jstree.defaults.checkbox,{
		'keep_selected_style':false
	});
	$.extend($.jstree.defaults.plugins,['checkbox','types']);
	$.extend({
		formatTreeData:function(data){
			var children = data.childs || data.children;
			var newData= {
				id:data.id,
				data:data,
				text:data.name,
				state:{selected:(data.isSelected == 'true' && children.length == 0), opened:true},
				children:children
			};
			if(children && children.length > 0){
				var newChildren = [];
				for(var i = 0,len = children.length; i < len; i++){
					newChildren.push(this.formatTreeData(children[i]));
				}
				newData.children = newChildren;
			}
			return newData;
		}
	});
});