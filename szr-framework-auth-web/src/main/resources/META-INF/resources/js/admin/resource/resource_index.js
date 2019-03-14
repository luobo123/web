'use strict';
var resourceHandler={
		frm:null,
		error:null,
		formValidate: function () {
	        var self = this;
	        self.validator = self.frm.validate({
	            errorClass: 'validator-error', 
	            errorPlacement: function (error, element) { 
	            	var div = $(element).parent('div');
	                error.appendTo(div);
	            },
	            focusInvalid: true, 
	            ignore: ":hidden", 
	            rules: {
	            	name:{minlength:2,maxlength:10,required:true},
	    			code:{minlength:3,maxlength:60,required:true},
	    			//url:{minlength:3,maxlength:255,required:true},
	    			description:{maxlength:200},
	    			seq:{number:true,min:0,required:true}
	            },
	            messages: {
	            	name:{minlength : '最少2个字符',maxlength : '不能超过10个字符',required:'请输入资源名称'},
	    			code:{minlength:'资源代码最少3位',maxlength:'不能超过20个字符',required : '资源代码不能为空'},
	    			//url:{minlength:'资源url最少3位',maxlength:'不能超过128个字符',required : '资源url不能为空'},
	    			description:{maxlength : '最大200个字符'},
	    			seq:{number:'请输入数字',min:'最小为0',required:'请输入序号'}
	            }
	        });
	    },
	    iconMap:function(){
			var map=new Map();
			map.put('icon-settings','菜单');
			map.put('fa fa-caret-right','子菜单');
			map.put('fa fa-plus','添加');
			map.put('fa fa-edit','修改');
			map.put('fa fa-remove','删除');
			map.put('fa fa-refresh','重置');
			map.put('fa fa-check-circle-o','授权');
			return map;
		},
		typeMap:function(){
			var map=new Map();
			map.put('MENU','<span class="font-green-jungle">菜单</span>');
			map.put('OPERATION','<span class="font-red">操作</span>');
			map.put('DATA','<span class="font-blue">数据</span>');
			return map;
		},
		loadNodes:null,
		treeTable:null,
		treeableOptions:function(){
			var self=this;
			return {
				onNodeExpand:self.treeTableFunc().nodeExpand,
			    onNodeCollapse:self.treeTableFunc().nodeCollapse,
			    onInitialized:self.treeTableFunc().onInitialized,
			    multiSelecte:false,
			    onlySelectChildren:false,
			    childClass:'fa fa-file-o font-red',
			    columns:[
					{title:'id',data:'id',name:'id',className:'hide'},
					{title:'菜单名称',data:'name',name:'name'},
					{title:'菜单类型',data:'type',name:'type'},
					{title:'访问路径',data:'url',name:'url'},
					{title:'菜单图标',data:'icon',name:'icon',className:'text-center'},
					{title:'排序序号',data:'seq',name:'seq',className:'text-center'},
					//{title:'操作',data:'status',name:'status',className:'text-center'}
				]
			};
		},
		init:function(){
			this.frm = $('#frm');
			this.error = $('.alert-danger',this.frm);
			var treeableOptions=this.treeableOptions();
			this.treeTable=$('#treetable').treetable(treeableOptions);
			this.formValidate();
			this.getResource();
			this.loadNodes=new ArrayList();
			this.btnBindClick();
			this.iconTree();
		},
		resetForm:function(){
			var self=this;
			$('input[name="name"]').val('');
			$('input[name="seq"]').val('');
			$('input[name="url"]').val('');
			$('input[name="parentName"]').val('');
			$('input[name="parentId"]').val('');
			$('input[name="code"]').val('');
			$('textarea[name="description"]').html("");
			$(self.frm).find('.form-group').removeClass("has-success");
			$(self.frm).find('.form-group').find('.input-icon').children('i').removeClass("fa-warning").removeClass("fa-check");
			self.treeDeselectAll();
			//self.treeTable.treetable('force',true);
	},
	btnBindClick:function(){
		var self=this;
		
		$('#btn-cancel').click(function(){
			$('#modal').modal('hide');
			$("label.validator-error").remove();
			$(".validator-error").removeClass("validator-error");
			self.frm[0].reset();
		});
		
		$('#icon_m').click(function(){
			if($('#tree_icon').hasClass('hide')){
				self.showIconMenu();			
			}else{
				self.hideIocnMenu();
			}
		});
		
		$('#parentName').click(function(){
			if($('#tree_resource').hasClass('hide')){
				self.showMenu();			
			}else{
				self.hideMenu();
			}
		});
		$('#parentName').change(function(){
			if($(this).val()==''){
				$('#parent-del').removeClass('fa-times');
				self.treeDeselectAll();
			}else{				
				$('#parent-del').addClass('fa-times');
			}
		});
		$('#parent-del').click(function(){
			$('#parentId').val('');
		    $('#parentName').val('');
		    $('#parentName').trigger('change');
		    self.treeDeselectAll();
		});
		$('select[name="type"]').change(function(){
			var selectedVal=$(this).val();
			if(selectedVal != 1){
				
			}
		});
	},
	btnOperation:function(){
		var self=this;
		return {
				btnAdd:function(){
					$('#btn-save').show();
					$('#btn-edit').hide();
					$('#modal-title').text('新增资源');
					self.resetForm();
					$('#modal').modal('show');
					$('#btn-save').unbind('click');
					
					$('#resource-icon').removeClass();
					$('#resource-icon').addClass('icon-settings');
					$('#icon_m').val("菜单");
					
					$('#iconId').val('icon-settings');
					
					$('#btn-save').bind('click',function(){
						if (self.frm.valid()) {
							http.post(ctx + '/sys/resource/save', self.frm.serialize(),function(response) {
								$('#modal').modal('hide');
								if(response.statusCode != 200){
				        			szr.Notify.danger("保存失败，" + response.message + "！", 2);
				        			return;
		                        }
		                        szr.Notify.success("保存成功！", 2);
		                        setTimeout(function(){
		    						window.location.reload(true);
		    					},2000);
							});
						}
					});
				},
				btnEdit:function(){
					//修改资源
					var selectedTrs = self.treeTable.find('tbody > tr.selected');
					if(selectedTrs.length != 1 ){
						szr.Notify.warn('请选择一条数据',2);
						return;
					}
					var id = $(selectedTrs[0]).data('tt-id');
					var treeData=$(self.treeTable).data('treetable').data;
					var resource=treeData.get(id);
					var parentId=resource.parentId;
					$('input[name="name"]').val(resource.name);
					$('input[name="code"]').val(resource.code);
					$('input[name="url"]').val(resource.url);
					$('input[name="seq"]').val(resource.seq);
					$('input[name="icon"]').val(resource.icon);
					$('input[name="lastLevel"]').parent('span').removeClass('checked');
					$('input[name="lastLevel"][value="'+(resource.lastLevel?1:0)+'"]').parent('span').addClass('checked');
					$('input[name="lastLevel"][value="'+(resource.lastLevel?1:0)+'"]').attr('checked',true);
					$('textarea[name="description"]').html(resource.description);
					/*$('select[name="type"] > option').removeAttr('selected');
					$('select[name="type"] > option[value="'+resource.type+'"]').attr("selected",true);*/
					$('#type_m').val(resource.type);
					var iconMap=self.iconMap();
					$('#resource-icon').removeClass();
					$('#resource-icon').addClass(resource.icon);
					$('#icon_m').val(iconMap.get(resource.icon));
					$('#iconId').val(resource.icon);
					
					$('#modal-title').text('编辑资源');
					
					if(parentId){
						$('#parentId').val(parentId);			
						$('#parentName').val(treeData.get(parentId).name);
						$('#tree_resource').jstree().select_node('#'+parentId+'_anchor');
					}else{
						$('#parentName').val('');
						$('#parentId').val('');
					}
					$('#parentName').trigger('change');
					$('#btn-saveEdit').attr('resource-id',resource.id);
					$('#modal').modal('show');
					$('#btn-edit').show();
					$('#btn-save').hide();
					$('#btn-edit').unbind('click');
					$('#btn-edit').bind('click',function() {
						if(self.frm.valid()){
							http.post(ctx+'/sys/resource/edit/'+resource.id,self.frm.serialize(),function(response){
								$('#modal').modal('hide');
								if(response.statusCode != 200){
				        			szr.Notify.danger("保存失败，" + response.message + "！", 2);
				        			return;
		                        }
		                        szr.Notify.success("保存成功！", 2);
		                        setTimeout(function(){
		    						window.location.reload(true);
		    					},2000);
							});        			
						}						
					});
					
				},
				btnDelete:function(){
					var selectedTrs = self.treeTable.find('tbody > tr.selected');
					if(selectedTrs.length != 1 ){
						szr.Notify.warn('请选择一条数据',2);
						return;
					}
					debugger;
					var id = $(selectedTrs[0]).data('tt-id');
					var treeData=$(self.treeTable).data('treetable').data;
					var resource=treeData.get(id);
					if(resource.children.length > 0){
						szr.Notify.danger("删除失败:请先删除子节点！", 2);
						return;
					}
					$.blockUI({message: '<h5>正在删除...</h5>'});
					http.post(ctx+'/sys/resource/delete/'+resource.id,null,function(response){
						$.unblockUI();
						if(response.statusCode != 200){
		        			szr.Notify.danger("删除失败，" + response.message + "！", 2);
		        			return;
                        }
                        szr.Notify.success("删除成功！", 2);
                        setTimeout(function(){
    						window.location.reload(true);
    					},2000);
					}); 
				}
		}
	},
	treeTableFunc:function(){
		var self=this;
		return {
				onInitialized:function(){
				var tree = this;
				tree.loadThead();
				$.blockUI({message: '<h5>正在加载...</h5>'});
				http.get(ctx+'/sys/resource/get',null,function(response){
					$.unblockUI();
					var data = response.data;
					var trTemplete='<tr role="row" data-tt-id="{id}" data-tt-parent-id="{parentId}" data-tt-branch="{branch}">'
						+'<td>{name}</td>'
						+'<td>{typeDescription}</td>'
						//+'<td>{code}</td>'
						+'<td>{url}</td>'
						+'<td style="text-align: center"><i class="{icon}"></i></td>'
						//+'<td>{ctime}</td>'
						+'<td style="text-align: center">{seq}</td>'
						//+'<td style="text-align: center">{statusDescription}</td>'
						+'</tr>';
					var trs='';
					var typeMap=self.typeMap();
					$.each(data,function(i,resource){
						resource.branch=resource.children.length>0;
						resource.typeDescription=typeMap.get(resource.type);
						if(!resource.enabled){
							resource.statusDescription='<a class="btn_enable font-green-jungle" style=text-decoration:underline;" onclick="javascript:resourceHandler.btnEnableClick(\''+resource.id+'\')">启用</a>'
						}else{
							resource.statusDescription='<a class="btn_disable font-red" style=text-decoration:underline;" onclick="javascript:resourceHandler.btnDisableClick(\''+resource.id+'\')">禁用</a>'
						}
						
						trs+=trTemplete.format(resource);
						tree.put(resource.id,resource);
					});
					var table = tree.table;
					$(table).append(trs);
					tree.loadRows(table.rows).render();
					$(table).data("treetable",tree);
					if(tree.settings.onSelected && (typeof tree.settings.onSelected == 'function')){
						tree.settings.onSelected.apply($(table));
					}
				});
			},
			nodeExpand:function(){
				var tree = this;
				tree.row.removeClass('collapsed');
				tree.row.find('a[title="Expand"]').removeClass(tree.settings.expandedClass).addClass(tree.settings.collapsedClass);
				var currentNodeId=tree.id;
				if(self.loadNodes.contains(currentNodeId)){
					return;
				}
				$.blockUI({message: '<h5>正在加载...</h5>'});
				http.get(ctx+'/sys/resource/get',{'parentId':currentNodeId},function(response){
					$.unblockUI();	
					var data = response.data;
						var trTemplete='<tr role="row" data-tt-id="{id}" data-tt-parent-id="{parentId}" data-tt-branch="{branch}">'
							+'<td>{name}</td>'
							+'<td>{typeDescription}</td>'
							//+'<td>{code}</td>'
							+'<td>{url}</td>'
							+'<td style="text-align: center" ><i class="{icon}"></i></td>'
							//+'<td>{ctime}</td>'
							+'<td style="text-align: center">{seq}</td>'
							//+'<td style="text-align: center">{statusDescription}</td>'
							+'</tr>';
						var trs='';
						var parentNode = self.treeTable.treetable('node',currentNodeId);
						
						var typeMap=self.typeMap();
						for(var i=0,len=data.length;i<len;i++){
							var resource=data[i];
							resource.branch=resource.children.length>0;
							resource.typeDescription=typeMap.get(resource.type);
							if(!resource.enabled){
								resource.statusDescription='<a class="btn_enable font-green-jungle" style=text-decoration:underline;" onclick="javascript:resourceHandler.btnEnableClick(\''+resource.id+'\')">启用</a>'
							}else{
								resource.statusDescription='<a class="btn_disable font-red" style=text-decoration:underline;" onclick="javascript:resourceHandler.btnDisableClick(\''+resource.id+'\')">禁用</a>'
							}
							trs+=trTemplete.format(resource);
							$(self.treeTable).data('treetable').put(resource.id,resource);
						}
						self.treeTable.treetable('loadBranch', parentNode,trs);
						self.loadNodes.add(currentNodeId);
					});			
			},
			nodeCollapse:function(){
				this.row.removeClass('expanded');
				this.row.find('a[title="Expand"]').removeClass(this.settings.collapsedClass).addClass(this.settings.expandedClass);
			}
		};
	},
	getResource:function(){
		var self=this;
		$.blockUI({message: '<h5>正在加载...</h5>'});
		http.get(ctx + '/sys/resource/list',null,function(response){
			var data = response.data;
			var newDataArray=[];
			for (var i = 0, ien = data.length; i < ien; i++) {
				var resource = data[i];
				if(!resource.parentId || resource.parentId == 'null'){
					resource.parentId = '#';
				}
				var temp={	parent:resource.parentId,
							text:resource.name,
							state:{'opened':false},
							id:resource.id
						}; 
				newDataArray.push(temp);
			}
			self.handleSample(newDataArray);
			$.unblockUI();
		});
	},
	iconTree:function(){
		var self=this;
		var jstree = $('#tree_icon').jstree({
			'plugins' : [ "wholerow", "types" ],
			'core' : {"themes" : {"responsive" : false},
				data:[
				      {id:"icon-settings", text:"菜单",icon:"icon-settings"},
				      {id:"fa fa-caret-right", text:"子菜单",icon:"fa fa-caret-right"},
				      {id:"fa fa-plus", text:"添加",icon:"fa fa-plus" },
				      {id:"fa fa-edit", text:"修改",icon:"fa fa-edit"},
				      {id:"fa fa-save", text:"保存",icon:"fa fa-save"},
				      {id:"fa fa-remove", text:"删除",icon:"fa fa-remove"},
				      {id:"fa fa-refresh", text:"重置",icon:"fa fa-refresh"},
				      {id:"fa fa-check-circle-o", text:"授权",icon:"fa fa-check-circle-o"}
				]
			}
		}).on('select_node.jstree',function(node,selected,event){
			 var selectNode=selected.node;
			 $('#resource-icon').removeClass();
			 $('#resource-icon').addClass(selectNode.icon);
			 $('#icon_m').val(selectNode.text.trim());
			 $('#iconId').val(selectNode.icon);
				
			 $('#icon_m').trigger('change');
			self.hideIocnMenu();
	   })
	},
	
	handleSample:function(data){
		var self=this;
		var jstree = $('#tree_resource').jstree({
			'plugins' : [ "wholerow", "types" ],
			'core' : {"themes" : {"responsive" : false},
				data:data
			},
			"types" : {
				"default" : {
					"icon" : "fa fa-folder icon-state-warning icon-lg"
				},
				"file" : {
					"icon" : "fa fa-file icon-state-warning icon-lg"
				}
			}
		}).on('select_node.jstree',function(node,selected,event){
			  var selectNode=selected.node;
			  $('#parentId').val(selectNode.id);
		      $('#parentName').val(selectNode.text.trim());
		      $('#parentName').trigger('change');
		      self.hideMenu();
		  });
	},
	treeDeselectAll:function(){
		$('#tree_resource').jstree().deselect_all();
	},
	showMenu:function(){
		$('#tree_resource').removeClass('hide');
		$('body').bind('click',this.onBodyDown);
	},
	hideMenu:function(){
		$('#tree_resource').addClass('hide');
		$('body').unbind('click');
	},
	onBodyDown:function(event){
		var self=this;
		if (!(event.target.id =='parentName' || $(event.target).parents('#tree_resource').length>0)) {
			$('#tree_resource').addClass('hide');
			$('body').unbind('click');
		}
	},
	//
	showIconMenu:function(){
		$('#tree_icon').removeClass('hide');
		$('body').bind('click',this.onBodyIconDown);
	},
	hideIocnMenu:function(){
		$('#tree_icon').addClass('hide');
		$('body').unbind('click');
	},
	onBodyIconDown:function(event){
		var self=this;
		if (!(event.target.id =='icon_m' || $(event.target).parents('#tree_icon').length>0)) {
			$('#tree_icon').addClass('hide');
			$('body').unbind('click');
		}
	}
};
$(function(){
	resourceHandler.init();
});
