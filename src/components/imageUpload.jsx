import React, { useState } from 'react';
import TextRecognition from './OCR';
const ImageUploader = () => {
	const [selectedImage, setSelectedImage] = useState(null);
	const handleImageUpload = (event) => {
		const image = event.target.files[0];
		setSelectedImage(URL.createObjectURL(image));
	};
	return (
		<>
			<div className="container mx-auto my-12 p-8 max-w-md bg-white rounded-lg shadow-2xl">
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