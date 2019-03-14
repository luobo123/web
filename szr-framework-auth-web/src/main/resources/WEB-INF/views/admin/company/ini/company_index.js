'use strict';
var enabledata = [{id:'true', text: "是"},{ id:"false",text: "否"}];
var companyanHandler = {
	frm : null,
	error : null,
	table : null,
	result : null,
	searchForm: null,
	modalForm: null,
	company : null,
	init : function() {
		this.initComponents();
		this.searchForm = $('#company_frm');
		this.modalForm = $('#company_modal_frm');
		this.result = $('#company_databable');
		this.table = this.dataTable();
		this.btnBindClick();
		this.formValidate();
	},
	
	dataTable : function() {
		var self = this;
		return self.result.DataTable({
            select:false,
	        ajax:{
                type:'get',
                url: ctx + '/company/page',
                data: function (d) {
                	d.companyCode = $("#company_code_s").val();
                	d.companyName = $("#company_name_s").val();
                	d.enabled = $("#enabled_s").val();
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
			    { title : '公司名称', data : 'companyName', name : 'companyName' },
			    { title : '公司编码', data : 'companyCode', name : 'companyCode' },
			    { title : '机构地址', data : 'companyAddress', name : 'companyAddress' },
			    { title : 'Used', data : 'used', name : 'used',visible : false  },
			    { title : '是否有效', data : 'enabled', name : 'enabled', className:'text-center',
			    	render: function ( data, type, row, meta ,a) {
			    		return getBooleanText(data);
			    	}
			    },
			    { title :  '操    作', className:'text-center',
			    	render: function ( data, type, row, meta,a ) {
			    		if(row.enabled){
			    			var html_ = '<div><a class="btn_edit">编辑</a>&nbsp&nbsp'+
		                	'<a class="btn_enable">禁用</a><div>';
		                    return html_;
			    		}else{
			    			var html_ = '<div><a class="btn_edit">编辑</a>&nbsp&nbsp'+
		                	'<a class="btn_enable">启用</a><div>';
		                    return html_;
			    		}
			    		
			    	}
	            } 
			]
		});
	},
	initComponents: function(){
		 $("#enabled_s").select2({allowClear: true, minimumResultsForSearch: -1, placeholder: {id: 'placeholder', text: '选择是否生效'}, data: enabledata});
	     $("#enabled_s").val('true').trigger('change');
	},
	btnBindClick:function(){
		var self=this;
	
		$("#btn_search").click(function(){
			self.table.ajax.reload();
		});
		
		$("#btn_reset").click(function(){
			self.searchForm[0].reset();
		    $("#enabled_s").val('true').trigger('change');
		});
		
		$('#company_databable tbody').on( 'click', 'a.btn_enable', function () {
			var row = self.table.row( $(this).parents('tr')).data();
			$.blockUI({message: '<h5>正在执行...</h5>'});
			http.post(ctx + '/company/enabled',{id: row.id, enabled:row.enabled},
				function(response){
                	$.unblockUI();
                	if(response.statusCode != 200){
	        			szr.Notify.danger("操作失败" + response.message + "！", 2);
	        			return;
                    }
                    szr.Notify.success("操作成功！", 2);
                    self.table.ajax.reload();
				}
			);
		});
		
		/*$('#company_databable tbody').on( 'click', 'a.btn_disable', function () {
			var row = self.table.row( $(this).parents('tr')).data();
			$.blockUI({message: '<h5>正在执行...</h5>'});
			http.post(ctx + '/company/delete',{id: row.id},
				function(response){
	            	$.unblockUI();
	            	if(response.statusCode != 200){
	        			szr.Notify.danger("删除失败，" + response.message + "！", 2);
	        			return;
	                }
	                szr.Notify.success("删除成功！", 2);
	                self.table.ajax.reload();
				}
			);
		});*/
		
		$('#company_databable tbody').on( 'click', 'a.btn_edit', function () {
			var row = self.table.row( $(this).parents('tr')).data();
			self.setModalForm(row);
			$("#company_modal_title").text("编辑公司").attr('name','edit');
			$("#company_code_m").attr("disabled", "disabled");
			$('#company_modal').modal();
		});
		
		// 删除
		/*$('#company_databable tbody').on( 'click', 'a.btn_delete', function () {
			var row = self.table.row( $(this).parents('tr')).data();
			if(row.used){
				szr.Notify.success('该数据已被使用,不能删除！', 2);
				return;
			}
			bootbox.setLocale("zh_CN");
	        bootbox.confirm("确定要删除该记录?", function (result) {
	            if (result) {
					$.blockUI({message: '<h5>正在删除信息...</h5>'});
	                http.post(ctx + '/company/delete',{id: row.id},
	    				function(response){
	                    	$.unblockUI();
	                    	if(response.statusCode!=200){
			        			szr.Notify.danger(response.message, 2);
			        			return;
	                        }
	                        szr.Notify.success(response.message, 2);
	                        self.table.ajax.reload();
	    				}
	    			);
	            }
			});
		});*/
		
		$("#btn_save").click(function(){
			//表单校验
            if(!self.modalForm.valid()){
                szr.Notify.danger('请检查表单填写正确！',3);
                return ;
            }
			var data = self.getModalForm();
			data.companyType="COMPANY";
            $('#company_modal').modal('hide');
    		$.blockUI({message: '<h5>正在保存...</h5>'});
    		http.post(ctx + '/company/save',data,
				function(response){
        			$.unblockUI();
        			 if(response.statusCode != 200){
        				szr.Notify.danger("保存失败，" + response.message + "！", 2);
        				return;
        			 }
        			self.resetModalForm();
        			szr.Notify.success("保存成功！", 1);
                    self.table.ajax.reload();
				}
			);
			
		});
		
		$("#btn_cancel").click(function(){
			self.resetModalForm();
		});
		
		/*$('#company_databable tbody').on( 'dblclick', 'tr', function () {
			var row = self.table.row( $(this)).data();
			window.location.href = ctx + '/company/grant/'+row.id;
		});*/
	},
	btnOperation:function(){
		var self=this;
		return {
			btnAdd:function(){
				$("#company_modal_title").text("新增公司");
				$("#company_code_m").attr("disabled", null);
				$('#company_modal').modal();
			}
		}
	},
    getModalForm: function(){
		var data={
			id: $("#company_id_m").val(),
			companyName: $("#company_name_m").val(),
			companyCode: $("#company_code_m").val(),
			enabled: $("#enabled_m").val(),
			companyAddress: $("#company_address_m").val(),
			contact: $("#contact_m").val(),
			contactPhone: $("#contact_phone_m").val(),
			contactEmail: $("#contact_email_m").val(),
			description: $("#description_m").val()
		};
		
		return data;
		
	},
	
	setModalForm: function(data){
		$("#company_code_m").val(data.companyId);
		$("#company_id_m").val(data.id);
		$("#company_name_m").val(data.companyName);
		$("#company_code_m").val(data.companyCode);
		$("#enabled_m").val(data.enabled+"");
		$("#company_address_m").val(data.companyAddress);
		$("#description_m").val(data.description)
	},
	
	resetModalForm: function () {
		var self = this;
		$("label.validator-error").remove();
		$(".validator-error").removeClass("validator-error");
		self.modalForm[0].reset();
		if($('#company_modal_title').attr('name') == 'edit'){
			$('#company_modal_title').text('新增公司').attr('name','add');
			$("tr.selectEditTr").removeClass("selectEditTr");
		}
		$('#company_modal').modal('hide');
    },
    formValidate: function () {
        var self = this;
        self.validator = self.modalForm.validate({
            errorClass: 'validator-error', 
            errorPlacement: function (error, element) { 
            	var div = $(element).parent('div');
                error.appendTo(div);
            },
            focusInvalid: true, 
            ignore: ":hidden", 
            rules: {
            	companyName:{minlength:2,maxlength:255,required:true},
        		companyCode:{minlength:2,maxlength:50,required:true},
        		description:{maxlength:200}
            },
            messages: {
            	companyName:{required:'请输入机构名称',minlength:'最少2个字符',maxlength:'不能超过255个字符'},
        		companyCode:{required:'请输入机构编码',minlength:'最少2个字符',maxlength:'不能超过50个字符'},
        		description:{maxlength:'最大支持200个字符'}
            }
        });
    }
};

$(function() {
	companyanHandler.init();
});