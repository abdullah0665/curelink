import React, { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import { db, auth } from '../firebase'; // Adjust the import path as needed
import { doc, setDoc } from "firebase/firestore"; // Import the needed Firestore functions

const TextRecognition = ({ selectedImage }) => {
	const [recognizedText, setRecognizedText] = useState('');
	const [isSaving, setIsSaving] = useState(false); // State to handle save button status

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

	const handleSave = async () => {
		// Ensure we have user information and recognized text before saving
		if (auth.currentUser && recognizedText) {
			try {
				setIsSaving(true);
				const userDocRef = doc(db, 'doc', auth.currentUser.uid);
				await setDoc(userDocRef, { text: recognizedText, userID: auth.currentUser.uid }, { merge: true });
				console.log('Document saved successfully');
			} catch (error) {
				console.error('Error saving document: ', error);
			} finally {
				setIsSaving(false);
			}
		}
	};

	return (
		<div>
			<h2>Recognized Text:</h2>
			<p>{recognizedText}</p>
			<button
				disabled={isSaving}
				onClick={handleSave}
				className={`px-4 py-2 text-white ${isSaving ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'}`}
			>
				{isSaving ? 'Saving...' : 'Save'}
			</button>
		</div>
	);
};

export default TextRecognition;
