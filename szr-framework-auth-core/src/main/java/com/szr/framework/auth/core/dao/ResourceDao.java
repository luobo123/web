package com.szr.framework.auth.core.dao;

import java.util.List;

import org.jeesys.common.jpa.dao.number.BaseDao;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.szr.framework.auth.model.Resource;

/**
 * @author zhushunfu
 * @createTime 2018年12月11日 下午2:39:58
 */
public interface ResourceDao extends BaseDao<Resource> {

	@Query(value="SELECT res.* FROM"
			+ " sys_user_role ur"
			+ " LEFT JOIN sys_role r ON ur.role_id = r.id"
			+ " LEFT JOIN sys_role_resource rr ON r.id = rr.role_id"
			+ " LEFT JOIN sys_resource res ON rr.resource_id = res.id"
			+ " WHERE ur.user_id = :userId AND res.type = 'MENU'"
			+ " ORDER BY res.parent_id ASC,res.seq ASC", nativeQuery=true )
	List<Resource> findUserResource(@Param("userId")Long userId);
	
	@Query(value="SELECT res.* FROM"
			+ " sys_user_role ur LEFT JOIN sys_role r ON ur.role_id=r.id"
			+ " LEFT JOIN sys_role_resource rr ON r.id=rr.role_id"
			+ " LEFT JOIN sys_resource res ON rr.resource_id = res.id"
			+ " WHERE ur.user_id = :usreId AND res.type = 'OPERATION'"
			+ " AND res.parent_id = (SELECT id FROM sys_resource WHERE code = :code)"
			+ " ORDER BY res.parent_id asc,res.seq asc ", nativeQuery=true )
	List<Resource> findOperationResource(@Param("usreId")Long userId, @Param("code")String code);
}
