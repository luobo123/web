'use strict';
var orgHandler={
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
            ignore: ':hidden', 
            rules:{
        		orgName:{minlength:2,maxlength:50,required:true},
        		orgCode:{minlength:2,maxlength:50,required:true},
        		contactPhone: {isMobile:true},
        		contactEmail: {email:true},
        		description:{maxlength:200}
        	},
        	messages:{
        		orgName:{required:'请输入机构名称',minlength:'最少2个字符',maxlength:'不能超过50个字符'},
        		orgCode:{required:'请输入机构编码',minlength:'最少2个字符',maxlength:'不能超过50个字符'},
        		contactPhone: {isPhone:'请输入正确的手机号'},
        		contactEmail: {email:'请输入有效的电子邮件地址'},
        		description:{maxlength:'最大200个字符'}
        	},
        });
    },
	init:function(){
		this.initOrgTreeData();
		this.frm = $('#org_frm');
		this.formValidate();
		this.btnClickBind();
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
				if(data && data.length>0){
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
        	'plugins' : [
               'wholerow'
            ]
        }).on('select_node.jstree',function(node,selected,event){
			var selectedNode=selected.node;
			var treedata = $('#org_tree').jstree('get_node', 'j1_1').data;
			var selectedData = selectedNode.data;
			var parentNode = $('#org_tree').jstree('get_node', selectedNode.parent);
			var parentData = parentNode.data;
			if(!selectedData){
				self.frm[0].reset();
				$('#orgId').val(null);
				$('#orgName').val(selectedNode.text);					
				return;
			}
			$('#orgId').val(selectedData.id);
			$('#orgName').val(selectedData.orgName);
			$('#orgCode').val(selectedData.orgCode);
			$('#orgType').val(selectedData.orgType);
			$('#orgAddress').val(selectedData.orgAddress);
			$('#contactName').val(selectedData.contactName);
			$('#contactPhone').val(selectedData.contactPhone);
			$('#contactEmail').val(selectedData.contactEmail);
			$('#description').val(selectedData.description);
			if('j1_1' == selectedNode.id){
				$('#parentId').val(null);
				$('#parentName').val(null);
			}
			if(parentData){
				$('#parentId').val(parentData.id);
				$('#parentName').val(parentData.orgName);
			}else{
				$('#parentId').val('');
				$('#parentName').val('');				
			}
		}).bind('loaded.jstree', function (e, data) {
			$('#org_tree').jstree('open_all');
        });
	},
	btnClickBind:function(){
		var self=this;
		$('#btn-cancel').click(function(){
			$('label.validator-error').remove();
			$('.validator-error').removeClass('validator-error');
			self.frm[0].reset();
		});
	},
};
$(function() {
	orgHandler.init();
});