package com.szr.framework.auth.web.controller;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.jeesys.common.jpa.entity.BaseEntity.StatusEnum;
import org.jeesys.common.jpa.search.DataTablePage;
import org.jeesys.common.web.http.Response;
import org.jeesys.common.web.http.Response.StatusCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.szr.framework.auth.core.dto.ResourceDto;
import com.szr.framework.auth.core.service.ResourceService;
import com.szr.framework.auth.core.service.RoleService;
import com.szr.framework.auth.model.Resource;
import com.szr.framework.auth.model.Role;


/**
 * @author zhushunfu
 * @createtime 2017年2月15日 上午10:26:56
 * @todo 机构信息管理controller
 */
@Controller
@RequestMapping("/sys/role")
public class RoleController extends BusinessController {

	@Autowired
	private RoleService roleService;
	
	@Autowired
	private ResourceService resourceService;
	
	/**
	 * 查询所有角色
	 * @param orgId
	 * @return
	 */
	@ResponseBody
	@PostMapping("/list")
	public Object getRolePage(Role role,DataTablePage page){
		role.setStatus(StatusEnum.NORMAL);
		Page<Role> rolePage = roleService.getRolePage(role,page);
		return dataTableResponse(page.getDraw(),rolePage);
	}
	
	@ResponseBody
	@GetMapping("/resource/{roleId}")
	public Response getOrgResources(@PathVariable Long roleId){
		Role orginalRole = roleService.getById(roleId);
		if(orginalRole == null){
			return failure(StatusCode.SC_PARAM_ERROR);
		}
		List<ResourceDto> resources = roleService.getRoleResources(roleId);
		return success(resources);
	}
	
	
	@ResponseBody
	@PostMapping("/save")
	public Response saveRole(@Valid Role role)throws Exception {
		//判断是否已经存在
		if(roleService.exist(role)){
	         return failure(StatusCode.SC_EXISTS);
		}
		
		Role newRole = new Role();
		newRole.setDescription(role.getDescription());
		newRole.setRoleName(role.getRoleName());
		roleService.save(newRole);
		return success();
	}
	
	@ResponseBody
	@PostMapping("/edit/{id}")
	public Response edit(@Valid Role role,@PathVariable Long id)throws Exception {
		Role orginalRole = roleService.getById(id);
		if(orginalRole == null){
			return failure(StatusCode.SC_PARAM_ERROR);
		}
		orginalRole.setRoleName(role.getRoleName());
		orginalRole.setDescription(role.getDescription());
		roleService.save(orginalRole);
		return success();
	}
	
	@ResponseBody
	@PostMapping("/delete/{id}")
	public Response delete(@PathVariable Long id)throws Exception {
		Role role = roleService.getById(id);
		if(role == null){
			return failure(StatusCode.SC_PARAM_ERROR);
		}
		if(role.getRoleName().equals("admin")){
			return failure(StatusCode.SC_PARAM_ERROR,"超级管理员角色不能删除");
		}
		role.setStatus(StatusEnum.DELETED);
		roleService.save(role);
		return success();
	}
	
	@ResponseBody
	@PostMapping(value="/auth/{id}")
	public Response auth(@PathVariable("id")Long roleId,@RequestParam(value="resourceIds[]",required=false)List<Long> resourceIds)
			throws Exception {
		List<Resource> resources=resourceService.getAll(resourceIds);
		Role role=roleService.getById(roleId);
		role.setResources(new ArrayList<>(resources));
		roleService.save(role);
		return new Response();
	}
}
