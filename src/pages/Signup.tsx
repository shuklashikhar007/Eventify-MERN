import { useState, type FormEvent } from "react";
import "./signup.css";

const Signup = () => {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");

    const SubmitEvent = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await signupUser(email, password);
            alert("Signup Successful");
        } catch (error) {
            alert("Signup Failed");
            console.error(error);
        }
    };

    const signupUser = async (email: string, password: string) => {
        // TODO: Replace with real backend API call
        console.log("Registering user:", email, password);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email.endsWith("@college.com") && password.length >= 6) {
                    resolve({ status: "ok" });
                } else {
                    reject("Invalid signup credentials");
                }
            }, 1000);
        });
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={SubmitEvent}>
                <h2>Create an Account</h2>
                <input type="text" placeholder="Enter college email" value={email} onChange={(e) => setemail(e.target.value)} required />
                <input type="password" placeholder="Create a password" value={password} onChange={(e) => setpassword(e.target.value)} required />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
