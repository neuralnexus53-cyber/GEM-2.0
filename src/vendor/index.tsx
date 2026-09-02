import React from "react";
import { AuthProvider } from "./context/AuthContext";
import VendorApp from "./App";

export default function VendorPortal() {
  return (
    <AuthProvider>
      <VendorApp />
    </AuthProvider>
  );
}