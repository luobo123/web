'use strict';
$(function(){
	if(orgHandler){
		orgHandler.btnOperation=function(){
			var self=this;
			return {
				btnAdd:function(){
					var ref = $('#org_tree').jstree(true);
					if(!ref){
						return;
					}
					var sel = ref.get_selected();
					if(!sel.length) { 
						szr.Notify.warn('请选择机构',2);
						return; 
					}
					var data = ref.get_selected(true);
					if(!data[0].data){
						szr.Notify.warn('请先保存',2);
						return;
					}
					var newId = ref.create_node(data[0].id,{text:'添加新机构'});
					ref.deselect_node(data[0]);
					ref.open_node(data[0]);
					ref.select_node(newId);
					$('#parentId').val(data[0].data.id);
					$('#parentName').val(data[0].data.orgName);
					$('#orgName').focus();
				},
				btnDel:function(){
					var ref = $('#org_tree').jstree(true);
					if(!ref){
						return;
					}
					var sel = ref.get_selected();
					if(!sel.length) { 
						szr.Notify.warn('请选择机构',2);
						return false; 
					}
					var selected = ref.get_selected(true);
					if('j1_1' == selected[0].id){
						szr.Notify.warn('总公司不能被删除',2);
						return false; 
					}
					if(!selected[0].data){
						ref.delete_node(sel);
						return;
					}
					var selectId=selected[0].data.id;
					bootbox.setLocale('zh_CN');
			        bootbox.confirm('确定要删除该记录?', function (result) {
			            if (result) {
							$('#modal-del').modal('hide');
							$.blockUI({message: '<h5>正在删除信息...</h5>'});
							http.post(ctx + '/sys/org/delete/'+selectId,null,function(response){
								$.unblockUI();
								if(response.statusCode != 200){
									szr.Notify.danger('删除失败，' + response.message + '！', 2);
									return;
								}
								ref.delete_node(sel);
								self.frm[0].reset();
								szr.Notify.success('删除成功！',2);
							});
			            }
					});
				},
				
				btnSave:function(){
					/*
					var ref = $('#org_tree').jstree(true);
					if(!ref){
						return;
					}
					var sel = ref.get_selected();
					if(!sel.length) { 
						szr.Notify.warn('请选择机构',2);
						return; 
					}
					var selected = ref.get_selected(true);
					if('j1_1' == selected[0].id){
						szr.Notify.warn('总公司不能修改',2);
						return; 
					}
					 */
					if(self.frm.valid()){
						$.blockUI({message: '<h5>正在保存信息...</h5>'});
						http.post(ctx+'/sys/org/save',self.frm.serialize(),function(response){
							$.unblockUI();
							if(response.statusCode == 200) {
								szr.Notify.success('保存成功！', 2);
								setTimeout(function(){
									window.location.reload(true);
								}, 2000);
							} else {
								szr.Notify.danger('保存失败，' + response.message + '！', 2);
							}
						},function(response){
							szr.Notify.danger('保存失败，' + response.message + '！', 2);
						});        			
					}
					
				}
			};
		}
	}
});