import React, { useState } from "react";
import { loginUser } from "../services/auth";

export default function Login({ setAuth }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      setAuth(res.data.user);
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <input name="email" placeholder="Email" onChange={onChange} />
      <input name="password" type="password" placeholder="Password" onChange={onChange} />
      <button onClick={submit}>Login</button>
    </div>
  );
}