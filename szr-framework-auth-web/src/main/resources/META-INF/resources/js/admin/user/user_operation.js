'use strict';
$(function(){
if(userHandler){
	userHandler.btnOperation=function(){
		var self=this;
		return {
			btnAdd:function(){
				var ref = $('#org_tree').jstree(true);
				var sel = ref.get_selected();
				if(!sel.length) { 
					szr.Notify.warn('请选择机构',2);
					return false; 
				}
				$("#role_m-error").attr("visible", false);
				var seldata = ref.get_selected(true)[0].data;
				$('#org_id_m').val(seldata.id);
				$('#org_name_m').val(seldata.orgName);
				
				$('#roleIds').select2('val',null);
				$('#user_password_frm_group').show();
				$('#user_modal_title').text('新增用户');
				$('#btn_save').show();
				$('#btn_edit').hide();
				$('#user_id_m').val('');
	    		$('#user_modal').modal('show');
	    	},
	    	btnEdit:function(){
	    		var selectdatas = self.table.rows('.selected').data();
	    		if(selectdatas.length != 1){
	    			szr.Notify.warn('请选择一条数据',2);
	    			return;
	    		}
	    		debugger;
	    		$("#role_m-error").attr("visible", true);
	    		var user = selectdatas[0];
	    		var roleIds=[];
	    		$.each(user.roles,function(index,role){
	    			roleIds.push(role.id);
	    		});
	        	var selected = $('#org_tree').jstree(true).get_selected(true);
	        	var data = selected[0].data;
	        	$('#user_modal_frm').loadData(user);
	        	$('#org_id_m').val(data.id);
	        	$('#org_name_m').val(data.orgName);
	    		$('#roleIds').select2('val',roleIds);
	    		
	    		$('#user_modal_title').text('编辑用户');
	    		$('#btn_save').hide();
				$('#btn_edit').show();
	    		$('#user_modal').modal('show');
	    	},
	    	btnDel:function(e,dt,node,config){
	    		var datas = self.table.rows('.selected').data();
	    		if(datas.length == 0){
	    			szr.Notify.warn('请选择一条数据',2);
	    			return;
	    		}
	    		bootbox.setLocale("zh_CN");
		        bootbox.confirm("确定要删除选择的记录?", function (result) {
		            if (result) {
						$.blockUI({message: '<h5>正在删除信息...</h5>'});
						$('#modal-del').modal('hide');
						var userIds=[];
						for(var i=0,len=datas.length;i<len;i++){
							userIds.push(datas[i].id);
						}
						http.post(ctx+'/sys/user/delete',{userIds:userIds},function(response){
							$.unblockUI();
							if(response.statusCode == '200') {
								szr.Notify.success("删除成功！", 2);
								self.table.ajax.reload();
							} else {
								szr.Notify.danger("删除失败，" + response.message + "！", 2);
							}
						});	
		            }
				});
	    	}
		};
	};
}
});