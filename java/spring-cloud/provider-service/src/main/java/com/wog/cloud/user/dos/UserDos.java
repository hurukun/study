package com.wog.cloud.user.dos;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.wog.cloud.user.vo.UserVo;

@Component("batchTaskDos")
public class UserDos {
	public UserVo findById( Long id ) {
		UserVo result = new UserVo();
		result.setId( id );
		result.setName( "Nobody" );
		return result;
	}
}
