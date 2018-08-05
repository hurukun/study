package com.wog.cloud.user.service;

import java.util.Map;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

//[FEIGN_STEP_5_2]
@FeignClient(name="provider-service")
public interface UserFeignClient {
	@RequestMapping(value="/{id}", method=RequestMethod.GET)
	public Map<String,Object> findById( @PathVariable("id") Long id );
}
