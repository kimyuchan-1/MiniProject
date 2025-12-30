package com.kdt03.ped_accident.global.exception.custom;

public class DataNotFoundException extends RuntimeException {
	
	private static final long serialVersionUID = 1L;

	public DataNotFoundException(String message) {
        super(message);
    }
}