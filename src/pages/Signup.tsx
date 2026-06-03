import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router";
import { useUserStore } from "@/store/user";
import { Loader } from "lucide-react";
import "./signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useUserStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailLower = email.toLowerCase().trim();
    if (!emailLower.endsWith("@itbhu.ac.in") && !emailLower.endsWith("@iitbhu.ac.in")) {
      setError("Only @itbhu.ac.in or @iitbhu.ac.in emails are allowed.");
      return;
    }

    setIsLoading(true);
    const err = await signup(name, email, password);
    setIsLoading(false);

    if (err) {
      setError(err);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>

        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          maxLength={100}
        />

        <input
          type="email"
          placeholder="College email (e.g. you@iitbhu.ac.in)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Create a password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? <Loader className="size-4 animate-spin inline mr-2" /> : null}
          Sign Up
        </button>

        <p className="text-sm text-center mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
