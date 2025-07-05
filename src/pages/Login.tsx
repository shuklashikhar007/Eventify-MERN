import { useState, type FormEvent } from "react";
import "./Login.css";

const Login = () => {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");

    const submithandler = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await loginUser(email, password);
            alert("Login Successful");
        } catch (error) {
            alert("Login Failed");
            console.error(error);
        }
    };

    const loginUser = async (email: string, password: string) => {
        // TODO: Replace this with real API call
        console.log("Sending login request...", email, password);

        // Simulate network delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === "admin@college.com" && password === "123456") {
                    resolve({ status: "ok" });
                } else {
                    reject("Invalid credentials");
                }
            }, 1000);
        });
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={submithandler}>
                <h2>Login to Eventify</h2>
                <input type="email" placeholder="Enter college email" value={email} onChange={(e) => setemail(e.target.value)} required />
                <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setpassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
