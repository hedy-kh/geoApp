import React, { createContext, useState, useEffect, useContext } from "react";
import { auth, db } from "../services/firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.data();
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          ...userData,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        role: userData.role,
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        ...(userData.role === "student" && {
          studentId: userData.studentId,
          grade: userData.grade,
          schoolName: userData.schoolName,
          birthDate: userData.birthDate,
        }),
        ...(userData.role === "teacher" && {
          teacherId: userData.teacherId,
          qualification: userData.qualification,
          yearsOfExperience: userData.yearsOfExperience,
          subject: userData.subject,
        }),
        ...(userData.role === "parent" && {
          relationship: userData.relationship,
          studentsCount: userData.studentsCount,
          address: userData.address,
          studentId: userData.studentId, // ✅ Add studentId for parent
        }),
        createdAt: new Date().toISOString(),
      });

      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Updated login function with role validation
  const login = async (email, password, expectedRole) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Fetch user data from Firestore to check role
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const userData = userDoc.data();

      // Validate that user's role matches the expected role
      if (userData && userData.role !== expectedRole) {
        // Sign out the user immediately
        await signOut(auth);
        return {
          success: false,
          error: "auth/wrong-role",
          message: `هذا الحساب مسجل كـ ${getRoleNameInArabic(
            userData.role
          )}. الرجاء استخدام فضاء ${getRoleNameInArabic(
            userData.role
          )} لتسجيل الدخول.`,
        };
      }

      return { success: true, user: userCredential.user, userData };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

const getRoleNameInArabic = (role) => {
  switch (role) {
    case "student":
      return "تلميذ";
    case "teacher":
      return "معلم";
    case "parent":
      return "ولي أمر";
    default:
      return "مستخدم";
  }
};
