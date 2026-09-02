import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession, PlanTier } from '../types/auth_billing';
import { UserRole, VendorProfile } from '../types';
import { mockProfiles } from '../data/mockData';

export interface RegisterVendorPayload {
  companyName: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  gstin: string;
  pan: string;
  turnoverCr: number;
  experienceYears: number;
  udyamNumber?: string;
  contractorClass?: string;
  brandName?: string;
  profilePhotoUrl?: string;
  contactPhone?: string;
  authorizedSignatory?: string;
  address?: string;
  state?: string;
  pincode?: string;
  bankName?: string;
  bankAccount?: string;
  ifscCode?: string;
  miiPercentage?: number;
  dpiitRegistered?: boolean;
}

interface PendingMfaState {
  session: UserSession;
  profile: VendorProfile;
  otp: string;
  mobileLast4: string;
  email: string;
}

interface AuthContextType {
  user: UserSession | null;
  profile: VendorProfile;
  isAuthenticated: boolean;
  pendingMfa: PendingMfaState | null;
  login: (identifier: string, password: string) => Promise<{ success: boolean; requiresMfa?: boolean; error?: string }>;
  loginAsDemoVendor: (role: UserRole) => Promise<{ success: boolean; requiresMfa?: boolean }>;
  loginWithMicrosoftAuthenticator: (role?: UserRole) => Promise<{ success: boolean; requiresMfa?: boolean }>;
  verifyMfa: (otp: string) => boolean;
  cancelMfa: () => void;
  registerVendor: (payload: RegisterVendorPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updated: Partial<VendorProfile>) => void;
  switchProfile: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_ACCOUNTS_MAP: Record<UserRole, { session: UserSession; profile: VendorProfile; password: string }> = {
  OEM_SELLER: {
    session: {
      id: 'usr-oem-01',
      email: 'oem@apexpower.com',
      fullName: 'Rajesh Sharma (Director)',
      companyName: 'Apex Dynamics & Energy Systems Ltd.',
      role: 'OEM_SELLER',
      vendorId: 'VEND-OEM-8902',
      gstin: '07AAACA4952J1ZM',
      pan: 'AAACA4952J',
      token: 'gem_jwt_sec_token_apex_2026_x89a',
      isMfaVerified: true,
      loginTimestamp: new Date().toISOString(),
      sessionId: 'GEM-SSO-890214-DEL',
      ipAddress: '103.21.144.92 (New Delhi)',
      planId: 'PRO'
    },
    profile: mockProfiles.OEM_SELLER,
    password: 'password123'
  },
  MSME_STARTUP: {
    session: {
      id: 'usr-msme-02',
      email: 'founder@novavolt.in',
      fullName: 'Priya Deshmukh (Founder & MD)',
      companyName: 'Novavolt Instruments & Automation Pvt Ltd',
      role: 'MSME_STARTUP',
      vendorId: 'VEND-MSME-3412',
      gstin: '27AABCN8712P1ZL',
      pan: 'AABCN8712P',
      token: 'gem_jwt_sec_token_novavolt_2026_m34b',
      isMfaVerified: true,
      loginTimestamp: new Date().toISOString(),
      sessionId: 'GEM-SSO-341299-MUM',
      ipAddress: '115.112.87.14 (Mumbai, MH)',
      planId: 'FREE'
    },
    profile: mockProfiles.MSME_STARTUP,
    password: 'password123'
  },
  WORKS_CONTRACTOR: {
    session: {
      id: 'usr-works-03',
      email: 'director@bharatinfra.com',
      fullName: 'Vikramaditya Rao (Chief Engineer)',
      companyName: 'Bharat Infra-Tech & EPC Solutions',
      role: 'WORKS_CONTRACTOR',
      vendorId: 'VEND-WORKS-7105',
      gstin: '29AAGCB5541Q1ZP',
      pan: 'AAGCB5541Q',
      token: 'gem_jwt_sec_token_bharat_2026_w71c',
      isMfaVerified: true,
      loginTimestamp: new Date().toISOString(),
      sessionId: 'GEM-SSO-710582-BLR',
      ipAddress: '122.179.33.208 (Bengaluru, KA)',
      planId: 'STARTER'
    },
    profile: mockProfiles.WORKS_CONTRACTOR,
    password: 'password123'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check stored session
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('gem_vendor_auth_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Track active vendor profile
  const [profile, setProfile] = useState<VendorProfile>(() => {
    if (user) {
      const savedCustom = localStorage.getItem(`gem_custom_profile_${user.vendorId}`);
      if (savedCustom) {
        try {
          return JSON.parse(savedCustom);
        } catch (e) {}
      }
      return mockProfiles[user.role] || mockProfiles.OEM_SELLER;
    }
    return mockProfiles.OEM_SELLER;
  });

  // 2FA / MFA Pending state
  const [pendingMfa, setPendingMfa] = useState<PendingMfaState | null>(null);

  // Sync session with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('gem_vendor_auth_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('gem_vendor_auth_session');
    }
  }, [user]);

