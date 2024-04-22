import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithGoogle } from '../firebase'; // Adjust the import path as needed
import HomeCard from './HomeCard';

const Home = () => {
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				setUser(user);
			} else {
				navigate('/');
			}
		});

		return () => unsubscribe();
	}, [navigate]);

	const handleLogout = () => {
		auth.signOut().then(() => navigate('/'));
	};
	return (
		<>
			<div className="fixed top-0 right-0 m-4">
				{user && (
					<button
						className="text-[#291f82] hover:text-[#0b0638]"
						onClick={handleLogout}
					>
						{user.email}
					</button>
				)}
			</div>
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
				<img src="/vite.svg" alt="Logo" className="mb-8" /> {/* Logo at the center */}
				<div className="flex flex-row flex-wrap justify-around w-full max-w-6xl mb-8">
					{/* Home cards */}
					<HomeCard
						imageSrc="/vite.svg"
						altText="Consultation"
						title="Consult"
						to={"/about"}
					/>
					<HomeCard
						imageSrc="/vite.svg"
						altText="Locate Laboratory"
						title="Locate Laboratory"
						// to={"/map"}
						to={"/about"}
					/>
					<HomeCard
						imageSrc="/vite.svg"
						altText="Upload Document"
						title="Upload Document"
						// to={"/ocr"}
						to={"/about"}
					/>
				</div>
			</div>
		</>
	);
};

export default Home;

