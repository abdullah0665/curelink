import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithGoogle } from '../firebase'; // Adjust the import path as needed
import HomeCard from './HomeCard';
import NavBar from './topNav';
import uploaldPng from '../components/upload.png'
import mapPng from '../components/map.png'
import docPng from '../components/doc.png'


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
		<div className='bg-green-100'>
		<NavBar/>
			<div className="fixed top-0 right-0 m-4">
				{user && (
					<button
						className="text-[#291f82] hover:text-[#0b0638] text-xl mt-2 font-semibold"
						onClick={handleLogout}
					>
						{user.email}
					</button>
				)}
			</div>
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
				<img src="/logo.png" alt="Logo" className="mt-10 mb-8 h-72 w-80" /> {/* Logo at the center */}
				<div className="flex flex-row flex-wrap justify-around w-full max-w-6xl mb-8">
					{/* Home cards */}
					<HomeCard
						imageSrc={docPng}
						altText="Consultation"
						title="Consultation"
						to={"/Consultation"}
					/>
					<HomeCard
						imageSrc={mapPng}
						altText="Locate Laboratory"
						title="Locate Laboratory"
						to={"/map"}
						// to={"/about"}
					/>
					<HomeCard
						imageSrc={uploaldPng}
						altText="Upload Document"
						title="Upload Document"
						to={"/ocr"}
						// to={"/about"}
					/>
				</div>
			</div>
		</div>
	);
};

export default Home;

