import axios from "axios";

export const backendClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 15000,
  // Spring Boot가 쿠키 기반 인증이면 아래는 “브라우저 axios”에서 의미가 크고,
  // Next Route Handler(server)에서는 cookie 헤더를 수동 전달하는 게 핵심이야.
  withCredentials: true,
});
