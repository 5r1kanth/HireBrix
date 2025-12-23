package com.crm.hirebrix.common;

public final class NameUtils {

    private NameUtils() {}

    public static String normalize(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String[] words = value.trim().split("\\s+");
        StringBuilder result = new StringBuilder();

        for (String word : words) {
            result.append(word.substring(0, 1).toUpperCase())
                    .append(word.substring(1).toLowerCase())
                    .append(" ");
        }

        return result.toString().trim();
    }
}
