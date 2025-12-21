package com.crm.hirebrix.common;

public record ApiResponse<T>(boolean success, T data) {}
