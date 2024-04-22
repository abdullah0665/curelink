import React, { useState } from 'react';
import TextRecognition from './OCR';

import { Link } from 'react-router-dom';
const ImageUploader = () => {
	const [selectedImage, setSelectedImage] = useState(null);
	const handleImageUpload = (event) => {
		const image = event.target.files[0];
		setSelectedImage(URL.createObjectURL(image));
	};
	return (
		<>
			<div className="container mx-auto my-12 p-8 max-w-md bg-white rounded-lg shadow-2xl">
				{/* Back Button */}
				<div className="absolute top-0 left-0 mt-4 ml-4">
					<Link to="/home" className="text-blue-600 hover:text-blue-800">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						
					</Link>
				</div>

				{/* Choose Image Section */}
				<label className="block text-gray-700 text-sm font-bold mb-2">Choose an Image:</label>
				<input
					type="file"
					accept="image/*"
					onChange={handleImageUpload}
				/>
				{selectedImage && (
					<div className="mt-4">
						<img
							src={selectedImage}
							alt="Selected"
							className="mx-auto rounded-lg shadow-lg"
							style={{ maxWidth: '300px' }} // Limiting the maximum width
						/>
					</div>
				)}
			</div>
			<TextRecognition selectedImage={selectedImage} />
		</>


	);
};
export default ImageUploader;