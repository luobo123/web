package com.szr.framework.auth.web.shiro.realm;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.DisabledAccountException;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.PrincipalCollection;
import org.jeesys.common.jpa.entity.BaseEntity.StatusEnum;
import org.jeesys.util.MD5Util;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.ServerProperties;

import com.szr.framework.auth.core.service.ResourceService;
import com.szr.framework.auth.core.service.UserService;
import com.szr.framework.auth.model.Org;
import com.szr.framework.auth.model.Resource;
import com.szr.framework.auth.model.Role;
import com.szr.framework.auth.model.User;
import com.szr.framework.auth.web.util.Constants;

public class ShiroAuthRealm extends AuthorizingRealm {

	protected Logger LOG = LoggerFactory.getLogger(getClass());

	@Autowired
	private UserService userService;
	
	@Autowired
	private ResourceService resourceService;
	
	@Autowired
	private ServerProperties serverProperties;
	/**
	 * 验证
	 */
	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authcToken)
			throws AuthenticationException {
		/* 这里编写认证代码 */
		UsernamePasswordToken token = (UsernamePasswordToken) authcToken;
		String password = MD5Util.md5(new String(token.getPassword()));
		User user = userService.getUserByUsernameAndPassword(token.getUsername(),password);
		if (user == null) {
			throw new UnknownAccountException("用户名或密码错误");
		}
		if(!StatusEnum.NORMAL.equals(user.getStatus())){
			throw new DisabledAccountException();
		}
		Session session = SecurityUtils.getSubject().getSession(true);
		session.setAttribute(Constants.USER_KEY_IN_SESSION,getSessionUser(user));
		session.setAttribute(Constants.USER_RESOURCE_KEY_IN_SESSION, resourceService.getUserMenus(user.getId()));
		return new SimpleAuthenticationInfo(user.getId(), password,getName());
	}

	 /**
     * 授权查询回调函数, 进行鉴权但缓存中无用户的授权信息时调用.
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        User user = (User) SecurityUtils.getSubject().getSession(true).getAttribute(Constants.USER_KEY_IN_SESSION);
        SimpleAuthorizationInfo info = authUser(user.getRoles());
        return info;
    }
	
	 /**
	  * 重写权限判断方法，加入正则判断
	  */
    @Override
    public boolean isPermitted(PrincipalCollection principals, String permission) {
        AuthorizationInfo info = getAuthorizationInfo(principals);
        Collection<String> permissions = info.getStringPermissions();
        return permissions.contains(permission) || patternMatch(permissions, permission);
    }
    
	private User getSessionUser(User user){
		User sessionUser = new User();
		BeanUtils.copyProperties(user, sessionUser,"roles");
		List<Role> roles = user.getRoles();
		List<Role> newRoles = new ArrayList<>();
		for(Role role : roles){
			if(role.getStatus().equals(StatusEnum.NORMAL)){
				Role newRole = new Role();
				BeanUtils.copyProperties(role, newRole,"users","resources");
				newRole.setResources(getResource(role));
				newRoles.add(newRole);				
			}
		}
		sessionUser.setRoles(newRoles);
		sessionUser.setOrg(getSessionOrg(user));
		return sessionUser;
	}
	
	private Org getSessionOrg(User user){
		Org org = new Org();
		BeanUtils.copyProperties(user.getOrg(),org,"users","roles","children");
		return org;
	}
	
	private List<Resource> getResource(Role role){
		List<Resource> resources = role.getResources();
		List<Resource> newResources = new ArrayList<>();
		for(Resource resource : resources){
			if(resource.getStatus().equals(StatusEnum.NORMAL)){
				Resource newResource = new Resource();
				BeanUtils.copyProperties(resource, newResource);			
				newResources.add(newResource);				
			}
		}
		return newResources;
	}
	
    /**
     * 为用户授权.
     *
     * @param userId
     * @return
     */
    private SimpleAuthorizationInfo authUser(List<Role> roles) {
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        for (Role role : roles) {
            if(role!=null){
                info.addRole(role.getId().toString());
            }
            addPermission(info, role);
        }
        return info;
    }

    private void addPermission(SimpleAuthorizationInfo info,Role role){
    	for (Resource resource : role.getResources()) {
    		String permission = resource.getCode();
    		if(!permission.endsWith("_") && !permission.endsWith("*")){
    			permission = permission + "_";
    		}
    		if(!permission.startsWith("_")){
    			permission = "_" + permission;
    		}
    		permission = serverProperties.getContextPath() + permission;
    		permission = permission.replaceAll("_", "/");
    		info.addStringPermission(permission);
    	}
    }
    
    /**
     * 正则
     * @param patternUrlList
     * @param requestUri
     * @return
     */
    public boolean patternMatch(Collection<String> patternUrlList, String requestUri) {
        boolean flag = false;
        for (String patternUri : patternUrlList) {
            if (StringUtils.isNotBlank(patternUri)) {
            	if(Pattern.matches(patternUri,requestUri)){
            		flag = true;
            		break;
            	}
            }
        }
        if(!flag){
        	LOG.error("没有权限:{}",requestUri);        	
        }
        return flag;
    }
}
