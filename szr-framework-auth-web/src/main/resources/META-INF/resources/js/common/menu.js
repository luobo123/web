'use strict';
$(function(){
	var pathName = window.location.pathname;
	if(pathName.substring(pathName.length-1) == '/'){
		pathName = pathName.substring(0,pathName.lastIndexOf('/'));
	}
	var selectedLink = $('a[href*="'+pathName+'"].nav-link');
	if(selectedLink != null && selectedLink.length > 0){
		var parentLis=selectedLink.parents('li.nav-item');
		$.each(parentLis,function(i,parentLi){
			$(parentLi).addClass('active open');
		});		
	}
});