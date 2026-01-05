package com.kdt03.ped_accident.global.exception.custom;

public class DuplicateEmailException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public DuplicateEmailException(String message) {
        super(message);
    }
}
