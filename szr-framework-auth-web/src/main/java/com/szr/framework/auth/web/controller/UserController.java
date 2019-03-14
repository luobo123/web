package com.szr.framework.auth.web.controller;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.apache.commons.lang3.StringUtils;
import org.jeesys.common.jpa.search.DataTablePage;
import org.jeesys.common.web.http.Response;
import org.jeesys.common.web.http.Response.StatusCode;
import org.jeesys.util.MD5Util;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.szr.framework.auth.core.service.OrgService;
import com.szr.framework.auth.core.service.RoleService;
import com.szr.framework.auth.core.service.UserService;
import com.szr.framework.auth.model.Org;
import com.szr.framework.auth.model.Role;
import com.szr.framework.auth.model.User;


/**
 * @author zhushunfu
 * @createtime 2017年2月15日 上午10:26:56
 * @todo 机构信息管理controller
 */
@RestController
@RequestMapping("/sys/user")
public class UserController extends BusinessController {

	@Autowired
	private UserService userService;
	
	@Autowired
	private OrgService orgService;
	
	@Autowired
	private RoleService roleService;
	
	/**
	 * 查询机构下的用户信息
	 * @param page
	 * @param orgId
	 * @return
	 */
	@PostMapping("/list")
	public Object getOrgUsers(DataTablePage page,Long orgId){
		if(orgId == null){
			return dataTableResponse(page.getDraw(), new PageImpl<>(new ArrayList<>()));
		}
		Page<User> userPage = userService.getByOrgId(orgId,page);
		return dataTableResponse(page.getDraw(),userPage);
	}
	
	@PostMapping("/save")
	public Object save(@Valid User user,@RequestParam("orgId")Long orgId,
			@RequestParam(value="roleIdList[]",required=true)List<Long> roleIds)
			throws Exception {
		Org org = orgService.getById(orgId);
		if(org == null){
			return failure(StatusCode.SC_PARAM_ERROR);				
		}
		List<Role> roles = roleService.getAll(roleIds);
		if(roles == null || roles.size() == 0 ){				
			return failure(StatusCode.SC_PARAM_ERROR);
		}
		if(user.getId() == null){
			User newUser = new User();
			BeanUtils.copyProperties(user,newUser,"id","createTime","updateTime","version","status");
			String password = user.getPassword();
			if(StringUtils.isBlank(password)){
				password = "123456";
			}
			newUser.setPassword(MD5Util.md5(password));
			userService.saveUser(newUser,orgId, roleIds);
			return success();
		}
		return failure(StatusCode.SC_PARAM_ERROR);		
	}
	
	@PostMapping("/edit")
	public Object edit(@Valid User user,@RequestParam("orgId")Long orgId,
			@RequestParam(value="roleIdList[]",required=true)List<Long> roleIds)
			throws Exception {
		Org org = orgService.getById(orgId);
		if(org == null){
			return failure(StatusCode.SC_PARAM_ERROR);				
		}
		if(user.getId() == null){
			return failure(StatusCode.SC_PARAM_ERROR);				
		}else{
			User orginalUser = userService.getById(user.getId());
			if(orginalUser == null){
				return failure(StatusCode.SC_PARAM_ERROR);
			}
			List<Role> roles = roleService.getAll(roleIds);
			if(roles == null || roles.size() == 0 ){				
				return failure(StatusCode.SC_PARAM_ERROR);
			}
			BeanUtils.copyProperties(user,orginalUser,"id","createTime","updateTime","version","status");
			if(StringUtils.isNotBlank(user.getPassword())){
				orginalUser.setPassword(MD5Util.md5(user.getPassword()));
			}
			userService.saveUser(orginalUser, orgId, roleIds);
		}
		
		return success();
	}
	
	@PostMapping("/change/password")
	public Response change(String password)throws Exception{
		User sessionUser = getSessionUser();
		User user = userService.getById(sessionUser.getId());
		user.setPassword(MD5Util.md5(password.trim()));
		userService.save(user);
		return success();
	}
	
	@PostMapping("/delete")
	public Object delete(@RequestParam(value="userIds[]",required=true)List<Long> userIds) throws Exception{
		userService.deleteByIds(userIds);
		return success();
	}
	
}
