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
			<div>
				<h3>Saved Texts:</h3>
				{savedTexts.map((text, index) => (
					<p key={index}>{text}</p>
				))}
			</div>
		</div>
	);
};

export default TextRecognition;
