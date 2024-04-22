import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loginError, setLoginError] = useState('');
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
		<div className="container mx-auto my-12 p-8 max-w-md bg-white rounded-lg shadow-xl">
			<h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login Here</h2>
			<form autoComplete="off" className="space-y-4" onSubmit={handleLogin}>
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
					<input
						type="password"
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						required
						onChange={(e) => setPassword(e.target.value)}
						value={password}
					/>
				</div>

				<div className="flex items-center justify-center">
					<button
						type="submit"
						className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150"
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
					Register here
				</Link>
			</p>
		</div>
	);

};

export default Login;
