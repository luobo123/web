package com.szr.framework.auth.core.service;

import java.util.Iterator;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.jeesys.common.jpa.entity.BaseEntity.StatusEnum;
import org.jeesys.common.jpa.search.Specifications;
import org.jeesys.common.jpa.service.number.BaseService;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import com.szr.framework.auth.model.Org;

/**
 * @author zhushunfu
 * @createTime 2018年12月11日 下午2:42:35
 */
@Service
public class OrgService extends BaseService<Org> {

	public List<Org> listParentOrg() {
		Specifications.Builder<Org> builder = Specifications.builder();
		builder.eq("status", StatusEnum.NORMAL);
		builder.eq("parent", null);
		
		List<Org> orgList = getAll(builder.build(), new Sort(Direction.ASC, "createTime"));

		return orgList;
	}

	public List<Org> listOrg(Long id) {
		Specifications.Builder<Org> builder = Specifications.builder();
		builder.eq("id", id);
		builder.eq("status", StatusEnum.NORMAL);
		List<Org> orgList = getAll(builder.build(), new Sort(Direction.ASC, "createTime"));
		removeOrgChild(orgList.get(0));
		return orgList;
	}

	public void removeOrgChild(Org org) {
		List<Org> orgs = org.getChildren();
		if (orgs != null && orgs.size() > 0) {
			for (Iterator<Org> iterator = orgs.iterator(); iterator.hasNext();) {
				Org orgIter = iterator.next();
				if (orgIter.getStatus().equals(StatusEnum.DELETED)) {
					iterator.remove();
					continue;
				}
				removeOrgChild(orgIter);
			}
		}
	}

	public boolean exist(Org org) {
		Specifications.Builder<Org> builder = Specifications.builder();
		builder.eq("orgCode", org.getOrgCode());
		builder.eq("orgName", org.getOrgName());
		builder.eq("status", StatusEnum.NORMAL);
		
		if (org.getId() != null) {
			builder.eq("id", org.getId());
		}
		return CollectionUtils.isNotEmpty(getAll(builder.build()));
	}

	public void update(Org org) {
		Org subOrgCopy = super.getById(org.getId());
		BeanUtils.copyProperties(org, subOrgCopy, "createTime", "updateTime", "version", "id", "parent","status");
		super.save(subOrgCopy);
	}

	@Override
	public void delete(Org org) {
		org.setStatus(StatusEnum.DELETED);
		super.save(org);
		for(Org child : org.getChildren()){
			this.delete(child);
		}
		
	}
}
