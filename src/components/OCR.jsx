import React, { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import { db, auth } from '../firebase';
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";

const TextRecognition = ({ selectedImage }) => {
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
		<div className="space-y-6 bg-gray-100">
			{/* Recognized Text Container */}
			<div className="p-4 border-2 border-gray-200 rounded-md">
				<h2 className="text-lg font-semibold mb-2 text-center">Recognized Text:</h2>
				<p className="whitespace-pre-wrap text-center">{recognizedText}</p>
			</div>

			{/* Save Button */}
			<div className="flex justify-center">
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
		</div>

	);

};

export default TextRecognition;
