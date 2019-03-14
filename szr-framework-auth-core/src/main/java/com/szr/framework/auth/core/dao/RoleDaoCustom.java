package com.szr.framework.auth.core.dao;

import java.util.List;

import com.szr.framework.auth.core.dto.ResourceDto;

/**
 * @author zhushunfu
 * @createTime 2018年12月11日 下午2:52:38
 */
public interface RoleDaoCustom {

	List<ResourceDto> findRoleResources(Long roleId);
}
