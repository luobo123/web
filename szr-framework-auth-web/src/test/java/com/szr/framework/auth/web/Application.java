package com.szr.framework.auth.web;

import org.jeesys.common.jpa.repository.support.GenericJpaRepositoryFactoryBean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * @author zhushunfu
 * @createtime 2017年1月20日 下午4:00:54
 * @todo程序启动类
 */
@SpringBootApplication(scanBasePackages={"org.jeesys","com.szr"})
@PropertySources({
	@PropertySource(encoding="UTF-8",value={"classpath:config/jdbc.properties"}),
	@PropertySource(encoding="UTF-8",value={"classpath:config/freemarker.properties"}),
	@PropertySource(encoding="UTF-8",value={"classpath:config/shiro.properties"}),
//	@PropertySource(encoding="UTF-8",value={"classpath:config/hibernate.properties"}),
})
@EntityScan(basePackages={"com.szr"})
@EnableJpaRepositories(basePackages = "com.szr",repositoryFactoryBeanClass = GenericJpaRepositoryFactoryBean.class)
public class Application {
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}