package com.szr.framework.auth.core.dto;

import java.util.ArrayList;
import java.util.List;

import com.szr.framework.auth.model.Org.OrgTypeEnum;

import lombok.Getter;
import lombok.Setter;

/**
 * @author Yao
 * @createtime 2017年3月24日 上午10:15:39
 * @todo
 */
@Getter
@Setter
public class OrgDto {
	
	private Long id;

	private String orgCode; // 机构编码

	private String orgName; // 机构名称

	private String description; // 机构描述

	private Boolean enabled; // 是否启用

	private String orgAddress; // 机构地址

	private OrgTypeEnum orgType;// 机构类型
	
	private String contactName; // 联系人

	private String contactPhone; // 联系人电话

	private String contactEmail; // 联系人邮箱

	private List<OrgDto> children = new ArrayList<OrgDto>();
}
