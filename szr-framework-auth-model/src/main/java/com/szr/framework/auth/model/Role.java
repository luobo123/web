package com.szr.framework.auth.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import org.jeesys.common.jpa.entity.BaseEntity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * 角色表
 * @author zhushunfu
 * @createtime 2017年2月15日 下午2:51:15
 * @todo
 */
@Entity
@Table(name = "sys_role")
@Getter
@Setter
@Accessors(chain=true)
public class Role extends BaseEntity {
	private static final long serialVersionUID = 7233615673635279450L;

	@Column(length = 50, nullable = false)
	private String roleName;// 角色名

	@JsonBackReference
	@ManyToMany(mappedBy = "roles")
	private List<User> users = new ArrayList<User>();
	
	@JsonBackReference
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "sys_role_resource", joinColumns = @JoinColumn(name = "role_id"), inverseJoinColumns = @JoinColumn(name = "resource_id"))
	private List<Resource> resources = new ArrayList<Resource>();
}
