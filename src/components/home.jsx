import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import HomeCard from './homeCard';

const Home = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<img src="/vite.svg" alt="Logo" className="mb-8" /> {/* Logo at the center */}
			<div className="flex flex-row flex-wrap justify-around w-full max-w-6xl mb-8 fade-out fade-in">
				<HomeCard
					imageSrc="/vite.svg"
					altText="Counsulatation"
					title="Counsultation"
					to={"/about"}
				/>
				<HomeCard
					imageSrc="/vite.svg"
					altText="Locate labortry"
					title="Locate labortry"
					to={"/map"}
				/>
				<HomeCard
					imageSrc="/vite.svg"
					altText="Upload Document"
					title="Upload Document"
					to={"/about"}
				/>
			</div>
		</div>
	);
};

export default Home;
