package com.szr.framework.auth.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.jeesys.common.jpa.entity.BaseEntity;

import com.alibaba.fastjson.annotation.JSONField;

import lombok.Getter;
import lombok.Setter;

/**
 * 机构信息
 * 
 * @author zhushunfu
 * @createtime 2017年2月9日 下午6:04:00
 */
@Getter
@Setter
@Entity
@Table(name = "sys_org")
public class Org extends BaseEntity{
	private static final long serialVersionUID = -8049282051476270129L;

	@Column(length = 50,nullable = false)
	private String orgCode; // 机构编码

	@Column(length = 100,nullable = false)
	private String orgName; // 机构名称

	@Column(length = 200)
	private String orgAddress; // 机构地址

	@Column(length=10,nullable = false)
	@Enumerated(EnumType.STRING)
	private OrgTypeEnum orgType;// 机构类型

	@Column(length = 20)
	private String contactName; // 联系人

	@Column(length = 20)
	private String contactPhone; // 联系人电话

	@Column(length = 50)
	private String contactEmail; // 联系人邮箱

	@ManyToOne
	@JoinColumn(name = "parent_id")
	private Org parent;// 父类id
	
	@OneToMany(fetch=FetchType.LAZY,mappedBy="org")
	private List<User> users;//机构下的用户
	
	@JSONField(serialize = false)
	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "parent")
	private List<Org> children = new ArrayList<Org>();

	/**
	 * 机构类型枚举
	 * @author zhushunfu
	 * @createTime 2018年12月11日 下午1:59:59
	 */
	public enum OrgTypeEnum {
		/** 片区*/
		DISTRICT("片区"),

		/**大区*/
		AREA("大区"),

		/**门店*/
		STORE("门店"),

		/**城市*/
		CITY("城市"),

		/**公司*/
		COMPANY("公司"),

		/**部门*/
		DEPARTMENT("部门"),

		/**团队*/
		TEAM("团队");

		private String value;

		private OrgTypeEnum(String value) {
			this.value = value;
		}

		public String getValue() {
			return this.value;
		}
	}
}