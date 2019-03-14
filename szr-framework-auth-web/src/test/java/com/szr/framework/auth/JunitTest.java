package com.szr.framework.auth;

import java.util.HashMap;
import java.util.Map;

import org.jeesys.util.FreemarkerUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * @author zhushunfu
 * @createTime 2018年12月20日 下午1:38:57
 */
@Slf4j
public class JunitTest {

	public void testFreemarker(){
		Map<String,Object> params = new HashMap<>();
		Map<String,Object> data = new HashMap<>();
		
		data.put("lastLevel", Boolean.TRUE);
		
		params.put("data",data);
		
		String templateStr = "测试:<#if data.lastLevel>TRUE</#if>";
		log.info(FreemarkerUtil.getContentByTemplateStr(templateStr, params));
	}
}
