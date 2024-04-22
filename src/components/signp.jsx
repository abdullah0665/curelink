import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

const Signup = () => {
	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		password: '',
	});
	const [registrationError, setRegistrationError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setRegistrationError(''); // Reset error message before attempting registration

		try {
			const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
			await addDoc(collection(db, 'users'), {
				Name: formData.fullName,
				Email: formData.email,
				uid: userCredential.user.uid,
			});
			navigate('/home');
		} catch (error) {
			console.error("Registration Error:", error);
			parseFirebaseErrors(error.code);
		}

		setIsLoading(false);
	};

	const parseFirebaseErrors = (errorCode) => {
		let errorMessage = "An unexpected error occurred. Please try again.";
		switch (errorCode) {
			case "auth/email-already-in-use":
				errorMessage = "The email address is already in use by another account.";
				break;
			case "auth/weak-password":
				errorMessage = "Password should be at least 6 characters.";
				break;
			case "auth/invalid-email":
				errorMessage = "The email address is not valid.";
				break;

		}
		setRegistrationError(errorMessage);
	};

	return (
		<div className="container mx-auto my-12 p-8 max-w-md bg-white rounded-lg shadow-xl">
			<h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Register Here</h2>
			<form autoComplete="off" onSubmit={handleRegister}>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
					<input
						type="text"
						name="fullName"
						value={formData.fullName}
						onChange={handleInputChange}
						required
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					/>
				</div>

				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
						required
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					/>
				</div>

				<div className="mb-6">
					<label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
					<input
						type="password"
						name="password"
						value={formData.password}
						onChange={handleInputChange}
						required
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
					/>
				</div>

				<div className="flex items-center justify-center">
					<button
						type="submit"
						disabled={isLoading}
						className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150 ${isLoading && 'opacity-50 cursor-not-allowed'}`}
					>
						{isLoading ? 'Registering...' : 'Register'}
					</button>
				</div>
			</form>
			{registrationError && (
				<p className="text-red-500 text-xs italic mt-4">{registrationError}</p>
			)}
			<p className="mt-4 text-center">
				Already have an account?{' '}
				<Link to="/" className="text-blue-500 hover:text-blue-700">
					Login
				</Link>
			</p>
		</div>
	);
};

export default Signup;
