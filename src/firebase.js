import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import for Firebase Storage

const firebaseConfig = {
	apiKey: "AIzaSyDb_pWevkeko4ocSFvUDD-UGh4chKLuG7Q",
	authDomain: "curelink-272dc.firebaseapp.com",
	projectId: "curelink-272dc",
	storageBucket: "curelink-272dc.appspot.com",
	messagingSenderId: "679410293817",
	appId: "1:679410293817:web:049b5d6bcb0181a18841e8",
	measurementId: "G-LJ6TPXD2GN"
};

class FirebaseSingleton {
	constructor() {
		if (!FirebaseSingleton.instance) {
			this.app = initializeApp(firebaseConfig);
			this.auth = getAuth(this.app);
			this.db = getFirestore(this.app);
			this.storage = getStorage(this.app); // Initialize Firebase Storage
			this.provider = new GoogleAuthProvider();
			FirebaseSingleton.instance = this;
		}
		return FirebaseSingleton.instance;
	}

	signInWithGoogle() {
		signInWithPopup(this.auth, this.provider)
			.then((result) => {
				const name = result.user.displayName;
				const email = result.user.email;
				const profilePic = result.user.photoURL;

				localStorage.setItem("name", name);
				localStorage.setItem("email", email);
				localStorage.setItem("profilePic", profilePic);
			})
			.catch((error) => {
				console.log(error);
			});
	}
}

const firebaseInstance = new FirebaseSingleton();
export const db = firebaseInstance.db;
export const auth = firebaseInstance.auth;
export const storage = firebaseInstance.storage; // Export the storage instance
export const signInWithGoogle = firebaseInstance.signInWithGoogle.bind(firebaseInstance);
export { createUserWithEmailAndPassword, signInWithEmailAndPassword };
