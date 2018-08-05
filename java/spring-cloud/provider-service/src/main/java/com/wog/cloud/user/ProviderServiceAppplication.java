package com.wog.cloud.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ImportResource;

/**
 * @Desc 入口函数
 * @author Hurukun
 *
 */
@SpringBootApplication
@EnableDiscoveryClient
//@ImportResource(locations={"${spring.config.locations}"})
public class ProviderServiceAppplication 
{
    public static void main( String[] args )
    {
        SpringApplication.run( ProviderServiceAppplication.class, args);
    }
}
