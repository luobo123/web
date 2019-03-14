package com.szr.framework.auth.core.dao.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jeesys.common.jpa.entity.BaseEntity;
import org.jeesys.common.jpa.repository.query.AbstractSqlRepository;
import org.springframework.stereotype.Repository;

import com.szr.framework.auth.core.dao.RoleDaoCustom;
import com.szr.framework.auth.core.dto.ResourceDto;


/**
 * @author zhushunfu
 * @createTime 2018年12月11日 下午2:52:57
 */
@Repository
public class RoleDaoImpl extends AbstractSqlRepository implements RoleDaoCustom {
	
	@Override
	public List<ResourceDto> findRoleResources(Long roleId) {
		String sql = "SELECT "
				+ " CASE  WHEN rr.resource_id is null THEN 'false' ELSE 'true' END isSelected, "
				+ " rs.id,rs.parent_id parentId,rs.name,rs.icon,rs.seq "
				+ " FROM sys_resource rs "
				+ " LEFT JOIN sys_role_resource rr ON (rs.id=rr.resource_id and rr.role_id = :roleId )"
				+ " LEFT JOIN sys_role r ON r.id = rr.role_id "
                + " WHERE rs.status = :status "
				+ " ORDER BY rs.parent_id ASC,rs.seq ASC";
		

		Map<String,Object> param = new HashMap<String,Object>();
		param.put("roleId", roleId);
		param.put("status", BaseEntity.StatusEnum.NORMAL.name());
		
		List<ResourceDto> resourceDtos = super.list(sql, param, ResourceDto.class);
		Map<Long, ResourceDto> resourceMap = new HashMap<Long, ResourceDto>();
		for(ResourceDto resourceDto : resourceDtos){
			resourceMap.put(resourceDto.getId(), resourceDto);
		}
		return wrapResources(resourceMap);
	}

	public List<ResourceDto> wrapResources(Map<Long, ResourceDto> resourceMap) {
		List<ResourceDto> resources = new ArrayList<ResourceDto>();
		for (Map.Entry<Long, ResourceDto> entity : resourceMap.entrySet()) {
			ResourceDto resourceDto = entity.getValue();
			Long parentId = resourceDto.getParentId();
			if (parentId != null) {
				resourceMap.get(parentId).getChilds().add(resourceDto);
			} else {
				resources.add(resourceDto);
			}
		}
		Comparator<ResourceDto> comparator = new Comparator<ResourceDto>() {
			public int compare(ResourceDto s1, ResourceDto s2) {
				return (int) (s1.getSeq() - s2.getSeq());
			}
		};

		sortResources(resources, comparator);
		return resources;
	}

	public void sortResources(List<ResourceDto> resources, Comparator<ResourceDto> comparator) {
		Collections.sort(resources, comparator);
		for (ResourceDto resource : resources) {
			if (resource.getChilds() != null && resource.getChilds().size() > 0) {
				sortResources(resource.getChilds(), comparator);
			}
		}
	}
	
}
