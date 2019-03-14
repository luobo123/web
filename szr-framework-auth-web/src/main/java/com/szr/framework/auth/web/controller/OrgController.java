package com.szr.framework.auth.web.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.validation.Valid;

import org.jeesys.common.jpa.entity.BaseEntity.StatusEnum;
import org.jeesys.common.web.http.Response.StatusCode;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.szr.framework.auth.core.dto.OrgDto;
import com.szr.framework.auth.core.service.OrgService;
import com.szr.framework.auth.model.Org;

/**
 * @author zhushunfu
 * @createtime 2017年2月15日 上午10:26:56
 * @todo 机构信息管理controller
 */
@RestController
@RequestMapping("/sys/org")
public class OrgController extends BusinessController {

	@Autowired
	private OrgService orgService;

	@GetMapping("/list")
	public Object getOrgDto() throws Exception {
		List<Org> orgList = Arrays.asList(getSessionOrg());
		if(super.isAdmin()){
			orgList = orgService.listParentOrg();
		}
		List<OrgDto> orgDtoList = new ArrayList<>();
		for(Org orgd:orgList) {
			OrgDto orgDto = new OrgDto();
			BeanUtils.copyProperties(orgd, orgDto, "createTime","updateTime","version","parent", "users","children");
			copyOrg(orgd, orgDto);
			
			Comparator<OrgDto> comparator = new Comparator<OrgDto>() {
				public int compare(OrgDto s1, OrgDto s2) {
					Long result = (s1.getId() - s2.getId());
					return result.intValue();
				}
			};
			sortOrgList(orgDto, comparator);
			orgDtoList.add(orgDto);
		}
		return success(orgDtoList);
	}
	
	@GetMapping("/{id}")
	public Object getOrg(@PathVariable Long id) {
		Org org = orgService.getById(id);
		Org tempOrg = new Org();
		BeanUtils.copyProperties(org, tempOrg);
		tempOrg.setChildren(null);
		return success(tempOrg);
	}

	@PostMapping("/save")
	public Object save(@Valid Org org,Long parentId) throws Exception {
		Org parentOrg = null;
		if(parentId == null){
			if(!isAdmin()){
				return failure(StatusCode.SC_40100);
			}
		}else{
			parentOrg = orgService.getById(parentId);			
		}
		org.setParent(parentOrg);
		
		// 判断是否已经存在
		if (orgService.exist(org)) {
			return failure(StatusCode.SC_EXISTS, "该数据在机构下已存在！");
		}

		// 添加
		if (org.getId() == null) {
			orgService.save(org);
			return success();
		}

		orgService.update(org);
		return success();
	}

	
	@PostMapping("/delete/{id}")
	public Object delete(@PathVariable Long id) throws Exception {
		Org org = orgService.getById(id);
		if(org == null){
			return failure(StatusCode.SC_PARAM_ERROR);
		}
		orgService.delete(org);
		return success();
	}
	 
	private void sortOrgList(OrgDto orgDto, Comparator<OrgDto> comparator) {
		if (orgDto.getChildren() != null) {
			Collections.sort(orgDto.getChildren(), comparator);
			for (OrgDto org : orgDto.getChildren()) {
				Collections.sort(org.getChildren(), comparator);
			}
		}
	}

	private void copyOrg(Org org, OrgDto orgDto) {
		if (org.getChildren() != null) {
			for (Org org1 : org.getChildren()) {
				if(!org1.getStatus().equals(StatusEnum.NORMAL)){
					continue;
				}
				OrgDto orgCopy = new OrgDto();
				BeanUtils.copyProperties(org1, orgCopy, "createTime", "creator", "updateTime", "updator", "used",
						"version", "deleted", "parent", "users", "resources", "children");
				orgDto.getChildren().add(orgCopy);
				copyOrg(org1, orgCopy);
			}
		}
	}
}
