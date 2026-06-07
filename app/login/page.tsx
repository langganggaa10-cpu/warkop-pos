"use client";

import { useState } from "react";
import { loginAction } from "../auth/actions";
import { User, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  // Fallback Styles (Inline CSS)
  const styles = {
    main: {
      minHeight: '100vh',
      backgroundColor: '#FFF9F2',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'sans-serif',
      position: 'relative' as const,
      overflow: 'hidden',
    },
    blob1: {
      position: 'absolute' as const,
      top: '-10%',
      right: '-5%',
      width: '400px',
      height: '400px',
      background: 'radial-gradient(circle, #FF5F6D 0%, #FFC371 100%)',
      borderRadius: '50%',
      opacity: 0.4,
      filter: 'blur(60px)',
      zIndex: 0,
    },
    logoContainer: {
      position: 'relative' as const,
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '30px',
    },
    logoDot: {
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)',
      borderRadius: '50%',
    },
    logoText: {
      fontSize: '24px',
      fontWeight: 900,
      color: '#333',
    },
    title: {
      position: 'relative' as const,
      zIndex: 10,
      fontSize: '42px',
      fontWeight: 900,
      color: '#333',
      marginBottom: '50px',
      textAlign: 'center' as const,
    },
    card: {
      position: 'relative' as const,
      zIndex: 10,
      backgroundColor: 'white',
      borderRadius: '24px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
      padding: '48px',
      maxWidth: '480px',
      width: '100%',
      border: '1px solid rgba(255,255,255,0.5)',
    },
    inputGroup: {
      marginBottom: '24px',
    },
    label: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#666',
      display: 'block',
      marginBottom: '8px',
    },
    inputWrapper: {
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      position: 'absolute' as const,
      left: '16px',
      color: '#999',
    },
    input: {
      width: '100%',
      padding: '16px 16px 16px 48px',
      backgroundColor: 'white',
      border: '2px solid #F3F4F6',
      borderRadius: '12px',
      fontSize: '16px',
      outline: 'none',
    },
    button: {
      width: '100%',
      padding: '16px',
      borderRadius: '50px',
      backgroundColor: '#00D04B',
      color: 'white',
      fontSize: '18px',
      fontWeight: 900,
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 10px 20px rgba(0,208,75,0.2)',
      marginTop: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    footerLinks: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px',
    },
    link: {
      color: '#3b82f6',
      fontSize: '14px',
      fontWeight: 'bold',
      textDecoration: 'none',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
    },
    featureBar: {
      position: 'relative' as const,
      zIndex: 10,
      marginTop: '80px',
      display: 'flex',
      flexWrap: 'wrap' as const,
      justifyContent: 'center',
      gap: '24px',
    },
    featureItem: {
      backgroundColor: 'white',
      padding: '12px 24px',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      border: '1px solid #F3F4F6',
    }
  };

  return (
    <main style={styles.main} className="min-h-screen">
      {/* Background Decor */}
      <div style={styles.blob1}></div>

      {/* Header Logo */}
      <div style={styles.logoContainer}>
        <div style={styles.logoDot}></div>
        <span style={styles.logoText}>WarkopPOS</span>
      </div>

      <h1 style={styles.title}>
        Good to see you again
      </h1>

      {/* Login Card */}
      <div style={styles.card}>
        <form action={handleSubmit}>
          {error && (
            <div style={{ backgroundColor: '#FEF2F2', color: '#DC2626', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontWeight: 'bold', fontSize: '14px', border: '1px solid #FEE2E2' }}>
              {error}
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Your username</label>
            <div style={styles.inputWrapper}>
              <User size={20} style={styles.icon} />
              <input
                name="username"
                type="text"
                placeholder="e.g. admin"
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Your password</label>
            <div style={styles.inputWrapper}>
              <Lock size={20} style={styles.icon} />
              <input
                name="password"
                type="password"
                placeholder="e.g. warkop123"
                style={styles.input}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              backgroundColor: loading ? '#D1D5DB' : '#00D04B',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              "Sign in"
            )}
          </button>

          <div style={styles.footerLinks}>
            <button type="button" style={styles.link}>Don't have an account?</button>
            <button type="button" style={styles.link}>Forgot password?</button>
          </div>
        </form>
      </div>

      {/* Footer Features */}
      <div style={styles.featureBar}>
        {[
          { name: "Menu", color: "#FF5F6D" },
          { name: "Meja", color: "#FFC371" },
          { name: "Kasir", color: "#A855F7" },
          { name: "Orders", color: "#3B82F6" },
          { name: "Reports", color: "#EC4899" },
        ].map((item) => (
          <div key={item.name} style={styles.featureItem}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.color }}></div>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>{item.name}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
