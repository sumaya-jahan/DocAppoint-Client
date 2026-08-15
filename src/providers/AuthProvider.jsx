import {
    createContext,
    useEffect,
    useState,
} from "react";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    updateProfile,
} from "firebase/auth";

import { auth } from "../firebase/firebase.config";

export const AuthContext = createContext();

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) => {
        setLoading(true);

        return createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
    };

    const signInUser = (email, password) => {
        setLoading(true);

        return signInWithEmailAndPassword(
            auth,
            email,
            password
        );
    };

    const googleLogin = () => {
        setLoading(true);

        return signInWithPopup(
            auth,
            googleProvider
        );
    };

    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo,
        }).then(() => {
            setUser({
                ...auth.currentUser,
            });
        });
    };

    const logOut = () => {
        localStorage.removeItem("access-token");
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async (currentUser) => {
                setUser(currentUser);

                if (currentUser?.email) {
                    try {
                        const res = await fetch(
                            "https://docappoint-server-uvkv.onrender.com/jwt",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    email: currentUser.email,
                                }),
                            }
                        );

                        const data = await res.json();

                        if (data.token) {
                            localStorage.setItem(
                                "access-token",
                                data.token
                            );
                        }
                    } catch (error) {
                        console.error(
                            "JWT error:",
                            error
                        );
                    }
                } else {
                    localStorage.removeItem(
                        "access-token"
                    );
                }

                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        loading,
        createUser,
        signInUser,
        googleLogin,
        updateUserProfile,
        logOut,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;