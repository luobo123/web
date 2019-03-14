var DataRangeUtil = {
		getOption:function(){
			var option = {
                opens: (App.isRTL() ? 'left' : 'right'),
//                "timePicker": true,
                "locale": {
//                    "format": "MM/DD/YYYY",
                	"format": "YYYY-MM-DD",
                    "separator": " - ",
                    "applyLabel": "确定",
                    "cancelLabel": "取消",
                    "fromLabel": "From",
                    "toLabel": "To",
                    "customRangeLabel": "精确范围",
                    "daysOfWeek": [
                        "日",
                        "一",
                        "二",
                        "三",
                        "四",
                        "五",
                        "六"
                    ],
                    "monthNames": [
                        "一月",
                        "二月",
                        "三月",
                        "四月",
                        "五月",
                        "六月",
                        "七月",
                        "八月",
                        "九月",
                        "十月",
                        "十一月",
                        "十二月"
                    ],
                    "firstDay": 1
                },
                format: "YYYY-MM-DD",
                separator: ' to ',
                startDate: moment().subtract('days', 29),
                endDate: moment(),
                ranges: {
                    '今天': [moment(), moment()],
                    '昨天': [moment().subtract('days', 1), moment().subtract('days', 1)],
                    '近7天': [moment().subtract('days', 6), moment()],
                    '近30天': [moment().subtract('days', 29), moment()],
                    '本月': [moment().startOf('month'), moment().endOf('month')],
                    '上月': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                },
                minDate: '2012-01-01',
                maxDate: '2018-01-01'
            }
			return option;
		}
}