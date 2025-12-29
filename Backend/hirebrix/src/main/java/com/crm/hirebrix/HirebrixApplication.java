package com.crm.hirebrix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HirebrixApplication {

	public static void main(String[] args) {
		SpringApplication.run(HirebrixApplication.class, args);
	}

}
