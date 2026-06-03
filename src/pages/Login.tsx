import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router";
import { useUserStore } from "@/store/user";
import { Loader } from "lucide-react";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const err = await login(email, password);
    setIsLoading(false);

    if (err) {
      setError(err);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login to Eventify</h2>

        <input
          type="email"
          placeholder="College email (e.g. you@iitbhu.ac.in)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? <Loader className="size-4 animate-spin inline mr-2" /> : null}
          Login
        </button>

        <p className="text-sm text-center mt-2">
          Don't have an account?{" "}
          <Link to="/Signup" className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
