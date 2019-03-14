'use strict';
if(App){
	 App.startPageLoading=function(options) {
         if (options && options.animate) {
             $('.page-spinner-bar').remove();
             $('body').append('<div class="page-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
         } else {
             $('.page-loading').remove();
             $('body').append('<div class="page-loading"><img src="' + assets + '/global/img/loading-spinner-grey.gif"/>&nbsp;&nbsp;<span>' + (options && options.message ? options.message : 'Loading...') + '</span></div>');
         }
     },
     App.alert=function(options) {
         options = $.extend(true, {
             container: "", // alerts parent container(by default placed after the page breadcrumbs)
             place: "append", // "append" or "prepend" in container 
             type: 'success', // alert's type
             message: "", // alert's message
             close: true, // make alert closable
             reset: true, // close all previouse alerts first
             focus: true, // auto scroll to the alert after shown
             closeInSeconds: 0, // auto close after defined seconds
             icon: "" // put icon before the message
         }, options);

         var id = App.getUniqueID("App_alert");

         var html = '<div id="' + id + '" class="custom-alerts alert alert-' + options.type + ' fade in">' + (options.close ? '<button type="button" class="close" data-dismiss="alert" aria-hidden="true"></button>' : '') + (options.icon !== "" ? '<i class="fa-lg fa fa-' + options.icon + '"></i>  ' : '') + options.message + '</div>';

         if (options.reset) {
             $('.custom-alerts').remove();
         }

         if (!options.container) {
             if ($('.page-fixed-main-content').size() === 1) {
                 $('.page-fixed-main-content').prepend(html);
             } else if (($('body').hasClass("page-container-bg-solid") || $('body').hasClass("page-content-white")) && $('.page-head').size() === 0) {
                 $('.page-title').after(html);
             } else {
                 if ($('.page-bar').size() > 0) {
                     $('.page-bar').after(html);
                 } else {
                     $('.page-breadcrumb, .breadcrumbs').after(html);
                 }
             }
         } else {
             if (options.place == "append") {
                 $(options.container).append(html);
             } else {
                 $(options.container).prepend(html);
             }
         }

         if (options.focus) {
             App.scrollTo($('#' + id));
         }

         if (options.closeInSeconds > 0) {
             setTimeout(function() {
                 $('#' + id).remove();
                 if(options.callBack && (options.callBack instanceof Function)){
                	 options.callBack();
                 }
             }, options.closeInSeconds * 1000);
         }

         return id;
     }
}
var szr={};
szr.Alert={
	info:function(message,closeInSeconds,callBack){
		App.alert({
					type:'info',
					message:message||'',
					closeInSeconds:closeInSeconds||0,
					callBack:callBack
				}
		);
	},
	success:function(message,closeInSeconds,callBack){
		App.alert({
					type:'success',
					message:message||'',
					closeInSeconds:closeInSeconds||0,
					callBack:callBack
				}
		);
	},
	warn:function(message,closeInSeconds,callBack){
		App.alert({
					type:'warning',
					message:message||'',
					closeInSeconds:closeInSeconds||0,
					callBack:callBack
				}
		);
	},
	danger:function(message,closeInSeconds,callBack){
		App.alert({
					type:'danger',
					message:message||'',
					closeInSeconds:closeInSeconds||0,
					callBack:callBack
				}
		);
	}
};

szr.Notify ={
	info:function(message,closeInSeconds,callBack){
             var params = {
                theme: 'teal',
                heading: '',
                sticky: false,
                horizontalEdge: 'top',
                verticalEdge: 'right',
                life: closeInSeconds * 1000
            };
            if(closeInSeconds === undefined){
                params.sticky = true;
            }         
            $.notific8("zindex", 11500),
            $.notific8($.trim(message), params);
            if (closeInSeconds > 0) {
             setTimeout(function() {
                 if(callBack && (callBack instanceof Function)){
                    callBack();
                 }
             }, closeInSeconds * 1000);
            };
	},
	success:function(message,closeInSeconds,callBack){
            var params = {
                theme: 'lime',
                heading: '',
                sticky: false,
                horizontalEdge: 'top',
                verticalEdge: 'right',
                life: closeInSeconds * 1000
            };
            if(closeInSeconds === undefined){
                params.sticky = true;
            }         
            $.notific8("zindex", 11500),
            $.notific8($.trim(message), params);
            if (closeInSeconds > 0) {
             setTimeout(function() {
                 if(callBack && (callBack instanceof Function)){
                    callBack();
                 }
             }, closeInSeconds * 1000);
            }
	},
	warn:function(message,closeInSeconds,callBack){
            var params = {
                theme: 'tangerine',
                heading: '',
                sticky: false,
                horizontalEdge: 'top',
                verticalEdge: 'right',
                life: closeInSeconds * 1000
            };
            if(closeInSeconds === undefined){
                params.sticky = true;
            }         
            $.notific8("zindex", 11500),
            $.notific8($.trim(message), params);
            if (closeInSeconds > 0) {
             setTimeout(function() {
                 if(callBack && (callBack instanceof Function)){
                    callBack();
                 }
             }, closeInSeconds * 1000);
            }
	},
	danger:function(message,closeInSeconds,callBack){
            var params = {
                theme: 'ruby',
                heading: '',
                sticky: false,
                horizontalEdge: 'top',
                verticalEdge: 'right',
                life: closeInSeconds * 1000
            };
            if(closeInSeconds === undefined){
                params.sticky = true;
            }         
            $.notific8("zindex", 11500),
            $.notific8($.trim(message), params);
            if (closeInSeconds > 0) {
             setTimeout(function() {
                 if(callBack && (callBack instanceof Function)){
                    callBack();
                 }
             }, closeInSeconds * 1000);
            }
	}
};
