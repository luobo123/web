'use strict';
var myEChart = {
		color:[ '#ffcc99', '#ffff99', '#99cc99', '#ccff99', '#cccccc',
				'#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570',
				'#c4ccd3' ],
		feature:{
			dataView:{show:true,readOnly:true,lang:['数据视图', '关闭','刷新']},
			magicType:{show:true,type:['line','bar']},
			restore:{show:true},
			saveAsImage:{show:true}
		},
		itemStyle_done:{//处理成功
			normal:{
				color:'rgb(168, 217, 108)'
			}
		},
		itemStyle_doing:{//处理中
			normal:{
				color:'rgb(254, 235, 93)'
			}
		},
		itemStyle_fail:{//失败
			normal:{
				color:'rgb(252, 109, 96)'
			}
   	 	},
		init:function(dom){
			return echarts.init(document.getElementById(dom));
		}
}