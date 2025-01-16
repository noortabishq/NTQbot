import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import video from '../assets/Auth.mp4';

const APP_URL = import.meta.env.VITE_APP_URL;

const Signup = () => {
    const [cookies] = useCookies(["cookie-name"]);
    const navigate = useNavigate();

    useEffect(() => {
        if (cookies.jwt) {
            navigate("/");
        }
    }, [cookies, navigate]);

    const [values, setValues] = useState({ email: "", password: "" });

    const generateError = (error) => toast.error(error, { position: "bottom-right" });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axios.post(
                `${APP_URL}/signup`,
                { ...values },
                { withCredentials: true }
            );

            if (data) {
                if (data.errors) {
                    const { email, password } = data.errors;
                    if (email) generateError(email);
                    else if (password) generateError(password);
                } else {
                    navigate("/");
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="form_container">
            <h2>Create An Account</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={values.email}
                        placeholder="Enter your email"
                        onChange={(e) => setValues({ ...values, email: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={values.password}
                        placeholder="Enter your password"
                        onChange={(e) => setValues({ ...values, password: e.target.value })}
                    />
                </div>
                <button className="auth-button" type="submit">Sign Up</button>
                <span className="auth-span">
                    Already have an account? <Link to="/login">Login</Link>
                </span>
            </form>
            <ToastContainer />
            <div className="auth-video-container">
                <video className="hero-video" autoPlay loop muted>
                    <source src={video} type="video/mp4" />
                </video>
            </div>
        </div>
    );
};

export default Signup;
