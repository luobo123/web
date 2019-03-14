package com.szr.framework.auth.web.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.jeesys.common.web.BaseController;
import org.jeesys.common.web.http.Response;

import com.szr.framework.auth.model.Org;
import com.szr.framework.auth.model.User;
import com.szr.framework.auth.web.dto.DataTableResponse;
import com.szr.framework.auth.web.util.Constants;

/**
 * @author zhushunfu
 * @创建时间	2017年6月24日 上午11:22:48
 * @说明:TODO
 */
public class BusinessController extends BaseController {

	public Response dataTableResponse(int draw,Object data){
		return new DataTableResponse(draw,data);
	}
	
	protected String getRequestPath(HttpServletRequest request){
		String contextPath = request.getContextPath();
		String requestUri = request.getRequestURI();
		requestUri = StringUtils.substringAfter(requestUri, contextPath+"/");
		return requestUri;
	}
	
	protected User getSessionUser(){
		return (User)getSessionAttr(Constants.USER_KEY_IN_SESSION);
	}
	
	protected Org getSessionOrg(){
		return getSessionUser().getOrg();
	}
	
	protected boolean isAdmin(){
		return Constants.ADMIN_ORG_CODE.equals(getSessionOrg().getOrgCode());
	}
}
