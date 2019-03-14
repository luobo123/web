package com.szr.framework.auth.web.controller;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.jeesys.common.jpa.entity.BaseEntity.StatusEnum;
import org.jeesys.common.web.http.Response;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.szr.framework.auth.core.service.ResourceService;
import com.szr.framework.auth.model.Resource;

/**
 * @author zhushunfu
 * @createtime 2017年2月15日 上午10:26:56
 * @todo 机构信息管理controller
 */
@RestController
@RequestMapping("/sys/resource")
public class ResourceController extends BusinessController {

	@Autowired
	private ResourceService resourceService;
	
	@GetMapping("/list")
	public Object all(){
		List<Resource> resources = resourceService.getAll();
		List<Resource> result = new ArrayList<Resource>();
		for (Resource resource : resources) {
			Resource temp=new Resource();
			BeanUtils.copyProperties(resource, temp,"children");
			result.add(temp);
		}
		return success(result);
	}
	
	@GetMapping("/get")
	public Object getResourceByParentId(Long parentId) {
		List<Resource> resources = null;
		resources = resourceService.getByParentId(parentId);
		return success(resources);
	}
	
	@PostMapping("/save")
	public Object save(Resource resource)throws Exception {
		//判断是否已经存在
		resource.setId(null);
		if(resourceService.existResource(resource)){
	         return failure(Response.StatusCode.SC_EXISTS, "该数据在机构下已存在！");
		}
		resourceService.save(resource);
		return success();
	}
	
	@PostMapping("edit/{id}")
	public Object edit(@Valid Resource resource,@PathVariable Long id) throws Exception {
		//判断是否已经存在
		Resource orginalResource = resourceService.getById(id);
		if(orginalResource == null){
			return failure(Response.StatusCode.SC_PARAM_ERROR);
		}
		
		orginalResource.setCode(resource.getCode());
		orginalResource.setDescription(resource.getDescription());
		orginalResource.setLastLevel(resource.getLastLevel());
		orginalResource.setName(resource.getName());
		orginalResource.setSeq(resource.getSeq());
		orginalResource.setType(resource.getType());
		orginalResource.setUrl(resource.getUrl());
		orginalResource.setIcon(resource.getIcon());
		resourceService.save(orginalResource);
		return success();
	}
	
	@PostMapping("/delete/{id}")
	public Object delete(@PathVariable Long id){
		Resource resource = resourceService.getById(id);
		if(resource == null){
			return failure(Response.StatusCode.SC_PARAM_ERROR);
		}
		resource.setStatus(StatusEnum.DELETED);
		resourceService.save(resource);
		return success();
	}
}
