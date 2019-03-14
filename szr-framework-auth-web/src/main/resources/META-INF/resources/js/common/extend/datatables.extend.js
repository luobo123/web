$(document).ready(function(){
	$.extend($.fn.dataTable.defaults,{
	    searching:false,
	    ordering:false,
	    //paging:true,
	    //responsive:false,
	    serverSide:true,
	    processing:true,
	    //scrollX:false,
		//autoWidth: false, //是否启用自动适应列宽
	    stateSave:false,
	    buttons:[],
	    columnDefs: [
            {targets: '_all',className:'text-left'}
        ],
	    select:{
            style:'multi',
            info:false,
            selector:'td'
        },
	    lengthMenu:[
	            [10,20,50],[10,20,50]
	    ],
	    pageLength:10,
	    language:{
	    		sProcessing:   "处理中...",
	    		sLengthMenu:   "显示 _MENU_ 项",
	    		sZeroRecords:  "没有匹配结果",
	    		sInfo:         "显示 _START_ 至 _END_ 项，共 _TOTAL_ 项",
	    		sInfoEmpty:    "共 0 项",
	    		sInfoFiltered: "",//"(由 _MAX_ 项结果过滤)",
	    		sInfoPostFix:  "",
	    		sSearch:       "搜索:",
	    		sUrl:          "",
	    		sEmptyTable:     "表中数据为空",
	    		sLoadingRecords: "载入中...",
	    		sInfoThousands:  ",",
	    		oPaginate: {
	    			sFirst:    "首页",
	    			sPrevious: "上页",
	    			sNext:     "下页",
	    			sLast:     "末页",
	    			next:"上页",
	    			page:"第",
	    			pageOf:"共",
	    			previous:"上页"
	    		},
	    		oAria:{
	    			sSortAscending:  ": 以升序排列此列",
	    			sSortDescending: ": 以降序排列此列"
	    		}
		},
//		initComplete:function(settings,json){
//			$(document).find('#result_processing').remove();
//			$(settings.nTable).colResizable({resizeMode:'overflow',minWidth:100,headerOnly:false});	        		
//        },
		dom:"<'row' <'col-md-12 col-sm-12 col-xs-12'B>><'table-scrollable'tr><'row center-block'<'col-md-5 col-sm-5 col-xs-5'l><'col-md-2 col-sm-2 col-xs-2 sm-center text-center'i><'col-md-5 col-sm-5 col-xs-5'p>>"
	});
});

function getBooleanText(value) {
	var enabledata = [{id:'true', text: "是"},{ id:"false",text: "否"}];
	return getTextById(enabledata, String(value));
}

//从键值数组里根据id查text
function getTextById(arr,id){
    var ret = '';
    var item;
    for (var i = 0; i < arr.length; i++) {
        item = arr[i];
        if(item.id == id){
            ret = item.text;
        }
    }
    return ret;
}
