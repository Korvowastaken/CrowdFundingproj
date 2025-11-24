import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase/firebase-config';
import { updateProfile, signOut } from "firebase/auth"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import InputField from '../components/InputField';
import Button from '../components/Button';
import EmailVerification from '../components/EmailVerification';
import PreSignupEmailVerification from '../components/PreSignupEmailVerification';
import { gsap } from "gsap";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Signing = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showPreSignupVerification, setShowPreSignupVerification] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const location = useLocation();
  const initialPanel = location.state?.panel || "login"; // default to login if nothing passed
  const [activePanel, setActivePanel] = useState(initialPanel);

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Load remembered credentials on mount
  useEffect(() => {
    const rememberedSignInEmail = localStorage.getItem('rememberedSignInEmail');
    const rememberedSignInPassword = localStorage.getItem('rememberedSignInPassword');
    const rememberedSignUpEmail = localStorage.getItem('rememberedSignUpEmail');
    const rememberedSignUpUsername = localStorage.getItem('rememberedSignUpUsername');
    
    if (rememberedSignInEmail && rememberedSignInPassword) {
      signinsetFormData({
        email: rememberedSignInEmail,
        password: rememberedSignInPassword
      });
      setRememberMeSignIn(true);
    }
    
    if (rememberedSignUpEmail && rememberedSignUpUsername) {
      signupsetFormData(prev => ({
        ...prev,
        email: rememberedSignUpEmail,
        username: rememberedSignUpUsername
      }));
      setRememberMeSignUp(true);
    }
  }, []);

  // Firebase auth listener (no auto-redirect; only handle unverified case)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (!currentUser.emailVerified) {
          setPendingUser(currentUser);
          setShowEmailVerification(true);
        } else {
          // Do not auto-navigate; handlers will route appropriately
          setShowEmailVerification(false);
          setPendingUser(null);
        }
      } else {
        setUser(null);
        setShowEmailVerification(false);
        setPendingUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // GSAP refs
  const signupRef = useRef(null);
  const signinRef = useRef(null);
  const signinWid1 = useRef(null);
  const signinWid2 = useRef(null);
  const signinWid3 = useRef(null);
  const signupWid1 = useRef(null);
  const signupWid2 = useRef(null);
  const signupWid3 = useRef(null);
  const signinLabel = useRef(null);
  const signinInput = useRef(null);
  const signinBtn = useRef(null);
  const signupLabel = useRef(null);
  const signupInput = useRef(null);
  const signupBtn = useRef(null);
  const googleinBtn = useRef(null);
  const googlesignupBtn = useRef(null);


  // Form state
  const [signinformData, signinsetFormData] = useState({ email: '', password: '' });
  const [signupformData, signupsetFormData] = useState({
    email: '', password: '', confirmPassword: '', username: ''
  });
  const [rememberMeSignIn, setRememberMeSignIn] = useState(false);
  const [rememberMeSignUp, setRememberMeSignUp] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailSending, setResetEmailSending] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);

  // Form handlers
  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    signinsetFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    signupsetFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset username availability when username changes
    if (name === 'username') {
      setUsernameAvailable(null);
    }
    // Reset email availability when email changes
    if (name === 'email') {
      setEmailAvailable(null);
    }
  };

  // Generate random username for Google sign-ups
  const generateRandomUsername = async () => {
    const adjectives = ['Happy', 'Lucky', 'Bright', 'Swift', 'Bold', 'Clever', 'Brave', 'Wise', 'Cool', 'Epic'];
    const nouns = ['Tiger', 'Eagle', 'Dragon', 'Phoenix', 'Wolf', 'Lion', 'Falcon', 'Bear', 'Panda', 'Fox'];
    
    let username = '';
    let isAvailable = false;
    let attempts = 0;
    
    while (!isAvailable && attempts < 10) {
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const randomNum = Math.floor(Math.random() * 1000);
      username = `${adjective}${noun}${randomNum}`;
      
      // Check if username exists
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username.toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      isAvailable = querySnapshot.empty;
      attempts++;
    }
    
    return username;
  };

  // Check if email already exists in Firestore
  const checkEmailExists = async (email) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email.toLowerCase()));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  // Check if username already exists in Firestore
  const checkUsernameExists = async (username) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username.toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      console.log('Username check:', { 
        username, 
        lowercase: username.toLowerCase(), 
        found: !querySnapshot.empty
      });
      
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  // Real-time username availability check
  const checkUsernameAvailability = async (username) => {
    if (!username.trim()) {
      setUsernameAvailable(null);
      return;
    }

    if (username.trim().length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setUsernameChecking(true);
    try {
      const exists = await checkUsernameExists(username.trim());
      setUsernameAvailable(!exists);
    } catch (error) {
      console.error('Error checking username:', error);
    } finally {
      setUsernameChecking(false);
    }
  };

  // Debounced username check
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (signupformData.username) {
        const u = signupformData.username.trim();
        const syntaxValid = u.length >= 3 && u.length <= 20 && /^[a-zA-Z0-9_]+$/.test(u);
        if (syntaxValid) {
          checkUsernameAvailability(u);
        } else {
          setUsernameAvailable(null);
          setUsernameChecking(false);
        }
      } else {
        setUsernameAvailable(null);
        setUsernameChecking(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [signupformData.username]);

  // Debounced email availability check
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const email = signupformData.email?.trim() || '';
      if (!email) {
        setEmailAvailable(null);
        setEmailChecking(false);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const syntaxValid = emailRegex.test(email);
      if (!syntaxValid) {
        setEmailAvailable(null);
        setEmailChecking(false);
        return;
      }
      const run = async () => {
        setEmailChecking(true);
        try {
          const exists = await checkEmailExists(email.toLowerCase());
          setEmailAvailable(!exists);
        } catch (err) {
          console.error('Error checking email availability:', err);
          setEmailAvailable(null);
        } finally {
          setEmailChecking(false);
        }
      };
      run();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [signupformData.email]);

  // Step 1: Validate form and show email verification
  const handleSignUp = async () => {
    if (loading) return;

    if (signupformData.password !== signupformData.confirmPassword) {
      toast.error("Passwords don't match!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (signupformData.password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!signupformData.username.trim()) {
      toast.error("Please enter a username", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (signupformData.username.trim().length < 3) {
      toast.error("Username must be at least 3 characters", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (signupformData.username.trim().length > 20) {
      toast.error("Username must not exceed 20 characters", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(signupformData.username.trim())) {
      toast.error("Username can only contain letters, numbers, and underscores", {
        position: "top-center",
        autoClose: 4000,
      });
      return;
    }

    if (!signupformData.email.trim()) {
      toast.error("Please enter an email address", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupformData.email.trim())) {
      toast.error("Invalid email syntax. Please enter a valid email address", {
        position: "top-center",
        autoClose: 4000,
      });
      return;
    }

    // Set loading for database checks
    setLoading(true);

    try {
      // Check if email already exists
      const emailExists = await checkEmailExists(signupformData.email.trim());
      if (emailExists) {
        toast.error("Email already in use. Please use a different email or sign in instead.", {
          position: "top-center",
          autoClose: 4000,
        });
        setLoading(false);
        return;
      }

      // Check if username already exists
      console.log('Checking username:', signupformData.username.trim());
      const usernameExists = await checkUsernameExists(signupformData.username.trim());
      console.log('Username exists result:', usernameExists);
      
      if (usernameExists) {
        toast.error("Username already taken. Please choose a different username.", {
          position: "top-center",
          autoClose: 4000,
        });
        setLoading(false);
        return;
      }

      // Handle Remember Me for signup
      if (rememberMeSignUp) {
        localStorage.setItem('rememberedSignUpEmail', signupformData.email.trim());
        localStorage.setItem('rememberedSignUpUsername', signupformData.username.trim());
      } else {
        localStorage.removeItem('rememberedSignUpEmail');
        localStorage.removeItem('rememberedSignUpUsername');
      }

      // Show email verification before creating account
      setShowPreSignupVerification(true);
    } catch (error) {
      console.error('Error during signup validation:', error);
      toast.error("Error validating signup information. Please try again.", {
        position: "top-center",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Complete account setup after email verification
  const completeAccountSetup = async (verifiedUser) => {
    setLoading(true);
    try {
      // Update the user profile with username
      await updateProfile(verifiedUser, {
        displayName: signupformData.username,
      });
      
      // Create user document in Firestore
      await setDoc(doc(db, "users", verifiedUser.uid), {
        uid: verifiedUser.uid,
        email: signupformData.email.toLowerCase(),
        username: signupformData.username.trim().toLowerCase(), // Store username in lowercase for consistency
        displayName: signupformData.username.trim(), // Keep original case for display
        roles: ["visitor"], 
        walletBalance: 0,
        createdAt: new Date(),
        lastLogin: new Date(),
        emailVerified: true, // Email already verified
        verifiedAt: new Date(),
      });

      setShowPreSignupVerification(false);
      toast.success("Account created successfully! Welcome to LAWATA!", {
        position: "top-center",
        autoClose: 3000,
      });
      
      // First-time signup complete: go to profile setup page
      navigate('/profile');
    } catch (error) {
      console.error("Account setup error:", error);
      toast.error("Error completing account setup: " + error.message, {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  
  const handleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        signinformData.email,
        signinformData.password
      );
      const user = userCredential.user;
      
      // Handle Remember Me
      if (rememberMeSignIn) {
        localStorage.setItem('rememberedSignInEmail', signinformData.email);
        localStorage.setItem('rememberedSignInPassword', signinformData.password);
      } else {
        localStorage.removeItem('rememberedSignInEmail');
        localStorage.removeItem('rememberedSignInPassword');
      }
      
      // Update last login
      await setDoc(doc(db, "users", user.uid), { 
        lastLogin: new Date(),
        emailVerified: user.emailVerified 
      }, { merge: true });
      
      // Check if email is verified
      if (!user.emailVerified) {
        toast.warning("Please verify your email before continuing.", {
          position: "top-center",
          autoClose: 5000,
        });
        // The auth listener will handle showing verification screen
      } else {
        // Login success: go to browse
        navigate('/browse');
      }
    } catch (error) {
      console.error("Sign in error:", error);
      let errorMessage = error.message;
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (isMobile) {
      return;
    }
    if (activePanel === "signup") {
      gsap.to(signupRef.current, { width: "90%", duration: 0.6, ease: "power2.out" });
      gsap.to(signinRef.current, { width: "10%", duration: 0.6, ease: "power2.out" });

      gsap.to(signinWid1.current, { height: "25%", duration: 0.6 });
      gsap.to(signinWid2.current, { height: "10%", duration: 0.6 });
      gsap.to(signinWid3.current, { height: "65%", duration: 0.6 });
      gsap.to(signupWid1.current, { height: "0%", duration: 0.6 });
      gsap.to(signupWid2.current, { height: "25%", duration: 0.6 });
      gsap.to(signupWid3.current, { height: "75%", duration: 0.6 });

      gsap.to(signinLabel.current, { fontSize: "32px", y: 200, paddingBottom: "20px", duration: 0.6 });
      gsap.to(signupLabel.current, { fontSize: "72px", y: 0, duration: 0.6 });
      gsap.to(signinInput.current, { opacity: 0, pointerEvents: "none", duration: 0.4 });
      gsap.to(signinBtn.current, { opacity: 0, pointerEvents: "none", duration: 0.4 });
      gsap.to(googleinBtn.current, { opacity: 0, pointerEvents: "none", duration: 0.4 });
      gsap.to(signupInput.current, { opacity: 1, pointerEvents: "auto", duration: 0.6, delay: 0.2 });
      gsap.to(signupBtn.current, { opacity: 1, pointerEvents: "auto", duration: 0.6, delay: 0.2 });
      gsap.to(googlesignupBtn.current, { opacity: 1, pointerEvents: "auto", duration: 0.6, delay: 0.2 });
    } else {
      gsap.to(signupRef.current, { width: "10%", duration: 0.6 });
      gsap.to(signinRef.current, { width: "90%", duration: 0.6 });

      gsap.to(signinWid1.current, { height: "85%", duration: 0.6 });
      gsap.to(signinWid2.current, { height: "15%", duration: 0.6 });
      gsap.to(signinWid3.current, { height: "0%", duration: 0.6 });
      gsap.to(signupWid1.current, { height: "70%", duration: 0.6 });
      gsap.to(signupWid2.current, { height: "15%", duration: 0.6 });
      gsap.to(signupWid3.current, { height: "15%", duration: 0.6 });

      gsap.to(signinLabel.current, { fontSize: "72px", y: 0, paddingBottom: "0px", duration: 0.6 });
      gsap.to(signupLabel.current, { fontSize: "32px", y: 190, duration: 0.6 });
      gsap.to(signinInput.current, { opacity: 1, pointerEvents: "auto", duration: 0.6, delay: 0.2 });
      gsap.to(signinBtn.current, { opacity: 1, pointerEvents: "auto", duration: 0.6, delay: 0.2 });
      gsap.to(googleinBtn.current, { opacity: 1, pointerEvents: "auto", duration: 0.6, delay: 0.2 });
      gsap.to(signupInput.current, { opacity: 0, pointerEvents: "none", duration: 0.4 });
      gsap.to(signupBtn.current, { opacity: 0, pointerEvents: "none", duration: 0.4 });
      gsap.to(googlesignupBtn.current, { opacity: 0, pointerEvents: "none", duration: 0.4 });
    }
  }, [activePanel, isMobile]);

  // Form submit handlers
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    handleSignIn();
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    handleSignUp();
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);

    const provider = new GoogleAuthProvider();
    // Add additional scopes
    provider.addScope('profile');
    provider.addScope('email');
    // Set custom parameters for better UX
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Get existing user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const isNewUser = !userDoc.exists();
      const existingData = userDoc.exists() ? userDoc.data() : {};
      
      // Generate random username for new Google users
      let username = existingData.username;
      if (!username) {
        username = await generateRandomUsername();
      }
      
      const profileImageUrl = existingData.profileImageUrl || user.photoURL || "";

      // Prepare user data
      const userData = {
        uid: user.uid,
        email: user.email,
        username: username.toLowerCase(),
        displayName: username,
        profileImageUrl: profileImageUrl,
        roles: existingData.roles || ["visitor"],
        walletBalance: existingData.walletBalance || 0,
        lastLogin: new Date(),
        createdAt: existingData.createdAt || new Date(),
        emailVerified: user.emailVerified,
        providerData: user.providerData.map(provider => ({
          providerId: provider.providerId,
          uid: provider.uid,
          displayName: provider.displayName,
          email: provider.email,
          photoURL: provider.photoURL
        }))
      };

      // Save or update user info in Firestore
      await setDoc(doc(db, "users", user.uid), userData, { merge: true });
      
      // Update user profile if display name is missing
      if (!user.displayName) {
        await updateProfile(user, {
          displayName: userData.username,
          photoURL: userData.profileImageUrl
        });
      }
      
      // Show success message and redirect (Google accounts are pre-verified)
      toast.success(`Welcome back, ${userData.username || 'User'}!`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate('/browse');
    } catch (error) {
      console.error("Google Sign-In error:", error);
      
      // Handle specific error cases
      let errorMessage = 'An error occurred during sign-in';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in cancelled';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Pop-up blocked. Please allow pop-ups for this site.';
      } else if (error.code === 'auth/internal-error') {
        errorMessage = 'Authentication service error. Please check your Firebase configuration.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized. Please add it to Firebase console.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Email verification handlers
  const handleVerificationComplete = async () => {
    try {
      // Update user verification status in Firestore
      if (pendingUser) {
        await setDoc(doc(db, "users", pendingUser.uid), {
          emailVerified: true,
          verifiedAt: new Date()
        }, { merge: true });
      }
      
      setShowEmailVerification(false);
      setPendingUser(null);
      
      toast.success('Email verified successfully! Welcome!', {
        position: "top-center",
        autoClose: 3000,
      });
      
      navigate('/browse');
    } catch (error) {
      console.error('Error updating verification status:', error);
      toast.error('Error updating verification status', {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleVerificationCancel = async () => {
    try {
      await signOut(auth);
      setShowEmailVerification(false);
      setPendingUser(null);
      toast.info('Signed out. Please sign in again when ready to verify.', {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Pre-signup verification handlers
  const handlePreVerificationComplete = (verifiedUser) => {
    setVerifiedEmail(signupformData.email);
    completeAccountSetup(verifiedUser);
  };

  const handlePreVerificationBack = () => {
    setShowPreSignupVerification(false);
  };

  // Forgot Password Handler
  const handleForgotPassword = async () => {
    if (!resetEmail.trim()) {
      toast.error("Please enter your email address", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail.trim())) {
      toast.error("Please enter a valid email address", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setResetEmailSending(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      toast.success("Password reset email sent! Please check your inbox.", {
        position: "top-center",
        autoClose: 5000,
      });
      setShowForgotPasswordModal(false);
      setResetEmail('');
    } catch (error) {
      console.error('Password reset error:', error);
      let errorMessage = 'Failed to send password reset email';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later';
      }
      
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setResetEmailSending(false);
    }
  };

  return (
    <div className='bg-white overflow-clip'>
      {/* Pre-Signup Email Verification Modal */}
      {showPreSignupVerification && (
        <PreSignupEmailVerification
          email={signupformData.email}
          formData={signupformData}
          onVerificationComplete={handlePreVerificationComplete}
          onBack={handlePreVerificationBack}
        />
      )}
      
      {/* Post-Signup Email Verification Modal (for existing users) */}
      {showEmailVerification && pendingUser && (
        <EmailVerification
          user={pendingUser}
          onVerificationComplete={handleVerificationComplete}
          onCancel={handleVerificationCancel}
        />
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <main 
        className='w-screen flex flex-col md:flex-row overflow-hidden'
        style={isMobile ? { height: 'calc(100vh - 64px)', marginTop: '64px' } : undefined}
      >
        {/* Sign Up Panel */}
        <div
          ref={signupRef}
          className='w-full md:w-4/5 h-auto md:h-screen flex flex-col items-center overflow-hidden order-2 md:order-none'
          onClick={() => setActivePanel("signup")}
          style={isMobile ? { height: activePanel === 'signup' ? 'calc(100% - 64px)' : '84px', transition: 'height 300ms ease' } : undefined}
        >
          <div ref={signupWid1} className='h-0/5 w-full hidden md:block'></div>
          <div ref={signupWid2} className='bg-color-e h-1/5 w-1.5 hidden md:block'></div>
          <div ref={signupWid3} className='bg-color-e h-full md:h-4/5 w-full font-titan text-5xl text-color-b flex items-center justify-center'>
            <div className='text-color-b w-11/12 md:w-3xl max-w-[560px] px-4 md:px-0 gap-8 flex flex-col items-center justify-center'>
              <div
                ref={signupLabel}
                className={`font-titan pointer-events-none transition-transform duration-300 text-center ${isMobile && activePanel !== 'signup' ? 'translate-y-20' : ''}`}
              >
                Login
              </div>
              <form
                ref={signupInput}
                className={`flex flex-col gap-5 transition-opacity duration-300 ${isMobile && activePanel !== 'signup' ? 'opacity-0 pointer-events-none h-0 overflow-hidden' : ''}`}
                onSubmit={handleSignInSubmit}
                autoComplete="on"
              >
                <div className="relative">
                  <InputField classname="border-b-3 text-2xl border-color-b text-color-b w-72 md:w-100 mx-auto outline-0" inputtype="email" name="email" value={signinformData.email} onChange={handleSignInChange} placeholder="Email" autoComplete="email"/>
                  {signinformData.email && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signinformData.email.trim()) ? (
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                <InputField classname="border-b-3 text-2xl border-color-b text-color-b w-72 md:w-100 mx-auto outline-0" inputtype="password" name="password" value={signinformData.password} onChange={handleSignInChange} placeholder="Password" autoComplete="current-password"/>
                <div className="flex text-xl justify-between mt-4">
                  <div className="flex gap-2 items-center justify-center">
                    <input 
                      className='w-4 h-4 rounded-sm' 
                      type="checkbox" 
                      checked={rememberMeSignIn}
                      onChange={(e) => setRememberMeSignIn(e.target.checked)}
                    />
                    <span className='text-2xl opacity-70'>Remember Me !</span>
                  </div>
                  <p>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowForgotPasswordModal(true);
                        setResetEmail(signinformData.email);
                      }} 
                      className='underline hover:text-color-b transition-colors text-2xl opacity-70'
                    >
                      Forgot password?
                    </button>
                  </p>
                </div>
              </form>
              <div ref={signupBtn} className={`${isMobile && activePanel !== 'signup' ? 'opacity-0 pointer-events-none h-0 overflow-hidden' : ''} mt-6`}>
                <Button text="LOG IN" callfunc={handleSignIn} loading={loading}/>
              </div>
              <div
                ref={googlesignupBtn}
                className={`bg-color-b flex items-center rounded-xl text-2xl justify-center text-color-d w-60 h-10 cursor-pointer mt-4 transition-opacity duration-300 ${isMobile && activePanel !== 'signup' ? 'opacity-0 pointer-events-none h-0 overflow-hidden' : 'opacity-100'}`}
                onClick={handleGoogleSignIn}
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-6 h-6 mr-2"
                />
                Sign in with Google
              </div>
            </div>
          </div>
        </div>

        {/* Sign In Panel */}
        <div
          ref={signinRef}
          className='w-full md:w-1/5 h-auto md:h-screen flex flex-col items-center overflow-hidden order-1 md:order-none'
          onClick={() => setActivePanel("login")}
          style={isMobile ? { height: activePanel === 'login' ? 'calc(100% - 64px)' : '84px', transition: 'height 300ms ease' } : undefined}
        >
          <div ref={signinWid1} className='h-full md:h-1/5 w-full border-color-b border-b-6 border-l-6 border-r-6 font-titan text-5xl text-color-b flex items-center justify-center relative z-20'>
            <div className='text-color-e w-11/12 md:w-3xl max-w-[560px] px-4 md:px-0 g flex flex-col items-center justify-center relative top-10'>
              <div
                ref={signinLabel}
                className={`font-titan relative bottom-2 pointer-events-none transition-transform duration-300 text-center ${isMobile && activePanel !== 'login' ? 'translate-y-5' : ''}`}
              >
                Sign Up
              </div>
              <form
                ref={signinInput}
                className={`flex flex-col gap-3 ${isMobile && activePanel !== 'login' ? 'opacity-0 pointer-events-none h-0 overflow-hidden' : 'opacity-100'}`}
                onSubmit={handleSignUpSubmit}
                autoComplete="on"
              >
                <div className="relative">
                  <InputField classname="border-b-3 text-2xl border-color-b w-72 md:w-100 mx-auto outline-0" inputtype="text" name="username" value={signupformData.username} onChange={handleSignUpChange} placeholder="User Name" autoComplete="username"/>
                  {usernameChecking && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <svg className="animate-spin h-5 w-5 text-color-b" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                  {!usernameChecking && signupformData.username && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      {(/^[a-zA-Z0-9_]+$/.test(signupformData.username.trim()) && signupformData.username.trim().length >= 3 && signupformData.username.trim().length <= 20)
                        ? (usernameAvailable === true ? (
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : usernameAvailable === false ? (
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          ) : null)
                        : (
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <InputField classname="border-b-3 text-2xl border-color-b w-72 md:w-100 mx-auto outline-0" inputtype="email" name="email" value={signupformData.email} onChange={handleSignUpChange} placeholder="Email" autoComplete="email"/>
                  {signupformData.email && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      {emailChecking ? (
                        <svg className="animate-spin h-5 w-5 text-color-b" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        (() => {
                          const email = signupformData.email.trim();
                          const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                          if (!valid) {
                            return (
                              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            );
                          }
                          if (emailAvailable === true) {
                            return (
                              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            );
                          }
                          if (emailAvailable === false) {
                            return (
                              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            );
                          }
                          return null;
                        })()
                      )}
                    </div>
                  )}
                </div>
                <InputField classname="border-b-3 text-2xl border-color-b w-72 md:w-100 mx-auto outline-0" inputtype="password" name="password" value={signupformData.password} onChange={handleSignUpChange} placeholder="Password" autoComplete="new-password"/>
                <InputField classname="border-b-3 text-2xl border-color-b w-72 md:w-100 mx-auto outline-0" inputtype="password" name="confirmPassword" value={signupformData.confirmPassword} onChange={handleSignUpChange} placeholder="Confirm Password" autoComplete="new-password"/>
                <div className="flex gap-2 items-center opacity-85 text-2xl relative top-2">
                  <input 
                    className='w-4 h-4 rounded-sm' 
                    type="checkbox" 
                    checked={rememberMeSignUp}
                    onChange={(e) => setRememberMeSignUp(e.target.checked)}
                  />
                  <span>Remember Me !</span>
                </div>
              </form>
              
              <div ref={signinBtn} className={`mt-5 transition-opacity duration-300 ${isMobile && activePanel !== 'login' ? 'opacity-0 pointer-events-none h-0 overflow-hidden' : 'opacity-100'}`}>
                <Button text="SIGN UP" callfunc={handleSignUp} loading={loading}/>
              </div>

              <div ref={googleinBtn} className={`bg-color-b flex items-center rounded-xl text-2xl justify-center text-color-d w-60 h-10 cursor-pointer mt-6 transition-opacity duration-300 ${isMobile && activePanel !== 'login' ? 'opacity-0 pointer-events-none h-0 overflow-hidden' : 'opacity-100'}`}
                  onClick={handleGoogleSignIn}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    alt="Google" className="w-6 h-6 mr-2"/>
                Sign up with Google
              </div>
            </div>
          </div>
          <div ref={signinWid2} className='bg-color-b h-0 md:h-1/5 w-1.5 hidden md:block'></div>
          <div ref={signinWid3} className='h-0 md:h-3/5 w-full hidden md:block'></div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div 
          className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowForgotPasswordModal(false);
            setResetEmail('');
          }}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-sm border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Reset Password</h2>
              <p className="text-sm text-gray-600">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>
            
            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !resetEmailSending) {
                    handleForgotPassword();
                  }
                }}
                placeholder="your.email@example.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-color-b focus:ring-1 focus:ring-color-b transition-all text-sm outline-none"
                autoFocus
              />
            </div>

            {/* Info Message */}
            <div className="mb-6 p-3 bg-gray-50 border border-gray-100 rounded-lg">
              <p className="text-xs text-gray-600">
                Check your spam folder if you don't receive the email within a few minutes.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleForgotPassword}
                disabled={resetEmailSending}
                className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resetEmailSending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
              <button
                onClick={() => {
                  setShowForgotPasswordModal(false);
                  setResetEmail('');
                }}
                disabled={resetEmailSending}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signing;
