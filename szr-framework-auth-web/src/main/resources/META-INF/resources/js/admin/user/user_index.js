'use strict';
var userHandler={
	frm:null,
	table:null,
	result:null,
	init:function(){
		this.initOrgTreeData();
		this.frm = $('#user_modal_frm');
		$('#roleIds').select2({placeholder:'请选择角色'});
		this.result=$('#result');
		this.table=this.dataTable();
		this.btnBindClick();
		this.formValidate();
		this.loadRoles();
	},
	dataTable:function(){
		var self=this;
		return self.result.DataTable({
			ajax:{
                type:'post',
                url: ctx+'/sys/user/list',
                data: function (d) {
                	var ref = $('#org_tree').jstree(true);
                	if(!ref){
                		return false;
                	}
    				var sel = ref.get_selected();
    				if(!sel.length) { 
    					d.orgId = null;
    					return false; 
    				}
    				var orgId = ref.get_selected(true)[0].id;
                	d.orgId = orgId;
                }
            },
    	    columns: [
				{
					title:'<input type="checkbox" id="check-all" />',
				    data:'id',
				    className:'select-checkbox text-center',render : function(data,type,row,meta){return '';}
				},
				
				{title:'id',data:'id',name:'id',visible:false},
                {title:'用户名',data:'username',name:'username'},
                {title:'角色',data:'roleName',name:'roleName',className:'text-nowrap',render : function(data,type,row,meta){
                	var roleNameVal = '';
                	$.each(row.roles,function(index,role){
                		roleNameVal+=role.roleName+',';                		
                	});
                	return roleNameVal.substring(0,roleNameVal.length-1);
                }
                },
                {title:'邮箱',data:'email',name:'email' },
                {title:'手机',data:'mobile',name:'mobile'}
    	    ]
		});
	},
	initOrgTreeData:function(){
		var self=this;
		http.get(ctx+'/sys/org/list',null,function(response){
			if(response.statusCode == 200){
				var data = response.data; 
				var addProp = function(object,key){
					object[key]=object.orgName;
					if(object.children && object.children.length > 0){
						$.each(object.children,function(index,v){
							v[key] = v.orgName;
						});
					}
				};
				if(data && data.length > 0){
	    			var newData_ = [];
	    			for(var i=0;i<data.length;i++){
	    				addProp(data[i],'name');
	    				var data_ = $.formatTreeData(data[i]);
	    				newData_.push(data_);
	    			}
	    			self.initOrgTree(newData_);
	    		}
			}
		});
	},
	initOrgTree: function(data){
		var self = this;
		$('#org_tree').jstree({
			'core' : {
				'multiple':false,
				'check_callback':true,
                'themes': {'responsive':true},
                'cache': false,
                'data': data,
                'error':function(e){
                	console.error(e);
                }
            },
        	'plugins' : ['wholerow']
        }).on('select_node.jstree',function(node,selected,event){
			self.table.ajax.reload();
		}).bind('loaded.jstree', function (e, data) {
			$('#org_tree').jstree('open_node',$('#org_tree').jstree('select_node',0));
        });
	},
	loadRoles:function(){
		$('#roleIds').val('');
		$('#roleIds').trigger('change.select2');
		$('#roleIds option').remove();
		$.blockUI({message: '<h5>正在加载...</h5>'});
		http.post(ctx+'/sys/role/list',null,function(response){
			$.unblockUI();
			var data=response.data;
			if(data && data.totalElements > 0){
				var options='';
				var content = data.content;
				for(var i=0,len=content.length;i<len;i++){
					options+='<option value="'+content[i].id+'">'+content[i].roleName+'</option>'
				}
				$('#roleIds').append(options);
			}
		});
	},
	btnBindClick:function(){
		var self=this;
		self.result.on('click', '#check-all', function () {
            var checked = $(this).prop('checked');
            if (checked) {
                self.table.rows().select();
            } else {
                self.table.rows().deselect();
            }
        });
		
		$("#roleIds").change(function () {  
			$("#roleIds").removeClass("validator-error")
			$("#role_m-error").remove();
	    });  
	    $("#roleIds").trigger("change");
		
		$('#btn_cancel').click(function(){
			$('#user_modal').modal('hide');
			$("label.validator-error").remove();
			$(".validator-error").removeClass("validator-error");
			self.frm[0].reset();
		});
		
		$('#btn_save').click(function(){
			var selectedRoleId=$('#roleIds').val();
			var roleIds='';
			
			if(!self.frm.valid()){
                return;
            }
			if(!selectedRoleId || selectedRoleId==''){
				$("#roleIds").addClass("validator-error")
				$("#role_div_m").append('<label id="role_m-error" class="validator-error">请选择角色</label>');
				return;
			}
			for(var i=0,len = selectedRoleId.length;i<len;i++){
				roleIds+='&roleIdList[]='+selectedRoleId[i];
			}
			
			var formData=self.frm.serialize()+roleIds;
			$.blockUI({message: '<h5>正在保存...</h5>'});
			http.post(ctx+'/sys/user/save',formData,function(response){
				$.unblockUI();
				$("label.validator-error").remove();
	            $(".validator-error").removeClass("validator-error");
            	if(response.statusCode != 200){
        			szr.Notify.danger("保存失败，" + response.message + "！", 2);
        			return;
                }
            	
            	$('#user_modal').modal('hide');
                szr.Notify.success("保存成功！", 2);
                self.table.ajax.reload();
				self.frm[0].reset();
			},function(){
				$.unblockUI();
				szr.Notify.danger("保存失败", 2);
			});
		});
		
		$('#btn_edit').click(function(){
			var selectedRoleId=$('#roleIds').val();
			var roleIds='';
			
			if(!self.frm.valid()){
                return;
            }
			if(!selectedRoleId || selectedRoleId==''){
				$("#roleIds").addClass("validator-error")
				$("#role_div_m").append('<label id="role_m-error" class="validator-error">请选择角色</label>');
				return;
			}
			for(var i=0,len = selectedRoleId.length;i<len;i++){
				roleIds+='&roleIdList[]='+selectedRoleId[i];
			}
			
			var formData=self.frm.serialize()+roleIds;
			$.blockUI({message: '<h5>正在保存...</h5>'});
			http.post(ctx+'/sys/user/edit',formData,function(response){
				$.unblockUI();
				$("label.validator-error").remove();
	            $(".validator-error").removeClass("validator-error");
            	if(response.statusCode != 200){
        			szr.Notify.danger("保存失败，" + response.message + "！", 2);
        			return;
                }
            	
            	$('#user_modal').modal('hide');
                szr.Notify.success("保存成功！", 2);
                self.table.ajax.reload();
				self.frm[0].reset();
			},function(){
				$.unblockUI();
				szr.Notify.danger("保存失败", 2);
			});
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
            ignore: ":hidden", 
            rules: {
            	orgName: { required: true },
            	username: {required:true,minlength:5,maxlength:20},
            	//password: { required: true,minlength:6,maxlength:20 },
            	mobile: {isMobile:true},
            	email: {email:true}
            },
            messages: {
            	orgName: { required: '请选择机构'},
            	username: {required:'请输入用户名',minlength:'用户名最少5位',maxlength:'用户名最多20位'},
            	password: { required: '请输入密码',minlength:"密码最少6位", maxlength:'密码最多20位' },
            	mobile: {isPhone:"请输入正确的手机号"},
            	email: {email:"请输入有效的电子邮件地址"}
            }
        });
    }
}

$(function(){
	userHandler.init();
});
