package com.szr.framework.auth.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OrderBy;
import javax.persistence.Table;

import org.jeesys.common.jpa.entity.BaseEntity;

import com.alibaba.fastjson.annotation.JSONField;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * 用户表
 * 
 * @author zhushunfu
 * @createtime 2017年2月15日 下午2:02:45
 * @todo
 */
@Entity
@Table(name = "sys_user")
@Getter
@Setter
@Accessors(chain=true)
public class User extends BaseEntity {
	private static final long serialVersionUID = -742347969616618890L;

	@Column(length = 50, nullable = false)
	private String username;// 用户名

	@JSONField(serialize = false)
	@JsonIgnore
	@Column(length = 64, nullable = false)
	private String password;// 密码

	@Column(length = 50)
	private String mobile; // 手机号

	@Column(length = 50)
	private String email; // emaill

	@JsonBackReference
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "org_id", nullable = false)
	private Org org;// 所属org
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "sys_user_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
	@OrderBy("createTime")
	private List<Role> roles = new ArrayList<Role>();//所属角色
}
