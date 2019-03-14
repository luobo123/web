package com.szr.framework.auth.web.shiro.config;

import org.apache.shiro.authc.credential.CredentialsMatcher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

import com.szr.framework.auth.web.shiro.realm.ShiroAuthRealm;


@Configuration
@ConditionalOnProperty(prefix = "shiro", name = "enabled", havingValue = "true")
public class ShiroConfiguration {

	protected static final Logger logger = LoggerFactory.getLogger(ShiroConfiguration.class);


	@Bean
	@Order(Ordered.HIGHEST_PRECEDENCE)
	public ShiroAuthRealm shiroRealm(CredentialsMatcher credentialsMatcher) {
		ShiroAuthRealm shiroRealm = new ShiroAuthRealm();
		shiroRealm.setCredentialsMatcher(credentialsMatcher);
		return shiroRealm;
	}

}
