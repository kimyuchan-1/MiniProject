package com.kdt03.ped_accident.domain.suggestion.dto;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder

public class PagedItems<T> {
	private List<T> items;
	private int page;
	private int pageSize;
	private long total;
	
}
