'use strict';
$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
	var tabId = $(this).attr('href');
	var selectTables = $("div" + tabId + " table");
	if (selectTables && selectTables.length > 0) {
		$.each(selectTables, function(i, table) {
			$(table).colResizable({
				resizeMode : 'overflow',
				minWidth : 100,
				headerOnly : false
			});
		});
	}
});