package com.szr.framework.auth.core.dao;

import org.jeesys.common.jpa.dao.number.BaseDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.szr.framework.auth.model.User;

/**
 * @author zhushunfu
 * @createTime 2018年12月11日 下午2:38:37
 */
public interface UserDao extends BaseDao<User> {

	User findByUsername(String username);

	User findByUsernameAndPassword(String username, String password);

	Page<User> findByOrgId(Long orgId, Pageable pageable);

}
