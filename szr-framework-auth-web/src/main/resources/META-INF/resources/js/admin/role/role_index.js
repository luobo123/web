'use strict';
var roleHandler={
	frm:null,
	error:null,
	table : null,
	result : null,
	init:function(){
		this.frm = $('#role_modal_frm');
		this.searchForm = $('#role_frm');
		this.result = $('#role_databable');
		this.table = this.dataTable();

		this.formValidate();
		this.btnBindClick();
	},
	dataTable : function() {
		var self = this;
		return self.result.DataTable({
            select:false,
	        ajax:{
                type:'post',
                url: ctx + '/sys/role/list',
                data: function (d) {
                	d.roleName=$('#role_name_s').val();
                }
            },
			columns : [ 
	           {  
	                data : null,  
	                bSortable : false,  
	                targets : 0,  
	                width : '20px',  
	                className:'text-center',
	                render : function(data, type, row, meta) {  
	                    var startIndex = meta.settings._iDisplayStart;  
	                    return startIndex + meta.row + 1;  
	                }  
	            },
			    { title : 'id', data : 'id',name : 'id',visible : false },
			    { title : '角色名称', data : 'roleName', name : 'roleName'},
			    { title : '描述', data : 'description', name : 'description'},
			    { title : '创建时间', data : 'createTime', name : 'createTime'}
			]
		});
	},
	initResourceTreeData:function(roleId){
		var self=this;
		http.get(ctx+'/sys/role/resource/'+roleId,null,function(response){
			var data=response.data;
			var treeData = [];
    		if(data && data.length>0){
    			for(var i = 0, l = data.length; i < l; i++) {
    				if(!data[i].parentId){
    					treeData.push($.formatTreeData(data[i]));    					
    				}
    			}    			
    		}
    	 	self.initResourceTree(treeData);
		});
	},
	initResourceTree:function(data){
		$('#resource_tree').jstree({
			core:{data:data}
		});
		$('#resource_tree').removeClass('hide');
	},
	
	btnBindClick:function(){
		var self=this;
		$('#btn_search').click(function(){
			self.table.ajax.reload();
		});
		
		$('#btn_reset').click(function(){
			self.searchForm[0].reset();
		});
		
		$('#btn_cancel').click(function(){
			$('#role_modal').modal('hide');
			$('label.validator-error').remove();
			$('.validator-error').removeClass('validator-error');
			self.frm[0].reset();
		});
	
		$('#role_databable tbody').on( 'click', 'tr', function () {
			// 获取选中行信息
			var row = self.table.row($(this));
			var roleData = row.data();
			if(!roleData){
				return;
			}
			$('.selecttr').removeClass('selecttr');
			$(this).addClass('selecttr');
			
			if($('#resource_tree').jstree(true)){
				$('#resource_tree').jstree(true).destroy(false);
			}
			self.initResourceTreeData(roleData.id);
		});
		
		$('#btn_save').click(function() {
			if (self.frm.valid()) {
		 		$.blockUI({message: '<h5>正在保存...</h5>'});
		 		http.post(ctx + '/sys/role/save',self.frm.serialize(),
					function(response){
			 			$.unblockUI();
			 			$('#role_modal').modal('hide');
			 			if(response.statusCode != 200){
			 				szr.Notify.danger('保存失败，' + response.message + '！', 2);
			 				return;
			 			}
			 			self.frm[0].reset();
			 			szr.Notify.success('保存成功！', 1);
			 			self.table.ajax.reload();
					}
		 		)
			}
		});
		
		$('#btn_edit').click(function() {
			if (self.frm.valid()) {
		 		$.blockUI({message: '<h5>正在保存...</h5>'});
		 		http.post(ctx + '/sys/role/edit/'+$('#role_id_m').val(),self.frm.serialize(),
					function(response){
			 			$.unblockUI();
			 			$('#role_modal').modal('hide');
			 			if(response.statusCode != 200){
			 				szr.Notify.danger('保存失败，' + response.message + '！', 2);
			 				return;
			 			}
			 			self.frm[0].reset();
			 			szr.Notify.success('保存成功！', 1);
			 			self.table.ajax.reload();
					}
		 		)
			}
		});
	},
	formValidate: function () {
        var self = this;
        self.validator = self.frm.validate({
            errorClass: 'validator-error', 
            errorPlacement: function (error, element) { 
            	var div = $(element).parent('div');
                error.appendTo(div);
            },
            focusInvalid: true, 
            ignore: ':hidden', 
            rules: {
            	roleName: {required:true,minlength:2,maxlength:20}
            },
            messages: {
            	roleName: {required:'请输入角色名称',minlength:'角色名称最少2个字符',maxlength:'角色名称最大20个字符'}
            }
        });
    }
};
$(function() {
	roleHandler.init();
});