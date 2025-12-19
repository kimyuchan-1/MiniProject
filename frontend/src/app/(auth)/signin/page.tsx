'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";

export default function Signin() {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.id]: e.target.value });
    }
    const router = useRouter();

    const loginButton = async () => {
        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                const jwtToken = response.headers.get("Authorization");
                if (jwtToken) {
                    sessionStorage.setItem("jwtToken", jwtToken);
                    sessionStorage.setItem("username", credentials.username);
                }
                router.push("/welcome");
            } else {
                alert("로그인 실패!");
            }
        } catch (error) {
            console.error("로그인 중 오류 발생:", error);
        }
    };

    return (
        <div className="min-h-screen m-0 p-0 flex justify-center items-center font-sans bg-gray-50">
            <div className='w-full max-w-100 bg-white p-10 rounded-xl text-center shadow-[0_15px_35px_rgba(0,0,0,0.1)]'>
                <h2 className='text-[28px] font-light text-[#333] mb-7.5'>로그인</h2>
                <div className='mb-5 text-left'>
                    <label className='block mb-2 text-[#555] font-medium text-sm'>사용자명</label>
                    <input className='w-full box-border px-4 py-3 border-2 border-[#e1e5e9] rounded-lg text-base transition-all duration-300 ease-in-out focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]' type="text" id="username" placeholder="사용자명을 입력하세요" value={credentials.username} onChange={handleChange} />
                </div>

                <div className='mb-5 text-left'>
                    <label className='block mb-2 text-[#555] font-medium text-sm'>비밀번호</label>
                    <input className="w-full box-border px-4 py-3 border-2 border-[#e1e5e9] rounded-lg text-base transition-all duration-300 ease-in-out focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]" type="password" id="password" placeholder="비밀번호를 입력하세요" value={credentials.password} onChange={handleChange} />
                </div>

                <button className="w-full py-3.5 px-0 mt-2.5 rounded-lg border-0 text-base font-semibold text-white cursor-pointer transition-all duration-300 ease-in-out bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(102,126,234,0.3)] active:translate-y-0" type="button" onClick={loginButton}>로그인</button>
                <div className='my-7.5 text-center relative'>
                    <span className="absolute top-1/2 left-0 right-0 h-px bg-[#e1e5e9] -translate-y-1/2"></span>
                    <span className='relative bg-white px-5 text-[#666] text-sm'>또는</span>
                </div>
                <a href="http://localhost:8080/oauth2/authorization/google" className='inline-block w-full box-border p-3 rounded-lg text-base font-medium text-white no-underline transition-all duration-300 ease-in-out bg-[#4285f4] hover:bg-[#3367d6] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(66,133,244,0.3)] active:translate-y-0'>
                    <span className='flex flex-row items-center justify-center'>
                        <FcGoogle />&nbsp;구글으로 로그인
                    </span>
                </a>
                <a href="http://localhost:8080/oauth2/authorization/naver" className="inline-block w-full box-border p-3 mt-2.5 rounded-lg text-base font-medium text-white no-underline transition-all duration-300 ease-in-out bg-[#2DB400] hover:bg-[#16AA52] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(45,180,0,0.3)] active:translate-y-0">
                    <span className='flex flex-row items-center justify-center'>
                        <Image src="naver.svg" alt="naver logo" width={16} height={16} className='rounded-xs'/>&nbsp;Naver로 로그인
                    </span>
                </a>

                <a href="http://localhost:8080/oauth2/authorization/github" className="inline-block w-full box-border p-3 mt-2.5 rounded-lg text-base font-medium text-white no-underline transition-all duration-300 ease-in-out bg-[#24292e] hover:bg-[#171515] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(23,21,21,0.3)] active:translate-y-0 ">
                    <span className='flex flex-row items-center justify-center'>
                        <FaGithub />&nbsp;GitHub로 로그인
                    </span>
                </a>
            </div>
        </div>
    );
}