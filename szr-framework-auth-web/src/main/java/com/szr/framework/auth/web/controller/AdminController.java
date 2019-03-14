package com.szr.framework.auth.web.controller;

import java.io.UnsupportedEncodingException;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.ExcessiveAttemptsException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.jeesys.common.web.http.Response;
import org.jeesys.common.web.http.Response.StatusCode;
import org.jeesys.common.web.util.RequestUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.szr.framework.auth.model.User;

/**
 * @author zhushunfu
 * @createtime 2017年2月15日 上午11:37:40
 * @todo
 */
@Controller
public class AdminController extends BusinessController {

	@GetMapping({ "/", "/login" })
	public String login() {
		String result = "/admin/login";

		if (RequestUtils.isAjax(getRequest())) {// 如果是ajax请求
			writeJson(new Response(StatusCode.SC_NONE_LOGIN));
			return null;
		}
		return result;
	}
	
	@GetMapping(value = "/index")
	public String index() {
		Subject subject = SecurityUtils.getSubject();
		if(subject == null || !subject.isAuthenticated()) {
			return redirect("/login");
		}
		return "admin/index";
	}

	/**
	 * 登入
	 * @param redirectAttributes
	 * @param user
	 * @param remember
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	@PostMapping(value = "/login", params = { "username", "password" })
	public String login(RedirectAttributes redirectAttributes, @Valid User user, boolean remember)
			throws UnsupportedEncodingException {
		String result = redirect("/login");
		Subject subject = SecurityUtils.getSubject();
		if (!subject.isAuthenticated()) {
			if (StringUtils.isBlank(user.getUsername()) || StringUtils.isBlank(user.getPassword())) {
				redirectAttributes.addFlashAttribute("msg", "用户名或密码错误！");
				return result;
			}
			UsernamePasswordToken userToken = new UsernamePasswordToken(user.getUsername(), user.getPassword(),remember);
			try {
				subject.login(userToken);
				result = redirect("/index");
			} catch (UnknownAccountException e) {
				logger.error("账户或密码错误",e);
				redirectAttributes.addFlashAttribute("msg", "用户名或密码错误");
			} catch (IncorrectCredentialsException e) {
				logger.error("IncorrectCredentialsException",e);
				redirectAttributes.addFlashAttribute("msg","用户名或密码错误");
			} catch (LockedAccountException e) {
				logger.error("用户已经被锁定不能登录，请与管理员联系！",e);
				redirectAttributes.addFlashAttribute("msg", "用户已经被锁定不能登录，请与管理员联系！");
			} catch (ExcessiveAttemptsException e) {
				logger.error("错误次数过多:",e);
				redirectAttributes.addFlashAttribute("msg", "错误次数过多！");
			} catch (Exception e) {
				logger.error("未知的登录错误:",e);
				redirectAttributes.addFlashAttribute("msg", "未知的登录错误！");
			}
		} else {
			result = redirect("/index");
		}
		
		return result;
	}

	@GetMapping({"/sys/{subModule}"})
	public String index(@PathVariable String subModule,HttpServletRequest request){
		return "admin/"+subModule+"/"+subModule+"_index";
	}
	
	@RequestMapping("/logout")
	public String logout() {
		Subject subject = SecurityUtils.getSubject();
		subject.logout();
		cleanCache();
		return redirect("/login");
	}
}