  // Sync profile when user changes
  useEffect(() => {
    if (user) {
      const savedCustom = localStorage.getItem(`gem_custom_profile_${user.vendorId}`);
      if (savedCustom) {
        try {
          setProfile(JSON.parse(savedCustom));
          return;
        } catch (e) {}
      }
      if (mockProfiles[user.role]) {
        // Overlay current user details onto standard profile
        setProfile({
          ...mockProfiles[user.role],
          name: user.companyName || mockProfiles[user.role].name,
          gstin: user.gstin || mockProfiles[user.role].gstin,
          pan: user.pan || mockProfiles[user.role].pan,
          id: user.vendorId || mockProfiles[user.role].id
        });
      }
    }
  }, [user]);

  const loginAsDemoVendor = async (role: UserRole) => {
    const demo = DEMO_ACCOUNTS_MAP[role];
    const sessionData: UserSession = {
      ...demo.session,
      loginTimestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST'
    };

    setUser(sessionData);
    setProfile(demo.profile);
    setPendingMfa(null);
    return { success: true, requiresMfa: false };
  };

  const loginWithMicrosoftAuthenticator = async (role: UserRole = 'OEM_SELLER') => {
    const demo = DEMO_ACCOUNTS_MAP[role];
    const sessionData: UserSession = {
      ...demo.session,
      loginTimestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST (via Microsoft Authenticator)'
    };

    setUser(sessionData);
    setProfile(demo.profile);
    setPendingMfa(null);
    return { success: true, requiresMfa: false };
  };

