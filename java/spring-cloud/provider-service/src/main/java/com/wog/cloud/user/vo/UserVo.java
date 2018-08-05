package com.wog.cloud.user.vo;

import java.math.BigDecimal;

/**
 * @Desc 用户信息对象
 * @author Hurukun
 *
 */
public class UserVo {
	private long id;
	private String userName;
	private String name;
	private Integer age;
	private BigDecimal balance;
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer getAge() {
		return age;
	}
	public void setAge(Integer age) {
		this.age = age;
	}
	public BigDecimal getBalance() {
		return balance;
	}
	public void setBalance(BigDecimal balance) {
		this.balance = balance;
	}
	
	
}
