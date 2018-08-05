package com.wog.cloud.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.wog.cloud.user.dos.UserDos;
import com.wog.cloud.user.vo.UserVo;

@RestController
public class ProviderServiceController {
	@Autowired
	private UserDos userDos;
	
	@Autowired
	private DiscoveryClient discoveryClient;
	
	@GetMapping("/{id}")
	public UserVo findById( @PathVariable Long id ) {
		UserVo user = userDos.findById( id );
		return user;
	}
	
	@GetMapping("/user-instance")
	public List<ServiceInstance> showInfo() {
		return this.discoveryClient.getInstances("user-service");
	}
}
