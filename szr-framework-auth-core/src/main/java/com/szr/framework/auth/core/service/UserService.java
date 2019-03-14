package com.szr.framework.auth.core.service;

import java.util.List;

import org.jeesys.common.jpa.entity.BaseEntity.StatusEnum;
import org.jeesys.common.jpa.service.number.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.szr.framework.auth.core.dao.OrgDao;
import com.szr.framework.auth.core.dao.RoleDao;
import com.szr.framework.auth.core.dao.UserDao;
import com.szr.framework.auth.model.Role;
import com.szr.framework.auth.model.User;

/**
 * @author zhushunfu
 * @createTime 2018年12月11日 下午2:40:54
 */
@Service
@Transactional
public class UserService extends BaseService<User> {

	@Autowired
	private UserDao userDao;
	
	@Autowired
	private RoleDao roleDao;
	
	@Autowired
	private OrgDao orgDao;
	
	public User getUserByUsername(String username){
		return userDao.findByUsername(username);
	}

	@Transactional(readOnly=true)
	public User getUserByUsernameAndPassword(String username,String password){
		return userDao.findByUsernameAndPassword(username,password);
	}
	
	public Page<User> getByOrgId(Long orgId,Pageable pageable){
		return userDao.findByOrgId(orgId,pageable);
	}
	
	public boolean existUser(User user){
		if(user.getId() == null){
			User orginalUser = getUserByUsername(user.getUsername());
			return  orginalUser != null && !orginalUser.getStatus().equals(StatusEnum.DELETED);
		}
		return getById(user.getId()) != null;
	}
	
	/**
	 * 保存用户
	 * 
	 * @param user
	 * @param roleIds
	 * @return
	 */
	public User saveUser(User user,Long orgId, List<Long> roleIds){
		List<Role> roles = roleDao.findAll(roleIds);
		user.setRoles(roles);
		user.setOrg(orgDao.findOne(orgId));
		userDao.save(user);
		return user;
	}
}
