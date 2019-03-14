package com.szr.framework.auth.core.service;

import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.MatchMode;
import org.jeesys.common.jpa.entity.BaseEntity.StatusEnum;
import org.jeesys.common.jpa.search.Specifications;
import org.jeesys.common.jpa.service.number.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.szr.framework.auth.core.dao.RoleDao;
import com.szr.framework.auth.core.dto.ResourceDto;
import com.szr.framework.auth.model.Role;

/**
 * @author zhushunfu
 * @createTime 2018年12月11日 下午2:41:35
 */
@Service
public class RoleService extends BaseService<Role> {

	@Autowired
	private RoleDao roleDao;
	
	public List<Role> getUsable(){
		return roleDao.findByStatus(StatusEnum.NORMAL);
	}
	
	public Page<Role> getRolePage(Role role, Pageable page) {
		Specifications.Builder<Role> builder = Specifications.builder();
		
		if(StringUtils.isNotBlank(role.getRoleName())){
			builder.like("roleName", role.getRoleName(), MatchMode.ANYWHERE);
		}
		if(role.getStatus() != null){
			builder.eq("status",role.getStatus());
		}
		
		return super.getPage(builder.build(), page);
	}
	
	public boolean exist(Role role) {
		Specifications.Builder<Role> builder = Specifications.builder();
        
        if(role.getId() != null){
        	builder.eq("id", role.getId());
        }
        
        if(StringUtils.isNotBlank(role.getRoleName())){
			builder.eq("roleName", role.getRoleName());
		}
		
		return !CollectionUtils.isEmpty(getAll(builder.build()));
	}
	
	public List<ResourceDto> getRoleResources(Long roleId){
		return roleDao.findRoleResources(roleId);
	}
}