  const login = async (identifier: string, password: string) => {
    const cleanId = identifier.trim().toLowerCase();

    // Check custom registered users first
    const registeredUsersJson = localStorage.getItem('gem_registered_vendors');
    if (registeredUsersJson) {
      try {
        const registeredUsers: Array<{ session: UserSession; profile: VendorProfile; password: string }> = JSON.parse(registeredUsersJson);
        const match = registeredUsers.find(
          u => u.session.email.toLowerCase() === cleanId ||
               u.session.vendorId.toLowerCase() === cleanId ||
               u.session.gstin.toLowerCase() === cleanId
        );

        if (match) {
          if (match.password && match.password !== password) {
            return { success: false, error: 'Invalid password. Please check your credentials.' };
          }

          const sessionData: UserSession = {
            ...match.session,
            loginTimestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST'
          };

          setUser(sessionData);
          setProfile(match.profile);
          setPendingMfa(null);
          return { success: true, requiresMfa: false };
        }
      } catch (e) {}
    }

    // Check demo accounts
    for (const role of Object.keys(DEMO_ACCOUNTS_MAP) as UserRole[]) {
      const demo = DEMO_ACCOUNTS_MAP[role];
      if (
        demo.session.email.toLowerCase() === cleanId ||
        demo.session.vendorId.toLowerCase() === cleanId ||
        demo.session.gstin.toLowerCase() === cleanId ||
        cleanId.includes(role.toLowerCase().substring(0, 3))
      ) {
        return loginAsDemoVendor(role);
      }
    }

    // Fallback: If identifier contains valid format, create active vendor session
    if (cleanId.includes('@') || cleanId.startsWith('vend-')) {
      const rolePrefix: UserRole = cleanId.includes('msme') ? 'MSME_STARTUP' : cleanId.includes('work') ? 'WORKS_CONTRACTOR' : 'OEM_SELLER';
      const fallbackSession: UserSession = {
        id: `usr-${Date.now()}`,
        email: cleanId.includes('@') ? cleanId : `${cleanId}@gov-vendor.in`,
        fullName: cleanId.split('@')[0].toUpperCase() + ' (Authorized Signatory)',
        companyName: `${cleanId.split('@')[0].toUpperCase()} Enterprises Pvt Ltd`,
        role: rolePrefix,
        vendorId: cleanId.startsWith('vend-') ? cleanId.toUpperCase() : `VEND-${rolePrefix.substring(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
        gstin: '07AAAC' + Math.floor(1000 + Math.random() * 9000) + 'A1Z1',
        pan: 'AAAC' + Math.floor(1000 + Math.random() * 9000) + 'A',
        token: `gem_jwt_${Date.now()}`,
        isMfaVerified: true,
        loginTimestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        sessionId: `GEM-SSO-${Math.floor(100000 + Math.random() * 900000)}`,
        ipAddress: '103.48.192.11 (Secured Gateway)',
        planId: 'FREE'
      };

      const fallbackProfile: VendorProfile = {
        ...mockProfiles[rolePrefix],
        id: fallbackSession.vendorId,
        name: fallbackSession.companyName,
        gstin: fallbackSession.gstin,
        pan: fallbackSession.pan
      };

      if (enableMfa) {
        setPendingMfa({
          session: fallbackSession,
          profile: fallbackProfile,
          otp: '202688',
          mobileLast4: '7731',
          email: fallbackSession.email
        });
        return { success: true, requiresMfa: true };
      }

      setUser(fallbackSession);
      setProfile(fallbackProfile);
      return { success: true, requiresMfa: false };
    }

    return { success: false, error: 'User ID / Email not recognized. Use quick access or registered email.' };
  };

  const verifyMfa = (otp: string) => {
    if (!pendingMfa) return false;
    // Accept valid 6-digit code (default simulation accepts '202688' or any 6-digit input)
    if (otp.length === 6) {
      setUser(pendingMfa.session);
      setProfile(pendingMfa.profile);
      setPendingMfa(null);
      return true;
    }
    return false;
  };

  const cancelMfa = () => {
    setPendingMfa(null);
  };

  const registerVendor = async (payload: RegisterVendorPayload) => {
    const rolePrefix = payload.role.substring(0, 3);
    const newVendorId = `VEND-${rolePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newSession: UserSession = {
      id: `usr-${Date.now()}`,
      email: payload.email,
      fullName: payload.fullName,
      companyName: payload.companyName,
      role: payload.role,
      vendorId: newVendorId,
      gstin: payload.gstin.toUpperCase(),
      pan: payload.pan.toUpperCase(),
      token: `gem_jwt_${Date.now()}_sec`,
      isMfaVerified: true,
      loginTimestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      sessionId: `GEM-SSO-${Math.floor(100000 + Math.random() * 900000)}`,
      ipAddress: '103.21.144.92 (Registered IP)',
      planId: 'FREE'
    };

    const newProfile: VendorProfile = {
      id: newVendorId,
      name: payload.companyName,
      role: payload.role,
      gstin: payload.gstin.toUpperCase(),
      pan: payload.pan.toUpperCase(),
      turnoverCr: payload.turnoverCr || 5.0,
      experienceYears: payload.experienceYears || 3,
      udyamNumber: payload.udyamNumber || (payload.role === 'MSME_STARTUP' ? `UDYAM-DL-01-${Math.floor(1000000 + Math.random() * 9000000)}` : undefined),
      dpiitRegistered: payload.dpiitRegistered,
      contractorClass: payload.contractorClass || (payload.role === 'WORKS_CONTRACTOR' ? 'Class-1 Registered EPC' : undefined),
      brandName: payload.brandName || `${payload.companyName.split(' ')[0]}™`,
      oemCertifications: ['ISO 9001:2015', 'GeM Verified Seller Certificate', 'BIS Standard QMS'],
      miiPercentage: payload.miiPercentage || 85,
      complianceScore: 92,
      verifiedDocsCount: 8,
      totalDocsCount: 10,
      profilePhotoUrl: payload.profilePhotoUrl || '',
      contactEmail: payload.email,
      contactPhone: payload.contactPhone || '',
      authorizedSignatory: payload.authorizedSignatory || payload.fullName,
      address: payload.address || '',
      state: payload.state || 'Delhi',
      pincode: payload.pincode || '',
      bankName: payload.bankName || '',
      bankAccount: payload.bankAccount || '',
      ifscCode: payload.ifscCode || ''
    };

    // Attempt backend registration sync with Supabase
    try {
      const resp = await fetch('http://localhost:8000/api/auth/register-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          full_name: payload.fullName,
          vendor_name: payload.companyName,
          role: payload.role,
          gstin: payload.gstin,
          pan: payload.pan,
          turnover_cr: payload.turnoverCr,
          experience_years: payload.experienceYears,
          brand_name: payload.brandName,
          udyam_number: payload.udyamNumber,
          dpiit_registered: payload.dpiitRegistered,
          contractor_class: payload.contractorClass,
          mii_percentage: payload.miiPercentage,
          contact_phone: payload.contactPhone,
          profile_photo_url: payload.profilePhotoUrl,
          authorized_signatory: payload.authorizedSignatory || payload.fullName,
          address: payload.address,
          state: payload.state,
          pincode: payload.pincode,
          bank_name: payload.bankName,
          bank_account: payload.bankAccount,
          ifsc_code: payload.ifscCode
        })
      });
      if (resp.ok) {
        const backendData = await resp.json();
        if (backendData.vendor_id) {
          newSession.vendorId = backendData.vendor_id;
          newProfile.id = backendData.vendor_id;
        }
      }
    } catch (e) {
      console.warn('[Vendor Registration] Backend offline, saved to isolated local vault store:', e);
    }

    // Save to registered vendors in localStorage
    const existingStr = localStorage.getItem('gem_registered_vendors');
    const registered = existingStr ? JSON.parse(existingStr) : [];
    registered.push({
      session: newSession,
      profile: newProfile,
      password: payload.password
    });
    localStorage.setItem('gem_registered_vendors', JSON.stringify(registered));
    localStorage.setItem(`gem_custom_profile_${newProfile.id}`, JSON.stringify(newProfile));

    setUser(newSession);
    setProfile(newProfile);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setPendingMfa(null);
    localStorage.removeItem('gem_vendor_auth_session');
  };

  const updateProfile = async (updated: Partial<VendorProfile>) => {
    const merged = { ...profile, ...updated };
    setProfile(merged);
    if (user) {
      localStorage.setItem(`gem_custom_profile_${user.vendorId}`, JSON.stringify(merged));
      // Sync update to backend
      try {
        await fetch('http://localhost:8000/api/vendors/profile', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(merged)
        });
      } catch (e) {}
    }
  };

  const switchProfile = (newRole: UserRole) => {
    loginAsDemoVendor(newRole, false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isAuthenticated: !!user,
      pendingMfa,
      login,
      loginAsDemoVendor,
      loginWithMicrosoftAuthenticator,
      verifyMfa,
      cancelMfa,
      registerVendor,
      logout,
      updateProfile,
      switchProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};