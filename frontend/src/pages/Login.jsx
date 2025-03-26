import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function Login() {
  const { login, user } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [feildError, setFeildError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async (ev) => {
    ev.preventDefault();
    setFeildError({});
    setLoading(true);
    try {
      if (!username)
        return setFeildError((props) => ({
          ...props,
          username: "username required",
        }));
      else if (!password)
        return setFeildError((props) => ({
          ...props,
          password: "password cannot be empty",
        }));

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_PATH}/api/admin/login`,
        {
          username,
          password,
        }
      );
      if (response.data.success) {
        login(response.data.token);
        console.log(user);
      }
    } catch (error) {
      console.log("error while admin login", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center relative">
      <Link
        className=" absolute top-4 left-4 text-xl text-gray-800 font-semibold flex gap-4"
        to="/"
      >
        <ArrowLeft />
        Back
      </Link>
      <div className=" bg-white w-full max-w-lg rounded-lg shadow-2xl flex flex-col justify-between gap-4 px-8 py-10">
        <h1 className="text-3xl text-gray-900 font-semibold mb-4">Login</h1>
        <form onSubmit={handleLogin} className=" flex flex-col">
          <input
            type="text"
            className=" px-4 py-3 rounded-lg bg-gray-100 outline-none mt-4"
            placeholder="username"
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
          />
          {feildError?.username && (
            <p className=" text-sm text-red-500 px-4">{feildError.username}</p>
          )}
          <input
            type="text"
            className=" px-4 py-3 rounded-lg bg-gray-100 outline-none mt-4"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          {feildError?.password && (
            <p className=" text-sm text-red-500 px-4">{feildError.password}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-3 disabled:opacity-80 rounded-lg text-white bg-slate-700 hover:opacity-60 cursor-pointer outline-none mt-4 flex items-center justify-center"
          >
            {loading ? <Spinner /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
