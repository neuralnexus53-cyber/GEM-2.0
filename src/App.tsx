import React, { Suspense, lazy } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

// Lazy load portals and auth pages for optimal chunking
const VendorPortal = lazy(() => import("./vendor/index"));
const GovPortal = lazy(() => import("./gov/index"));
const VendorLoginPage = lazy(() => import("./pages/VendorLoginPage"));
const VendorRegisterPage = lazy(() => import("./pages/VendorRegisterPage"));
const GovLoginPage = lazy(() => import("./pages/GovLoginPage"));
const GovRegisterPage = lazy(() => import("./pages/GovRegisterPage"));

function LoadingScreen({ label }: { label: string }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #050c1e 0%, #0f172a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "16px",
      fontFamily: "system-ui, sans-serif"
    }}>
      <div style={{
        width: 48, height: 48,
        border: "4px solid #f59e0b",
        borderTopColor: "transparent",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <p style={{ color: "#94a3b8", fontSize: 14, margin: 0, fontWeight: 600 }}>
        Loading {label}...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/vendor/login"
          element={
            <Suspense fallback={<LoadingScreen label="Vendor Login" />}>
              <VendorLoginPage />
            </Suspense>
          }
        />
        <Route
          path="/vendor/register"
          element={
            <Suspense fallback={<LoadingScreen label="Vendor Registration" />}>
              <VendorRegisterPage />
            </Suspense>
          }
        />
        <Route path="/login" element={<Navigate to="/vendor/login" replace />} />
        <Route path="/register" element={<Navigate to="/vendor/register" replace />} />

        <Route
          path="/gov/login"
          element={
            <Suspense fallback={<LoadingScreen label="Procurement Officer Authentication" />}>
              <GovLoginPage />
            </Suspense>
          }
        />
        <Route
          path="/gov/register"
          element={
            <Suspense fallback={<LoadingScreen label="Procurement Officer Onboarding" />}>
              <GovRegisterPage />
            </Suspense>
          }
        />
        <Route path="/gov-login" element={<Navigate to="/gov/login" replace />} />
        <Route path="/gov-register" element={<Navigate to="/gov/register" replace />} />

        <Route
          path="/vendor/*"
          element={
            <Suspense fallback={<LoadingScreen label="Vendor Compliance Portal" />}>
              <VendorPortal />
            </Suspense>
          }
        />

        <Route
          path="/gov/*"
          element={
            <Suspense fallback={<LoadingScreen label="Procurement Officer Suite" />}>
              <GovPortal />
            </Suspense>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}