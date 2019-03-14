package com.szr.framework.auth.web.dto;

import org.jeesys.common.web.http.Response;

import lombok.Getter;
import lombok.Setter;

/**
 * @author zhushunfu
 * @createTime 2018年12月11日 下午4:27:24
 */
public class DataTableResponse extends Response{
	private static final long serialVersionUID = -5865807682118335363L;
	@Getter
	@Setter
	private int draw;

	public DataTableResponse(){}
	
	public DataTableResponse(Object data){
		this(1, data);
	}
	
	public DataTableResponse(int draw, Object data){
		this.draw = draw;
		this.data = data;
	}
}
