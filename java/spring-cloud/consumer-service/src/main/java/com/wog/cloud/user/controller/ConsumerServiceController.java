package com.wog.cloud.user.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.wog.cloud.user.service.UserFeignClient;

@RestController
public class ConsumerServiceController {
	@Autowired
	private RestTemplate restTemplate;
	
	@Value("${user.serviceUrl}")
	private String serviceUrl;
	
	//使用 Feign [FEIGN_STEP_5_3]
	@Autowired
	private UserFeignClient userFeignClient;
	
	@GetMapping("/user/{id}")
	public Map<String,Object> findById( @PathVariable Long id ) {
		@SuppressWarnings("unchecked")
		Map<String,Object> result = this.restTemplate.getForObject( this.serviceUrl + id, Map.class );
		
		return result;
	}
	
	//[FEIGN_STEP_5_4]
	@GetMapping("/user/feign/{id}")
	public Map<String,Object> findByIdByFeign( @PathVariable Long id ) {
		return this.userFeignClient.findById(id);
	}
	
}
