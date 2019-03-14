'use strict';
$(function(){
	if(roleHandler){
		roleHandler.btnOperation=function(){
			var self=this;
			return {
				btnAdd:function(){
					$('#role_modal_title').text('添加角色');
					$('#btn_save').show();
					$('#btn_edit').hide();
		    		$('#role_modal').modal('show');
				},
				btnEdit:function(){
					var selectdatas = self.table.rows('.selecttr').data();
		    		if(selectdatas.length != 1){
		    			szr.Notify.warn('请选择一条数据',2);
		    			return;
		    		}
		    		$('#role_modal_title').text('编辑角色');
		    		$('#btn_save').hide();
					$('#btn_edit').show();
		    		var role = selectdatas[0];
		        	$('#role_id_m').val(role.id);
		    		$('#role_name_m').val(role.roleName);
		    		$('#description_m').val(role.description);
		    		$('#role_modal').modal('show');
		    		
				},
				btnDel:function(){
					var selectdatas = self.table.rows('.selecttr').data();
		    		if(selectdatas.length != 1){
		    			szr.Notify.warn('请选择一条数据',2);
		    			return;
		    		}
		    		var role = selectdatas[0];
		    		bootbox.setLocale("zh_CN");
			        bootbox.confirm("确定要删除该记录?", function (result) {
			            if (result) {
							$.blockUI({message: '<h5>正在删除...</h5>'});
							http.post(ctx + '/sys/role/delete/'+role.id,null,function(response){
								$.unblockUI();
		                    	if(response.statusCode != 200){
				        			szr.Notify.danger("删除失败，" + response.message + "！", 2);
				        			return;
		                        }
		                        szr.Notify.success("删除成功！", 2);
		                        self.table.ajax.reload();
							},function(error){
								
							});
			            }
					});
					
				},
				btnAuth:function(){
					var selectdatas = self.table.rows('.selecttr').data();
		    		if(selectdatas.length != 1){
		    			szr.Notify.warn('请选择角色',2);
		    			return;
		    		}
		    		var role = selectdatas[0];
					var roleId=role.id;
					var resourceIds=[];
					var ids=$('#resource_tree').jstree().get_selected(true);
					if(ids && ids.length>0){
						var list=new ArrayList();
						for(var i=0,len=ids.length;i<len;i++){
							var current=ids[i];
							list.add(current.id);
							var parents=current.parents;
							if(parents.length>0){
								for(var j=0,jlen=parents.length;j<jlen;j++){
									if(parents[j]!='#'){
										if(!list.contains(parents[j])){
											list.add(parents[j]);
										}									
									}
								}
							}
						}
						resourceIds=list.arr;
					}
					$.blockUI({message: '<h5>正在授权...</h5>'});
					http.post(ctx + '/sys/role/auth/'+roleId,{resourceIds:resourceIds},function(response){
						$.unblockUI();
						if(response.statusCode == 200) {
							szr.Notify.success('授权成功',2);
						} else {
							szr.Notify.danger("授权失败，" + response.message + "！", 2);
						}
						
					});
				}
			};
		}
	}
});