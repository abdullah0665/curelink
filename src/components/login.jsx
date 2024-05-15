import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loginError, setLoginError] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			await signInWithEmailAndPassword(auth, email, password);
			navigate('/home');
		} catch (error) {
			console.error("Login Error:", error.code);
			parseFirebaseErrors(error.code);
		}
	};

	// Function to parse Firebase error codes
	const parseFirebaseErrors = (errorCode) => {
		let errorMessage = "An unexpected error occurred. Please try again.";
		switch (errorCode) {
			case "auth/user-not-found":
				errorMessage = "No user found with this email.";
				break;
			case "auth/wrong-password":
				errorMessage = "Incorrect password. Please try again.";
				break;
			case "auth/invalid-credential":
				errorMessage = "The email address is not valid.";
				break;
			case "auth/too-many-requests":
				errorMessage = "auth/too-many-requests. Refresh your page";
				break;
		}
		setLoginError(errorMessage);
	};

	return (
		<div className="container mx-auto my-12 p-8 max-w-md bg-white rounded-lg shadow-2xl">
			<h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Welcome</h2>
			<form autoComplete="off" className="space-y-6" onSubmit={handleLogin}>
				<div>
					<label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
					<input
						type="email"
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						required
						onChange={(e) => setEmail(e.target.value)}
						value={email}
					/>
				</div>

				<div>
					<label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
					<div className="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
							required
							onChange={(e) => setPassword(e.target.value)}
							value={password}
						/>
						<button
							type="button"
							className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? (
								<svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.942 2.566-3.106 4.64-5.821 5.22M15 12a3 3 0 01-3 3m0-3a3 3 0 00-3-3m6 0a3 3 0 00-3 3"
									/>
								</svg>
							) : (
								<svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7 .942-2.566 3.106-4.64 5.821-5.22m10.443 1.22c.334.665.587 1.37.741 2.11M9.878 9.878a3 3 0 014.243 4.243M12 12v.01"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3-3v.01M12 12v.01M12 12v.01"
									/>
								</svg>
							)}
						</button>
					</div>
				</div>

				<div className="flex items-center justify-center">
					<button
						type="submit"
						className="w-full bg-[#291f82] hover:bg-[#0b0638] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150"
					>
						Login
					</button>
				</div>
			</form>
			{loginError && (
				<p className="text-red-500 text-xs italic mt-4">{loginError}</p>
			)}
			<p className="mt-4 text-center">
				Don't have an account?{' '}
				<Link to="/signup" className="text-blue-500 hover:text-blue-700">
					Sign Up
				</Link>
			</p>
		</div>
	);
};

export default Login;
