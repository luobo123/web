package com.szr.framework.auth.core.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.jeesys.common.jpa.entity.BaseEntity.StatusEnum;
import org.jeesys.common.jpa.search.Specifications;
import org.jeesys.common.jpa.service.number.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.szr.framework.auth.core.dao.ResourceDao;
import com.szr.framework.auth.model.Resource;

/**
 * @author zhushunfu
 * @createTime 2018年12月11日 下午2:42:05
 */
@Service
public class ResourceService extends BaseService<Resource> {

	@Autowired
	private ResourceDao resourceDao;
	
	public List<Resource> getByParentId(Long parentId) {
		Specifications.Builder<Resource> builder = Specifications.builder();
		builder.eq("parentId", parentId);
		builder.eq("status", StatusEnum.NORMAL);
		return getAll(builder.build());
	}
	
	@Transactional(readOnly = true)
	public List<Resource> getUserMenus(Long userId) {
		List<Resource> result = new ArrayList<Resource>();
		List<Resource> resourceList = resourceDao.findUserResource(userId);
		
		for (Resource resource : resourceList) {
			if(resource.getParentId() == null){
				List<Resource> childs = getChildResource(resource, resourceList);
				resource.setChildren(childs);
				result.add(resource);
			}
		}
		return result;
	}
	
	private List<Resource> getChildResource(Resource parent,List<Resource> resources){
		List<Resource> childs = new ArrayList<Resource>();
		for(Resource res : resources){
			if(parent.getId().equals(res.getParentId())){
				res.setChildren(getChildResource(res, resources));
				childs.add(res);
			}
		}
		return childs;
	}
	
	public boolean existResource(Resource resource) {
		Specifications.Builder<Resource> builder = Specifications.builder();
		builder.eq("name", resource.getName());
		builder.eq("code", resource.getCode());
		builder.eq("status", StatusEnum.NORMAL);
		
        if(resource.getId() != null){
        	builder.eq("id", resource.getId());
        }
        
		return CollectionUtils.isNotEmpty(getAll(builder.build()));
	}
	
	public List<Resource> getOperationResource(Long userId,String code){
		return resourceDao.findOperationResource(userId, code);
	}
}
