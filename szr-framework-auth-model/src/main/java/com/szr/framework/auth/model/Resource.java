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
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.jeesys.common.jpa.entity.BaseEntity;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Getter;
import lombok.Setter;

/**
 * 资源表
 * @author zsf
 * @创建时间:2016年3月28日 上午9:59:08
 */
@Getter
@Setter
@Entity
@Table(name = "sys_resource")
public class Resource extends BaseEntity implements Comparable<Resource>{
	private static final long serialVersionUID = -6014763757576297289L;

	@Column(length = 64, nullable = false)
	private String name;// 资源名称

	@Column(length = 64, nullable = false)
	private String code;// 资源代码

	@Column(length = 255)
	private String url;// 资源URL

	@Column(length = 100)
	private String icon;// 图标样式

	@Column(length = 50,nullable = false)
	@Enumerated(EnumType.STRING)
	private ResourceType type;// 资源类型

	@Column(nullable = false)
	private Short seq = 1;// 排序序号

	private Boolean lastLevel;// 是否最后一级

	@Column(name = "parent_id")
	private Long parentId;// 上级资源id

	@JsonManagedReference
	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_id")
	private List<Resource> children = new ArrayList<Resource>();// 下级资源
	
	@Override
	public int hashCode() {
		return this.getId() != null ? this.getId().hashCode() : 0;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj != null) {
			if (obj instanceof Resource) {
				Resource resource = (Resource) obj;
				return this.getId().equals(resource.getId());
			} else {
				return false;
			}
		}
		return false;
	}

	@Getter
	public enum ResourceType {
		/**菜单*/
		MENU("菜单"),
		
		/**操作*/
		OPERATION("操作"),
		
		/**数据*/
		DATA("数据");

		String value;
		private ResourceType(String value) {
			this.value = value;
		}
	}

	@Override
	public int compareTo(Resource o) {
		return this.getSeq().intValue() - o.getSeq().intValue();
	}
}