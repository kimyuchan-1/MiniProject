package com.kdt03.ped_accident.global.config.security;

import java.util.Base64;
import java.util.Optional;

import org.springframework.util.SerializationUtils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CookieUtils {
	public static Optional<Cookie> getCookie(HttpServletRequest request, String name) {
		Cookie[] cookies = request.getCookies();
		if (cookies == null)
			return Optional.empty();
		for (Cookie c : cookies) {
			if (name.equals(c.getName()))
				return Optional.of(c);
		}
		return Optional.empty();
	}

	public static void addCookie(HttpServletResponse response, String name, String value, int maxAge) {
		Cookie cookie = new Cookie(name, value);
		cookie.setPath("/");
		cookie.setHttpOnly(true);
		cookie.setMaxAge(maxAge);
		response.addCookie(cookie);
	}

	public static void deleteCookie(HttpServletRequest request, HttpServletResponse response, String name) {
		Cookie[] cookies = request.getCookies();
		if (cookies == null)
			return;
		for (Cookie c : cookies) {
			if (name.equals(c.getName())) {
				Cookie cookie = new Cookie(name, "");
				cookie.setPath("/");
				cookie.setHttpOnly(true);
				cookie.setMaxAge(0);
				response.addCookie(cookie);
			}
		}
	}

	public static String serialize(Object obj) {
		return Base64.getUrlEncoder().encodeToString(SerializationUtils.serialize(obj));
	}

	@SuppressWarnings("unchecked")
	public static <T> T deserialize(Cookie cookie, Class<T> cls) {
		byte[] data = Base64.getUrlDecoder().decode(cookie.getValue());
		Object obj = SerializationUtils.deserialize(data);
		return (T) obj;
	}
}
