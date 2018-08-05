package com.wog.cloud.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.feign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

/**
 * @Desc 入口函数
 * @author Hurukun
 *
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients //[FEIGN_STEP_5_1]
public class ConsumerServiceAppplication 
{
	/**
	 * @Desc 定义 restTemplate Bean
	 * @return
	 */
	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
	
	/**
	 * @Desc 主函数入口
	 * @param args
	 */
    public static void main( String[] args ){
        SpringApplication.run( ConsumerServiceAppplication.class, args);
    }
}
