import { useState } from "react";
import { login } from "../services/authService";
import { Routes, Route, useNavigate } from "react-router-dom";

export default function Login(){
    const navigate = useNavigate();

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const handleLogin = (e) => {
  e.preventDefault();

  if (
    email === "najwa@gmail.com" &&
    password === "123456"
  ) {
    navigate("/dashboard");
  } else {
    alert("Email atau Password salah");
  }
};

    return(
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white shadow-lg rounded-xl p-8 w-96">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Welcome to QualiTrack
                </h1>
                <h2 className= "text-3x1 font-sans mb-6 text-center">
                    Silahkan Login Untuk Melanjutkan!
                </h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="border w-full p-3 rounded mb-4"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border w-full p-3 rounded mb-4"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}