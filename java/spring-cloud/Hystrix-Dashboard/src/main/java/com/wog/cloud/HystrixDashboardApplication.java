package com.wog.cloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.hystrix.dashboard.EnableHystrixDashboard;

/**
 * @Desc 入口函数
 * @author Hurukun
 * @version 1.0
 */
@SpringBootApplication
@EnableHystrixDashboard
public class HystrixDashboardApplication {

	public static void main( String[] args ){
        SpringApplication.run( HystrixDashboardApplication.class, args);
    }

}
