import { useState, useEffect } from "react";
import firebase from "@firebase/app";
import "firebase/auth";
import "firebase/firestore";

export const useFirebaseAuth = addOnAuthStateChanged => {
  const auth = firebase.auth();
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signInAnonymously = () => {
    setIsAuthenticating(true);
    auth.signInAnonymously().catch(error => {
      setError(error);
    });
  };

  const signInWithEmailAndPassword = values => {
    const { passedEmail, passedPassword } = values || {};
    const useEmail = passedEmail || email;
    const usePassword = passedPassword || password;

    if (useEmail !== "" && usePassword !== "") {
      setIsAuthenticating(true);
      auth
        .signInWithEmailAndPassword(useEmail, usePassword)
        .catch(function(error) {
          setError(error);
        });
    } else {
      setError(new Error("Email and Password are required!"));
    }
  };

  const createUserWithEmailAndPassword = values => {
    const { passedEmail, passedPassword, passedConfirmPassword } = values || {};
    const useEmail = passedEmail || email;
    const usePassword = passedPassword || password;
    const useConfirmPassword = passedConfirmPassword || confirmPassword;

    if (useEmail === "") {
      setError(new Error("Email is required"));
    } else if (usePassword === "") {
      setError(new Error("Password is required"));
    } else if (usePassword !== useConfirmPassword) {
      setError(new Error("Passwords do not match"));
    } else {
      setIsAuthenticating(true);
      auth
        .createUserWithEmailAndPassword(email, password)
        .catch(function(error) {
          setError(error);
        });
    }
  };

  const signOut = () => {
    auth.signOut();
  };

  useEffect(() => {
    if (addOnAuthStateChanged) {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          // User is signed in.
          setError(null);
          setUser(user);
          setIsAuthenticating(false);
        } else {
          // User is signed out.
          setError(null);
          setUser(null);
          setIsAuthenticating(false);
        }
        return unsubscribe;
      });
    }
  }, [auth, addOnAuthStateChanged]);

  return {
    user,
    isAuthenticating,
    signInAnonymously,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error
  };
};
