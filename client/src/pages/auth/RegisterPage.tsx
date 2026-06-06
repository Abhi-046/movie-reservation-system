import { useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-950">
      {" "}
      <form
        onSubmit={handleRegister}
        className="bg-zinc-900 p-8 rounded-xl w-[400px]"
      >
        {" "}
        <h1 className="text-3xl font-bold mb-6 text-white">Register </h1>
        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 rounded bg-zinc-800 mb-4 text-white"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-zinc-800 mb-4 text-white"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-zinc-800 mb-6 text-white"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-red-500 py-3 rounded font-semibold">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
