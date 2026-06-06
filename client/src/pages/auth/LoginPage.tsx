import { useState } from "react";
import API from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      setAuth(res.data.user, res.data.token);

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-950">
      {" "}
      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-8 rounded-xl w-[400px]"
      >
        {" "}
        <h1 className="text-3xl font-bold mb-6 text-white">Login </h1>
        ```
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-zinc-800 mb-4 text-white"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-zinc-800 mb-4 text-white"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-red-500 py-3 rounded font-semibold">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
