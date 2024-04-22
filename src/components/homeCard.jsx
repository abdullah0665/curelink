import React from 'react';
import { Link } from 'react-router-dom';

const HomeCard = ({ imageSrc, altText, title, to }) => {
	const isCounselation = title === "Consultation";

	return (
		<div className={`w-full mb-4 relative overflow-hidden rounded-lg sm:w-1/3 lg:w-1/4 xl:w-1/5 ${isCounselation ? 'bg-gray-400 text-black' : 'bg-[#291f82] hover:bg-[#0b0638] transition-all duration-300 hover:scale-110'}`}>
			<div className={`shadow-md rounded p-2 h-48 text-white ${isCounselation ? ' text-slate-900' : 'text-white'} transition-all duration-300`}>
				{isCounselation ? (
					<div className="flex flex-col items-center">
						<img src={imageSrc} alt={altText} className="w-20 h-20 mx-auto my-6 object-cover rounded" />
						<h2 className="text-sm sm:text-base font-semibold mb-2">{title}</h2>
					</div>
				) : (
					<Link to={to} className="flex flex-col items-center">
						<img src={imageSrc} alt={altText} className="w-20 h-20 mx-auto my-6 object-cover rounded" />
						<h2 className="text-sm sm:text-base font-semibold mb-2">{title}</h2>
					</Link>
				)}
			</div>
			<div className="hidden absolute top-full left-0 w-full bg-white p-2 rounded shadow-md opacity-0 transition-opacity duration-300">
				{/* Additional content or functionality */}
			</div>
		</div>
	);
};

export default HomeCard;
