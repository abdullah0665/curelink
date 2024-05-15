import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
	return (
		<div className="fixed top-0 left-0 w-full bg-gray-100 text-[#291f82]">
			<div className="container mx-auto flex justify-between items-center p-4">
			
				{/* Navigation Links */}
				<div className="flex space-x-10">
					<Link
						to="/"
						className="py-2 font-semibold  hover:rounded hover:px-4 transition-all duration-300"
					>
						HOME
					</Link>
					<Link
						to="/about"
						className="py-2 font-semibold  hover:rounded hover:px-4 transition-all duration-300"
					>
						ABOUT US
					</Link>
					<Link
						to="/contact"
						className="py-2 font-semibold  hover:rounded hover:px-4 transition-all duration-300"
					>
						CONTACT US
					</Link>
				
				</div>
			</div>
		</div>
	);
};

export default NavBar;
