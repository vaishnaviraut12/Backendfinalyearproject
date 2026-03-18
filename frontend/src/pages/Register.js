import React, { useState } from "react";
import { registerUser } from "../services/auth";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      await registerUser(form);
      alert("Registered successfully. Please login.");
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="card">
      <h2>Register</h2>
      <input name="name" placeholder="Name" onChange={onChange} />
      <input name="email" placeholder="Email" onChange={onChange} />
      <input name="password" type="password" placeholder="Password" onChange={onChange} />
      <button onClick={submit}>Register</button>
    </div>
  );
}