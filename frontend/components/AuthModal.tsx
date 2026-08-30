"use client";

import React, { useState } from "react";
import { 
  X, Lock, Mail, User as UserIcon, ShieldCheck, AlertCircle, Loader2, LogIn, UserPlus, ExternalLink 
} from "lucide-react";
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  isFirebaseConfigured
} from "@/lib/firebase";

export interface UserSession {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  role: string;
  organization: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserSession) => void;
}

// Map Firebase Error Codes to Clean User Messages
function getFirebaseErrorMessage(error: any): string {
  const code = error?.code || "";
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled by Firebase administrator.";
    case "auth/user-not-found":
      return "No account found with this email. Please register first.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password. Please check your credentials.";
    case "auth/email-already-in-use":
      return "This email is already registered. Please switch to Sign In.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Sign-In window was closed before completion.";
    case "auth/popup-blocked":
      return "Sign-In popup was blocked by browser. Please allow popups.";
    case "auth/unauthorized-domain":
      return "Domain not authorized! Add 'localhost' in Firebase Console > Authentication > Settings > Authorized Domains.";
    case "auth/api-key-not-valid":
    case "auth/invalid-api-key":
      return "Firebase API Key is invalid. Please check your frontend/.env.local keys.";
    case "auth/operation-not-allowed":
      return "Authentication method not enabled! Enable 'Email/Password' or 'Google' in Firebase Console > Authentication > Sign-in method.";
    default:
      return error?.message || "An unexpected authentication error occurred.";
  }
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("Lead AI Researcher");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  // Real Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const idToken = await fbUser.getIdToken();

      const session: UserSession = {
        uid: fbUser.uid,
        displayName: fbUser.displayName || fbUser.email?.split("@")[0] || "Space Explorer",
        email: fbUser.email,
        photoURL: fbUser.photoURL,
        role: "Verified Researcher",
        organization: "Stackverse-labs • DSU Bangalore"
      };

      localStorage.setItem("antariksha_user", JSON.stringify(session));
      localStorage.setItem("antariksha_token", idToken);
      onAuthSuccess(session);
      onClose();
    } catch (err: any) {
      console.error("Firebase Google Auth Error:", err);
      setErrorMsg(getFirebaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Real Email/Password Auth
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      let fbUser;
      if (tab === "login") {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        fbUser = userCred.user;
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        fbUser = userCred.user;
        if (username) {
          await updateProfile(fbUser, { displayName: username });
        }
      }

      const idToken = await fbUser.getIdToken();
      const session: UserSession = {
        uid: fbUser.uid,
        displayName: username || fbUser.displayName || email.split("@")[0],
        email: fbUser.email,
        photoURL: fbUser.photoURL,
        role: role,
        organization: "Stackverse-labs • DSU Bangalore"
      };

      localStorage.setItem("antariksha_user", JSON.stringify(session));
      localStorage.setItem("antariksha_token", idToken);
      onAuthSuccess(session);
      onClose();
    } catch (err: any) {
      console.error("Firebase Email Auth Error:", err);
      setErrorMsg(getFirebaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0c1322] border border-slate-800/90 rounded-3xl p-6 shadow-2xl text-slate-100 shadow-cyan-500/10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-cyan-500/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Mission Intelligence Passport</h3>
          <p className="text-xs text-slate-400 font-mono">Firebase Production Authentication</p>
        </div>

        {/* Google 1-Click Sign-In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-xs font-semibold text-white flex items-center justify-center gap-2.5 transition-all shadow-sm mb-4 group"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="group-hover:text-cyan-400 transition-colors">Continue with Google</span>
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-[1px] bg-slate-800"></div>
          <span className="text-[10px] font-mono text-slate-500">OR EMAIL & PASSKEY</span>
          <div className="flex-1 h-[1px] bg-slate-800"></div>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 mb-4 text-xs font-medium">
          <button
            onClick={() => { setTab("login"); setErrorMsg(""); }}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              tab === "login"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => { setTab("register"); setErrorMsg(""); }}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              tab === "register"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Real Error Display */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          {tab === "register" && (
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Full Name / Callsign</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Omkar Bhandari"
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-all font-sans"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="omkar@stackverse.io"
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Passkey (min 6 characters)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-all font-sans"
              />
            </div>
          </div>

          {tab === "register" && (
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Research Specialization</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all font-sans"
              >
                <option value="Lead AI Researcher">Lead AI Researcher</option>
                <option value="Planetary Spectroscopist">Planetary Spectroscopist</option>
                <option value="Space Weather Analyst">Space Weather Analyst</option>
                <option value="Satellite Orbit Engineer">Satellite Orbit Engineer</option>
                <option value="University Student Explorer">University Student Explorer</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 mt-3 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying with Firebase...</span>
              </>
            ) : (
              <span>{tab === "login" ? "Verify & Sign In" : "Create Firebase Account"}</span>
            )}
          </button>
        </form>

        {/* Firebase Console Guide Link */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
          <p className="text-[10px] font-mono text-slate-500">
            Backed by Google Firebase Security Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
}
