import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotpwd, verifyOtp } from '../../API/authentication';

function ForgotPwd() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: '',
        role: "User",
    });

    const [otpSent, setOtpSent] = useState(false);
    const [enteredOtp, setEnteredOtp] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setUser({
            ...user, [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const { data } = await forgotpwd(user.email, user.role);
            if (data.success) {
                setOtpSent(true);
                setMessage(data.message || "OTP sent to your email.");
            } else {
                setMessage(data.message || "Failed to send OTP. Please check your email and role.");
            }
        } catch (error) {
            console.error("Error sending OTP request:", error);
            setMessage("An error occurred while sending OTP. Please try again.");
        }
    };

    const handleOtpVerification = async (e) => {
        if (e.target.value.length === 6) {
            setEnteredOtp(e.target.value);
            setMessage('');
            try {
                const { data } = await verifyOtp(user.email, user.role, e.target.value);
                if (data.success) {
                    navigate('/changepwd', { state: { email: user.email, role: user.role } });
                } else {
                    setMessage(data.message || "Invalid or expired OTP. Please try again.");
                }
            } catch (error) {
                console.error("Error verifying OTP:", error);
                setMessage("An error occurred during OTP verification. Please try again.");
            }
        } else {
            setEnteredOtp(e.target.value);
        }
    };

    return (
        <div className='position-absolute top-50 start-50 translate-middle col-md-3'>
            <div className='border border-2'>
                <div className='m-4'>
                    <h2>Forgot Password</h2>
                    {message && <div className={`alert ${message.includes('sent') || message.includes('success') ? 'alert-success' : 'alert-danger'}`} role="alert">{message}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email" name="email" onChange={handleChange} placeholder={`${user.role}'s Email`} required />
                        </div>
                        <div className='d-flex justify-content-center'>
                            <div className="form-check mx-2">
                                <input className="form-check-input" type="radio" name="role" id="radio-cashier" value="Cashier" onClick={handleChange} required />
                                <label className="form-check-label" htmlFor="radio-cashier">
                                    I am a Cashier
                                </label>
                            </div>
                            <div className="form-check mx-2">
                                <input className="form-check-input" type="radio" name="role" id="radio-admin" value="Admin" onClick={handleChange} required />
                                <label className="form-check-label" htmlFor="radio-admin">
                                    I am an Admin
                                </label>
                            </div>
                        </div>
                        <div className='d-flex justify-content-center m-2'>
                            <button type='submit' className='btn btn-primary px-4'>Send OTP</button>
                        </div>
                    </form>
                    <div className="mb-3 mt-4">
                        <label htmlFor="pin" className="form-label">Enter OTP</label>
                        <input
                            type="number"
                            className="form-control"
                            id="pin"
                            name="pin"
                            onChange={handleOtpVerification}
                            value={enteredOtp}
                            placeholder={`OTP`}
                            required
                            disabled={!otpSent}
                        />
                    </div>
                    <div className='d-flex justify-content-center m-2'>
                        <Link to="/">login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPwd;
