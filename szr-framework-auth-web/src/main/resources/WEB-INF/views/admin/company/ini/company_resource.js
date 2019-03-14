'use strict';
var companyResourceHandler = {
	frm : null,
	error : null,
	table : null,
	result : null,
	searchForm: null,
	modalForm: null,
	org : null,
	init : function() {
		this.searchForm = $('#org_frm');
		this.result = $('#company_databable');
		this.table = this.dataTable();
		this.btnBindClick();
		//this.initResourceTreeData(null);
	},
	
	dataTable : function() {
		var self = this;
		return self.result.DataTable({
            select:false,
	        ajax:{
                type:'get',
                url: ctx + '/company/resource/page',
                data: function (d) {
                	d.orgCode = $("#org_code_s").val();
                	d.orgName = $("#org_name_s").val();
                }
            },
			columns : [ 
	           {  
	                data : null,  
	                bSortable : false,  
	                targets : 0,  
	                width : "20px", 
	                className:'text-center',
	                render : function(data, type, row, meta) {  
	                    var startIndex = meta.settings._iDisplayStart;  
	                    return startIndex + meta.row + 1;  
	                }  
	            },
			    { title : 'id', data : 'id',name : 'id',visible : false },
			    { title : '公司名称', data : 'orgName', name : 'orgName' },
			    { title : '公司编码', data : 'orgCode', name : 'orgCode'},
			    { title : '是否有效', data : 'enabled', name : 'enabled', className:'text-center',
			    	render: function ( data, type, row, meta ) {
			    		return getBooleanText(data);
			    	}
			    }
			]
		});
	},
	btnBindClick:function(){
		var self=this;
		$("#btn_search").click(function(){
			self.table.ajax.reload();
		});
		
		$("#btn_reset").click(function(){
			self.searchForm[0].reset();
		});
		
		$('#company_databable tbody').on( 'click', 'tr', function () {
			$(".selecttr").removeClass("selecttr");
			$(this).addClass("selecttr");
			var row = self.table.row($(this));
			var data = row.data();
			if($('#resource_tree').jstree(true)){
				$('#resource_tree').jstree(true).destroy(false);
			}
			self.initResourceTreeData(data.id);
		});
		
		/*$('#company_databable tbody').on( 'dblclick', 'tr', function () {
			
		});*/
	},
	initResourceTreeData:function(id){
		var self=this;
		http.get(ctx+'/org/resource/'+id,null,function(response){
			var data=response.data;
			if(data){
				var treeData = [];
	    		if(data && data.length>0){
	    			for(var i = 0, l = data.length; i < l; i++) {
	    				if(!data[i].parentId){
	    					treeData.push($.formatTreeData(data[i]));    					
	    				}
	    			}    			
	    		}
	    	 	self.initResourceTree(treeData);
			}
		});
	},
	initResourceTree:function(data){
		$('#resource_tree').jstree({
			core:{data:data}
		});
		$('#resource_tree').removeClass('hide');
	},
	btnAuth : function() {
		var self = this;
		var selected = self.table.row($(".selecttr"));
		if (selected && selected.length != 1) {
			szr.Notify.warn('请选择机构', 2);
			return;
		}
		var selectId = selected.data().id;
		var resourceIds = [];
		var unResourceIds = [];
		var unselectObj = $('li[role="treeitem"][aria-selected="false"]');
		
		if (unselectObj && unselectObj.length > 0) {
			for (var i = 0, len = unselectObj.length; i < len; i++) {
				var current = unselectObj[i];
				unResourceIds.push(current.id);
			}
		}

		var ids = $('#resource_tree').jstree().get_selected(true);
		if (ids && ids.length > 0) {
			var list = new ArrayList();
			for (var i = 0, len = ids.length; i < len; i++) {
				var current = ids[i];
				if(!list.contains(current.id)) {
					list.add(current.id);
				} else {
					continue;
				}
				
				var parents = current.parents;
				if (parents.length > 0) {
					for (var j = 0, jlen = parents.length; j < jlen; j++) {
						var id = parents[j];
						if (id != '#') {
							if (!list.contains(id)) {
								list.add(parents[j]);
							}
							var index = -1;
							if((index = unResourceIds.indexOf(id)) != -1) {
								unResourceIds.splice(index, 1);
							}
						}
					}
				}
			}
			resourceIds = list.arr;
		}
		$.blockUI({
			message : '<h5>正在授权...</h5>'
		});
		http.post(ctx + '/org/auth/' + selectId, {
			resourceIds : resourceIds,
			unResourceIds : unResourceIds
		}, function(response) {
			$.unblockUI();
			if(response.statusCode == 200) {
				szr.Notify.success("授权成功！", 2);
			} else {
				szr.Notify.danger("授权失败，" + response.message + "！", 2);
			}
		});
	},
	
};

$(function() {
	companyResourceHandler.init();
});