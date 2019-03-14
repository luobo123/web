package com.szr.framework.auth.core.dto;

import java.util.ArrayList;
import java.util.List;

import com.szr.framework.auth.model.Resource;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResourceDto extends Resource{

	private static final long serialVersionUID = -6742328518536925293L;

	private String isSelected;

	private List<ResourceDto> childs = new ArrayList<ResourceDto>();
}
