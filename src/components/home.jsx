import React from 'react';

const Home = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<img src="/vite.svg" alt="Logo" className="mb-8" /> {/* Logo at the center */}
			<div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
				{/* Card for Upload Document */}
				<div className="text-white cursor-pointer bg-[#291f82] hover:bg-[#0b0638] hover:text-white transition duration-300 ease-in-out shadow-lg rounded-lg p-6 flex flex-col items-center">
					<h3 className="text-lg font-semibold mb-2">Upload Doc</h3>
					<p>Upload your documents here.</p>
				</div>
				{/* Card for Locate Pharmacy */}
				<div className="text-white  cursor-pointer bg-[#291f82] hover:bg-[#0b0638] hover:text-white transition duration-300 ease-in-out shadow-lg rounded-lg p-6 flex flex-col items-center">
					<h3 className="text-lg font-semibold mb-2">Locate Pharmacy</h3>
					<p>Find pharmacies near you.</p>
				</div>
				{/* Card for Book an Appointment */}
				<div className="text-white cursor-pointer bg-[#291f82] hover:bg-[#0b0638] hover:text-white transition duration-300 ease-in-out shadow-lg rounded-lg p-6 flex flex-col items-center">
					<h3 className="text-lg font-semibold mb-2">Book an Appointment</h3>
					<p>Book your appointment online.</p>
				</div>
			</div>
		</div>
	);
};

export default Home;
