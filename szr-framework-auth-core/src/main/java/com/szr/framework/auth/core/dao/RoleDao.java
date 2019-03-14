package com.szr.framework.auth.core.dao;

import java.util.List;

import org.jeesys.common.jpa.dao.number.BaseDao;
import org.jeesys.common.jpa.entity.BaseEntity.StatusEnum;

import com.szr.framework.auth.model.Role;

/**
 * @author zhushunfu
 * @createTime 2018年12月11日 下午2:39:13
 */
public interface RoleDao extends BaseDao<Role>,RoleDaoCustom {

	List<Role> findByStatus(StatusEnum normal);

}
