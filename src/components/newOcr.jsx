import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import { auth, db } from '../firebase';
import NavBar from './topNav';
const NewOCR = () => {
	const [selectedImage, setSelectedImage] = useState(null);
	const handleImageUpload = (event) => {
		const image = event.target.files[0];
		setSelectedImage(URL.createObjectURL(image));
	};
	const [recognizedText, setRecognizedText] = useState('');
	const [savedTexts, setSavedTexts] = useState([]);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		const recognizeText = async () => {
			if (selectedImage) {
				try {
					const result = await Tesseract.recognize(selectedImage, 'eng');
					setRecognizedText(result.data.text);
				} catch (error) {
					console.error('Error recognizing text: ', error);
				}
			}
		};
		recognizeText();
	}, [selectedImage]);

	useEffect(() => {
		const fetchSavedTexts = async () => {
			if (auth.currentUser) {
				try {
					const q = query(collection(db, 'doc'), where("userID", "==", auth.currentUser.uid));
					const querySnapshot = await getDocs(q);
					const texts = querySnapshot.docs.map(doc => doc.data().text);
					setSavedTexts(texts);
				} catch (error) {
					console.error('Error fetching documents: ', error);
				}
			}
		};
		fetchSavedTexts();
	}, [auth.currentUser.uid]);
	console.log(savedTexts)

	const handleSave = async () => {
		if (auth.currentUser && recognizedText) {
			try {
				setIsSaving(true);
				const userDocRef = doc(collection(db, 'doc'));
				await setDoc(userDocRef, { text: recognizedText, userID: auth.currentUser.uid }, { merge: true });
				console.log('Document saved successfully');
				setSavedTexts([...savedTexts, recognizedText]); // Optionally update local state without refetching
			} catch (error) {
				console.error('Error saving document: ', error);
			} finally {
				setIsSaving(false);
			}
		}
	};

	return (
		<div className="">
			<div className='bg-gray-100 '>
				{/* <NavBar /> */}
				<div className="container mx-auto p-8 max-w-md bg-gray-100 rounded-lg text-[#291f82] mt-16">
					{/* Choose Image Section */}
					<label className="block text-gray-700 text-sm font-bold bg-gray-100 mb-2">Choose an Image:</label>
					<input
						type="file"
						accept="image/*"
						onChange={handleImageUpload}
						className="appearance-none border border-gray-300 rounded py-2 px-4 block w-full leading-normal focus:outline-none focus:border-blue-500"
					/>

					{selectedImage && (
						<div className="mt-4">
							<img
								src={selectedImage}
								alt="Selected"
								className="mx-auto bg-gray-100 rounded-lg shadow-lg"
								style={{ maxWidth: '300px' }} // Limiting the maximum width
							/>
						</div>
					)}
				</div>
				{/* <TextRecognition selectedImage={selectedImage} /> */}
			</div>
			<div className="space-y-6 bg-gray-100">
				{/* Recognized Text Container */}
				<div className="p-4 border-2 border-gray-200 rounded-md">
					<h2 className="text-lg font-semibold mb-2 text-center">Recognized Text:</h2>
					<p className="whitespace-pre-wrap text-center">{recognizedText}</p>
				</div>

				{/* Save Button */}
				<div className="flex justify-center bg-gray-100">
					<button
						disabled={isSaving}
						onClick={handleSave}
						className={`px-4 py-2 text-white ${isSaving ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'} rounded-md transition-colors duration-200 ease-in-out`}
					>
						{isSaving ? 'Saving...' : 'Save'}
					</button>
				</div>

				{/* Saved Texts Container */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{savedTexts.map((text, index) => (
						<div key={index} className="bg-gray-100 p-4 rounded-lg border-2 mb-4 mx-auto">
							<p className="text-gray-600">{text}</p>
						</div>
					))}
				</div>
				<div className="bg-gray-100 h-full"></div>
			</div>
		</div>


	);
};
export default NewOCR;