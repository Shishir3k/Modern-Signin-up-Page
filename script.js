// const container = document.getElementById('container');
// const registerBtn = document.getElementById('register');
// const loginBtn = document.getElementById('login');

// registerBtn.addEventListener('click', () => {
//     container.classList.add("active");
// });

// loginBtn.addEventListener('click', () => {
//     container.classList.remove("active");
// });










// Import the functions you need from the SDKs you need
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js';
        import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
        import { getFirestore, collection, addDoc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js';
        import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js';

        // TODO: Replace with your Firebase config
        const firebaseConfig = {
            apiKey: "AIzaSyCw6Vja_1VEpXaw5d8XvL3-IKhKZpztjmg",
            authDomain: "modern-signin-up-page.firebaseapp.com",
            projectId: "modern-signin-up-page",
            storageBucket: "modern-signin-up-page.firebasestorage.app",
            messagingSenderId: "221101979707",
            appId: "1:221101979707:web:83322f980b73606dce841e",
            measurementId: "G-2PMEQJR8XP"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const db = getFirestore(app);
        const auth = getAuth(app);


        // Helper function to show messages
        function showMessage(elementId, message, type) {
            const messageEl = document.getElementById(elementId);
            messageEl.textContent = message;
            messageEl.className = `message ${type} show`;
            setTimeout(() => {
                messageEl.classList.remove('show');
            }, 5000);
        }

        // Helper function to toggle loading state
        function setLoadingState(buttonId, isLoading) {
            const button = document.getElementById(buttonId);
            if (isLoading) {
                button.innerHTML = '<span class="spinner"></span>Loading...';
                button.disabled = true;
            } else {
                button.innerHTML = buttonId === 'signupBtn' ? 'Sign Up' : 'Sign In';
                button.disabled = false;
            }
        }

        // Sign Up functionality
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;

            if (!name || !email || !password) {
                showMessage('signupMessage', 'Please fill in all fields', 'error');
                return;
            }

            if (password.length < 6) {
                showMessage('signupMessage', 'Password must be at least 6 characters', 'error');
                return;
            }

            setLoadingState('signupBtn', true);

            try {
                // Create user in Firebase Auth
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Save additional user data to Firestore
                const userData = {
                    uid: user.uid,
                    name: name,
                    email: email,
                    createdAt: new Date(),
                    lastLogin: new Date()
                };

                await addDoc(collection(db, "users"), userData);

                showMessage('signupMessage', 'Account created successfully!', 'success');
                signupForm.reset();

                // Optionally redirect or switch to sign in
                setTimeout(() => {
                    container.classList.remove("active");
                }, 2000);

            } catch (error) {
                console.error('Error creating account:', error);
                let errorMessage = 'Failed to create account. ';

                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage += 'Email is already registered.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage += 'Invalid email address.';
                        break;
                    case 'auth/weak-password':
                        errorMessage += 'Password is too weak.';
                        break;
                    default:
                        errorMessage += 'Please try again.';
                }

                showMessage('signupMessage', errorMessage, 'error');
            } finally {
                setLoadingState('signupBtn', false);
            }
        });

        // Sign In functionality
        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('signinEmail').value.trim();
            const password = document.getElementById('signinPassword').value;

            if (!email || !password) {
                showMessage('signinMessage', 'Please fill in all fields', 'error');
                return;
            }

            setLoadingState('signinBtn', true);

            try {
                // Sign in with Firebase Auth
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Update last login in Firestore
                const q = query(collection(db, "users"), where("uid", "==", user.uid));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // You can update the last login here if needed
                    console.log('User signed in:', user.uid);
                }

                showMessage('signinMessage', 'Signed in successfully!', 'success');
                signinForm.reset();

                // Redirect to dashboard or home page
                setTimeout(() => {
                    // window.location.href = 'dashboard.html'; // Uncomment to redirect
                    alert('Welcome! You are now signed in.');
                }, 1000);

            } catch (error) {
                console.error('Error signing in:', error);
                let errorMessage = 'Failed to sign in. ';

                switch (error.code) {
                    case 'auth/user-not-found':
                        errorMessage += 'No account found with this email.';
                        break;
                    case 'auth/wrong-password':
                        errorMessage += 'Incorrect password.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage += 'Invalid email address.';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage += 'Too many failed attempts. Try again later.';
                        break;
                    default:
                        errorMessage += 'Please check your credentials.';
                }

                showMessage('signinMessage', errorMessage, 'error');
            } finally {
                setLoadingState('signinBtn', false);
            }
        });