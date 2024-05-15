

// src/components/FileUpload.js
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { db, storage } from "../firebase";
import NavBar from './topNav';
import NewOCR from './newOcr';

const FileUpload = () => {
	const [file, setFile] = useState(null);
	const [progress, setProgress] = useState(0);
	const [message, setMessage] = useState('');
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setCurrentUser(user);
				fetchUploadedFiles(user.uid);
			} else {
				setCurrentUser(null);
			}
		});
	}, []);

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile && selectedFile.type === 'application/pdf') {
			setFile(selectedFile);
		} else {
			alert('Please select a PDF file');
		}
	};

	const uploadFile = (file) => {
		if (!file) return null;
		const fileRef = ref(storage, `files/${file.name}`);
		const uploadTask = uploadBytesResumable(fileRef, file);

		return new Promise((resolve, reject) => {
			uploadTask.on(
				'state_changed',
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setProgress(progress);
				},
				(error) => {
					console.log(error);
					reject(error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						resolve(downloadURL);
					});
				}
			);
		});
	};

	const sendMessage = async () => {
		if (!file) {
			alert('No file selected');
			return;
		}

		if (!currentUser) {
			alert('User not logged in');
			return;
		}

		try {
			const fileUrl = await uploadFile(file);
			const { email, uid } = currentUser;

			await addDoc(collection(db, 'messages'), {
				text: message,
				name: file.name,
				fileUrl,
				createdAt: serverTimestamp(),
				uid,
			});

			setFile(null);
			setMessage('');
			setProgress(0);
			fetchUploadedFiles(uid);
		} catch (error) {
			console.log('Error uploading file:', error);
		}
	};

	const fetchUploadedFiles = async (uid) => {
		const q = query(collection(db, 'messages'), where('uid', '==', uid));
		const querySnapshot = await getDocs(q);
		const files = querySnapshot.docs.map((doc) => doc.data());
		setUploadedFiles(files);
	};

	return (
		<div className="bg-gray-100 h-screen" >
			<NavBar/>

			<div className="flex flex-col items-center p-4 mt-16">
				<div className="w-full max-w-md p-4 border rounded-lg shadow-md">
					<input
						type="file"
						accept="application/pdf"
						onChange={handleFileChange}
						className="block w-full text-sm text-gray-500
						file:mr-4 file:py-2 file:px-4
						file:rounded-full file:border-0
						file:text-sm file:font-semibold
						file:bg-blue-50 file:text-blue-700
						hover:file:bg-blue-100"
					/>
					<button
						onClick={sendMessage}
						className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
					>
						Upload PDF
					</button>
					<p className="mt-2 text-gray-700">Upload Progress: {progress}%</p>
				</div>
				<div className="w-full max-w-md mt-6">
					<h3 className="text-xl font-semibold mb-4">Uploaded Files:</h3>
					<ul className="list-disc list-inside">
						{uploadedFiles.map((file, index) => (
							<li key={index} className="flex items-center mb-2">
								<FontAwesomeIcon icon={faFilePdf} className="text-red-500 mr-2" />
								<a
									href={file.fileUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-500 hover:underline"
								>
									{file.name}
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
			<NewOCR/>
		</div >
	);
};

export default FileUpload;

