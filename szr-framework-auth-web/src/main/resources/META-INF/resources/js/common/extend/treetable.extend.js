$(document).ready(function(){
	$.extend($.fn.treetable.defaults,{
		expandable:true,
	    indent:20,
	    clickableNodeNames:true,
	    indenterTemplate:'<span class="indenter"></span>',
	    expanderTemplate:'<a class="glyphicon glyphicon-plus font-green"></a>',
	    expandedClass:'glyphicon glyphicon-plus font-green',
	    collapsedClass:'glyphicon glyphicon-minus font-green',
	    childClass:'fa fa-file-o',
	    multiSelecte:false,
	    onlySelectChildren:false,
	    onSelected:function(){
	    	var multiSelecte=this.treetable.defaults.multiSelecte;
	    	var onlySelectChildren=this.treetable.defaults.onlySelectChildren;
	    	$(this).on('mousedown','tbody > tr', function() {
	    		var isBranch=$(this).data('tt-branch');
	    		if(!multiSelecte){
    				$('.selected').not(this).removeClass('selected');
    			}
	    		if(onlySelectChildren){
	    			if(isBranch){
	    				return;
	    			}
	    		}
	    		$(this).toggleClass('selected');
			});
	    }
	});
	$.extend(TreeTable.Tree.prototype,{
		loadThead:function(){
		    	var columns = this.settings.columns;
		    	if(columns && columns.length > 0){
		    		var theads ='<thead>';
		    		theads+='<tr role="row">';
		    		$.each(columns,function(i,column){
		    			theads+='<td class="'+(column.className?column.className:'')+'">'+column.title+'</td>';
		    		});
		    		theads+='</tr>';
		    		theads+='</thead>';
		    		$(this.table).append(theads);    		
		    	}
		},
		data:null,
		put:function(id,value){
			if(!this.data){
				this.data=new Map();
			}
			if(this.data.containsKey(id)){
				return;		
			}
			this.data.put(id,value);
		},
		get:function(id){
			if(!this.data){
				this.data.get(id);
			}else{
				return null;
			}
		}
	});
});