import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'hi' | 'or' | 'mr' | 'ta' | 'te' | 'bn' | 'gu' | 'kn' | 'ml' | 'pa';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', region: 'National / Official' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', region: 'National / राजभाषा' },
  { code: 'or', label: 'Odia', nativeLabel: 'ଓଡ଼ିଆ', region: 'Odisha' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', region: 'Maharashtra' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', region: 'Tamil Nadu' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', region: 'Andhra Pradesh / Telangana' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', region: 'West Bengal' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી', region: 'Gujarat' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', region: 'Karnataka' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം', region: 'Kerala' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ', region: 'Punjab' }
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Top Bar & Government Headers
    'gov.india': 'Government of India',
    'gov.ministry': 'Ministry of Commerce & Industry',
    'gov.portal_title': 'GeM 2.0 Compliance & Procurement Portal',
    'gov.tagline': 'National Public Procurement & Sovereign Bid Evaluation Engine',
    'gov.helpdesk': 'GeM Helpdesk',
    'gov.portal_sop': 'Portal SOP',
    'gov.sovereign_gateway': 'Sovereign Gateway Connected',
    
    // Navigation
    'nav.home': 'Home',
    'nav.officer_portal': 'Procurement Officer Portal',
    'nav.officer_login': 'Officer Login',
    'nav.officer_register': 'Officer Registration',
    'nav.vendor_portal': 'Vendor Portal',
    'nav.vendor_login': 'Vendor Login',
    'nav.vendor_register': 'Vendor Registration',
    'nav.operational_arch': 'Operational Architecture',
    'nav.regulatory_faq': 'Regulatory FAQ Dossier',
    'nav.initiatives': 'Our Initiatives',
    'nav.statistics': 'Live Statistics',
    'nav.clarification_ticket': 'Clarification Ticket',
    'nav.menu': 'Menu',
    'nav.logout': 'Sign Out',
    'nav.back_home': 'Back to Home',
    'nav.dashboard': 'Dashboard',
    
    // Auth & Vendor Gateway
    'auth.vendor_sso': 'Government Vendor & Seller Single Sign-On',
    'auth.vendor_signin': 'Vendor Sign In',
    'auth.login_otp': 'Login with OTP',
    'auth.new_registration': 'New Registration',
    'auth.identifier_label': 'GeM Seller ID / Udyam No. / Registered Email',
    'auth.password_label': 'Account Password',
    'auth.forgot_password': 'Forgot Password?',
    'auth.captcha_label': 'Security Captcha Verification',
    'auth.mfa_mandatory': '2-Step OTP Security Verification (Mandatory)',
    'auth.mfa_enforced': 'Enforced',
    'auth.mfa_desc': 'Statutory 2-Factor Authentication is mandatory under GFR 2017 & GeM 2.0 Security Guidelines.',
    'auth.btn_direct_login': 'Direct Login & Enter Dashboard',
    'auth.authenticating': 'Authenticating Session...',
    'auth.workstation_register': 'Register this terminal as a verified business workstation',
    'auth.already_registered': 'Already Registered? Login',
    'auth.new_seller_cta': 'New Seller? Register',
    'auth.otp_modal_title': 'Two-Factor Security Verification',
    'auth.otp_sent_notice': 'A 6-digit one-time password (OTP) has been sent to your registered mobile and email.',
    'auth.otp_helper': 'Security OTP Code:',
    'auth.auto_fill': 'Auto-Fill',
    'auth.verify_enter': 'Verify OTP & Enter',
    'auth.cancel': 'Cancel',
    
    // Government Officer Auth
    'gov_auth.title': 'Government Procurement Officer Secure Sign-In',
    'gov_auth.subtitle': 'Authorized Personnel & Tender Evaluation Committee Gateway',
    'gov_auth.badge_label': 'Officer Badge ID / Official NIC Email',
    'gov_auth.pin_label': 'Hardware Token / CAG Security PIN',
    'gov_auth.btn_login': 'Verify Sovereign Clearance & Enter',
    
    // Common Dashboard & Portal Badges
    'common.language': 'Language',
    'common.select_language': 'Select Portal Language',
    'common.search': 'Search',
    'common.status': 'Status',
    'common.active': 'Active',
    'common.pending': 'Pending',
    'common.verified': 'Verified',
    'common.audit_ledger': 'CAG Audit Ledger',
    'common.sealed_vault': 'Double-Blind Vault',
    'common.compliance_score': 'Compliance Score',
    'common.tenders': 'Tenders',
    'common.proposals': 'Bids / Proposals',
    'common.live_sync': 'GeM & CPPP Live Sync Active'
  },
  hi: {
    // Top Bar & Government Headers
    'gov.india': 'भारत सरकार',
    'gov.ministry': 'वाणिज्य एवं उद्योग मंत्रालय',
    'gov.portal_title': 'GeM 2.0 अनुपालन एवं सार्वजनिक खरीद पोर्टल',
    'gov.tagline': 'राष्ट्रीय सार्वजनिक खरीद एवं संप्रभु निविदा मूल्यांकन प्रणाली',
    'gov.helpdesk': 'GeM सहायता केंद्र',
    'gov.portal_sop': 'पोर्टल मानक संचालन प्रक्रिया (SOP)',
    'gov.sovereign_gateway': 'संप्रभु सरकारी गेटवे से जुड़ा हुआ',
    
    // Navigation
    'nav.home': 'मुख्य पृष्ठ',
    'nav.officer_portal': 'खरीद अधिकारी पोर्टल',
    'nav.officer_login': 'अधिकारी लॉगिन',
    'nav.officer_register': 'अधिकारी पंजीकरण',
    'nav.vendor_portal': 'विक्रेता (वेंडर) पोर्टल',
    'nav.vendor_login': 'विक्रेता लॉगिन',
    'nav.vendor_register': 'विक्रेता पंजीकरण',
    'nav.operational_arch': 'परिचालन वास्तुकला',
    'nav.regulatory_faq': 'नियामक प्रश्नोत्तरी (FAQ)',
    'nav.initiatives': 'हमारी प्रमुख पहलें',
    'nav.statistics': 'लाइव सांख्यिकी',
    'nav.clarification_ticket': 'स्पष्टीकरण टिकट',
    'nav.menu': 'मेनू',
    'nav.logout': 'लॉग आउट',
    'nav.back_home': 'मुख्य पृष्ठ पर वापस जाएं',
    'nav.dashboard': 'डैशबोर्ड',
    
    // Auth & Vendor Gateway
    'auth.vendor_sso': 'सरकारी विक्रेता एवं सेलर एकल साइन-ऑन (SSO)',
    'auth.vendor_signin': 'विक्रेता साइन-इन',
    'auth.login_otp': 'ओटीपी द्वारा लॉगिन',
    'auth.new_registration': 'नया पंजीकरण',
    'auth.identifier_label': 'GeM विक्रेता आईडी / उद्यम संख्या / पंजीकृत ईमेल',
    'auth.password_label': 'खाता पासवर्ड',
    'auth.forgot_password': 'पासवर्ड भूल गए?',
    'auth.captcha_label': 'सुरक्षा कैप्चा सत्यापन',
    'auth.mfa_mandatory': '2-चरणीय ओटीपी सुरक्षा सत्यापन (अनिवार्य)',
    'auth.mfa_enforced': 'अनिवार्य लागू',
    'auth.mfa_desc': 'GFR 2017 और GeM 2.0 सुरक्षा दिशा-निर्देशों के तहत 2-चरणीय प्रमाणीकरण अनिवार्य है।',
    'auth.btn_direct_login': 'सीधा लॉगिन करें और डैशबोर्ड में प्रवेश करें',
    'auth.authenticating': 'सत्र प्रमाणित हो रहा है...',
    'auth.workstation_register': 'इस टर्मिनल को सत्यापित व्यावसायिक वर्कस्टेशन के रूप में पंजीकृत करें',
    'auth.already_registered': 'पहले से पंजीकृत हैं? लॉगिन करें',
    'auth.new_seller_cta': 'नए विक्रेता? पंजीकरण करें',
    'auth.otp_modal_title': 'द्वि-चरणीय सुरक्षा सत्यापन',
    'auth.otp_sent_notice': 'आपके पंजीकृत मोबाइल और ईमेल पर 6 अंकों का सुरक्षा ओटीपी भेजा गया है।',
    'auth.otp_helper': 'सुरक्षा ओटीपी कोड:',
    'auth.auto_fill': 'स्वतः भरें',
    'auth.verify_enter': 'ओटीपी सत्यापित करें एवं प्रवेश करें',
    'auth.cancel': 'रद्द करें',
    
    // Government Officer Auth
    'gov_auth.title': 'सरकारी खरीद अधिकारी सुरक्षित साइन-इन',
    'gov_auth.subtitle': 'अधिकृत अधिकारी एवं निविदा मूल्यांकन समिति गेटवे',
    'gov_auth.badge_label': 'अधिकारी बैज आईडी / आधिकारिक NIC ईमेल',
    'gov_auth.pin_label': 'हार्डवेयर टोकन / CAG सुरक्षा पिन',
    'gov_auth.btn_login': 'संप्रभु सुरक्षा स्तर सत्यापित करें और प्रवेश करें',
    
    // Common Dashboard & Portal Badges
    'common.language': 'भाषा',
    'common.select_language': 'पोर्टल भाषा चुनें',
    'common.search': 'खोजें',
    'common.status': 'स्थिति',
    'common.active': 'सक्रिय',
    'common.pending': 'लंबित',
    'common.verified': 'सत्यापित',
    'common.audit_ledger': 'CAG ऑडिट खाता (लेजर)',
    'common.sealed_vault': 'डबल-ब्लाइंड सीलबंद वॉल्ट',
    'common.compliance_score': 'अनुपालन स्कोर',
    'common.tenders': 'निविदाएं (टेंडर)',
    'common.proposals': 'प्रस्ताव / बोलियां',
    'common.live_sync': 'GeM और CPPP लाइव सिंक सक्रिय'
  },
  or: {
    // Odia (ଓଡ଼ିଆ)
    'gov.india': 'ଭାରତ ସରକାର',
    'gov.ministry': 'ବାଣିଜ୍ୟ ଏବଂ ଶିଳ୍ପ ମନ୍ତ୍ରଣାଳୟ',
    'gov.portal_title': 'GeM 2.0 ଅନୁପାଳନ ଏବଂ ସାର୍ବଜନୀନ କ୍ରୟ ପୋର୍ଟାଲ',
    'gov.tagline': 'ଜାତୀୟ ସାର୍ବଜନୀନ କ୍ରୟ ଏବଂ ସାର୍ବଭୌମ ଟେଣ୍ଡର ମୂଲ୍ୟାଙ୍କନ ପ୍ରଣାଳୀ',
    'gov.helpdesk': 'GeM ସହାୟତା କେନ୍ଦ୍ର',
    'gov.portal_sop': 'ପୋର୍ଟାଲ ମାନକ କାର୍ଯ୍ୟପଦ୍ଧତି (SOP)',
    'gov.sovereign_gateway': 'ସାର୍ବଭୌମ ସରକାରୀ ଗେଟୱେ ସଂଯୁକ୍ତ',
    
    // Navigation
    'nav.home': 'ମୁଖ୍ୟ ପୃଷ୍ଠା',
    'nav.officer_portal': 'କ୍ରୟ ଅଧିକାରୀ ପୋର୍ଟାଲ',
    'nav.officer_login': 'ଅଧିକାରୀ ଲଗଇନ୍',
    'nav.officer_register': 'ଅଧିକାରୀ ପଞ୍ଜୀକରଣ',
    'nav.vendor_portal': 'ବିକ୍ରେତା (ଭେଣ୍ଡର) ପୋର୍ଟାଲ',
    'nav.vendor_login': 'ବିକ୍ରେତା ଲଗଇନ୍',
    'nav.vendor_register': 'ବିକ୍ରେତା ପଞ୍ଜୀକରଣ',
    'nav.operational_arch': 'ପରିଚାଳନା ସ୍ଥାପତ୍ୟ',
    'nav.regulatory_faq': 'ନିୟାମକ ପ୍ରଶ୍ନୋତ୍ତର (FAQ)',
    'nav.initiatives': 'ଆମର ପ୍ରମୁଖ ପଦକ୍ଷେପ',
    'nav.statistics': 'ଲାଇଭ ପରିସଂଖ୍ୟାନ',
    'nav.clarification_ticket': 'ସ୍ପଷ୍ଟୀକରଣ ଟିକେଟ',
    'nav.menu': 'ମେନୁ',
    'nav.logout': 'ପ୍ରସ୍ଥାନ କରନ୍ତୁ',
    'nav.back_home': 'ମୁଖ୍ୟ ପୃଷ୍ଠାକୁ ଫେରନ୍ତୁ',
    'nav.dashboard': 'ଡ୍ୟାସବୋର୍ଡ',
    
    // Auth & Vendor Gateway
    'auth.vendor_sso': 'ସରକାରୀ ବିକ୍ରେତା ଏକକ ସାଇନ୍-ଅନ୍ (SSO)',
    'auth.vendor_signin': 'ବିକ୍ରେତା ସାଇନ୍-ଇନ୍',
    'auth.login_otp': 'ଓଟିପି ମାଧ୍ୟମରେ ଲଗଇନ୍',
    'auth.new_registration': 'ନୂତନ ପଞ୍ଜୀକରଣ',
    'auth.identifier_label': 'GeM ବିକ୍ରେତା ଆଇଡି / ଉଦ୍ୟମ ନମ୍ବର / ପଞ୍ଜୀକୃତ ଇମେଲ',
    'auth.password_label': 'ଖାତା ପାସୱାର୍ଡ',
    'auth.forgot_password': 'ପାସୱାର୍ଡ ଭୁଲିଗଲେ କି?',
    'auth.captcha_label': 'ସୁରକ୍ଷା କ୍ୟାପଚା ଯାଞ୍ଚ',
    'auth.mfa_mandatory': '୨-ପର୍ଯ୍ୟାୟ ଓଟିପି ସୁରକ୍ଷା ଯାଞ୍ଚ (ବାଧ୍ୟତାମୂଳକ)',
    'auth.mfa_enforced': 'ବାଧ୍ୟତାମୂଳକ ଲାଗୁ',
    'auth.mfa_desc': 'GFR 2017 ଏବଂ GeM 2.0 ନିୟମ ଅନୁଯାୟୀ ୨-ପର୍ଯ୍ୟାୟ ପ୍ରମାଣୀକରଣ ବାଧ୍ୟତାମୂଳକ ଅଟେ।',
    'auth.btn_direct_login': 'ସିଧାସଳଖ ଲଗଇନ୍ କରନ୍ତୁ ଏବଂ ଡ୍ୟାସବୋର୍ଡରେ ପ୍ରବେଶ କରନ୍ତୁ',
    'auth.authenticating': 'ସତ୍ର ପ୍ରମାଣିତ ହେଉଛି...',
    'auth.workstation_register': 'ଏହି ଟର୍ମିନାଲକୁ ଯାଞ୍ଚ ହୋଇଥିବା ବ୍ୟବସାୟିକ ୱାର୍କଷ୍ଟେସନ ଭାବେ ପଞ୍ଜୀକରଣ କରନ୍ତୁ',
    'auth.already_registered': 'ପୂର୍ବରୁ ପଞ୍ଜୀକୃତ କି? ଲଗଇନ୍ କରନ୍ତୁ',
    'auth.new_seller_cta': 'ନୂତନ ବିକ୍ରେତା? ପଞ୍ଜୀକରଣ କରନ୍ତୁ',
    'auth.otp_modal_title': 'ଦୁଇ-ପର୍ଯ୍ୟାୟ ସୁରକ୍ଷା ଯାଞ୍ଚ',
    'auth.otp_sent_notice': 'ଆପଣଙ୍କ ପଞ୍ଜୀକୃତ ମୋବାଇଲ୍ ଏବଂ ଇମେଲକୁ ୬ ଅଙ୍କ ବିଶିଷ୍ଟ ସୁରକ୍ଷା ଓଟିପି ପଠାଯାଇଛି।',
    'auth.otp_helper': 'ସୁରକ୍ଷା ଓଟିପି କୋଡ୍:',
    'auth.auto_fill': 'ସ୍ୱୟଂକ୍ରିୟ ଭରନ୍ତୁ',
    'auth.verify_enter': 'ଓଟିପି ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ ପ୍ରବେଶ କରନ୍ତୁ',
    'auth.cancel': 'ବାତିଲ କରନ୍ତୁ',
    
    // Government Officer Auth
    'gov_auth.title': 'ସରକାରୀ କ୍ରୟ ଅଧିକାରୀ ସୁରକ୍ଷିତ ସାଇନ୍-ଇନ୍',
    'gov_auth.subtitle': 'ଅଧିକୃତ କର୍ମଚାରୀ ଏବଂ ଟେଣ୍ଡର ମୂଲ୍ୟାଙ୍କନ କମିଟି ଗେଟୱେ',
    'gov_auth.badge_label': 'ଅଧିକାରୀ ବ୍ୟାଜ୍ ଆଇଡି / ସରକାରୀ NIC ଇମେଲ',
    'gov_auth.pin_label': 'ହାର୍ଡୱେର ଟୋକନ୍ / CAG ସୁରକ୍ଷା ପିନ୍',
    'gov_auth.btn_login': 'ସାର୍ବଭୌମ ସୁରକ୍ଷା ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ ପ୍ରବେଶ କରନ୍ତୁ',
    
    // Common Dashboard & Portal Badges
    'common.language': 'ଭାଷା',
    'common.select_language': 'ପୋର୍ଟାଲ ଭାଷା ବାଛନ୍ତୁ',
    'common.search': 'ସନ୍ଧାନ କରନ୍ତୁ',
    'common.status': 'ସ୍ଥିତି',
    'common.active': 'ସକ୍ରିୟ',
    'common.pending': 'ବକେୟା',
    'common.verified': 'ଯାଞ୍ଚ ସମ୍ପନ୍ନ',
    'common.audit_ledger': 'CAG ଅଡିଟ୍ ଲେଜର',
    'common.sealed_vault': 'ଡବଲ-ବ୍ଲାଇଣ୍ଡ ସିଲ୍ ଭଲ୍ଟ',
    'common.compliance_score': 'ଅନୁପାଳନ ସ୍କୋର',
    'common.tenders': 'ଟେଣ୍ଡରସମୂହ',
    'common.proposals': 'ବିଡ୍ / ପ୍ରସ୍ତାବ',
    'common.live_sync': 'GeM ଏବଂ CPPP ଲାଇଭ୍ ସିଙ୍କ୍ ସକ୍ରିୟ'
  },
  mr: {
    // Marathi
    'gov.india': 'भारत सरकार',
    'gov.ministry': 'वाणिज्य आणि उद्योग मंत्रालय',
    'gov.portal_title': 'GeM 2.0 अनुपालन आणि सार्वजनिक खरेदी पोर्टल',
    'gov.tagline': 'राष्ट्रीय सार्वजनिक खरेदी आणि सार्वभौम निविदा मूल्यमापन प्रणाली',
    'gov.helpdesk': 'GeM हेल्पडेस्क',
    'gov.portal_sop': 'पोर्टल कार्यपद्धती (SOP)',
    'gov.sovereign_gateway': 'सार्वभौम गेटवे कनेक्टेड',
    
    'nav.home': 'मुख्यपृष्ठ',
    'nav.officer_portal': 'खरेदी अधिकारी पोर्टल',
    'nav.officer_login': 'अधिकारी लॉगिन',
    'nav.officer_register': 'अधिकारी नोंदणी',
    'nav.vendor_portal': 'विक्रेता पोर्टल',
    'nav.vendor_login': 'विक्रेता लॉगिन',
    'nav.vendor_register': 'विक्रेता नोंदणी',
    'nav.operational_arch': 'ऑपरेशनल आर्किटेक्चर',
    'nav.regulatory_faq': 'नियामक प्रश्नोत्तरे',
    'nav.initiatives': 'आमचे उपक्रम',
    'nav.statistics': 'थेट आकडेवारी',
    'nav.clarification_ticket': 'स्पष्टीकरण तिकीट',
    'nav.menu': 'मेनू',
    'nav.logout': 'बाहेर पडा',
    'nav.back_home': 'मुख्यपृष्ठावर परत जा',
    'nav.dashboard': 'डॅशबोर्ड',
    
    'auth.vendor_sso': 'शासकीय विक्रेता एकल साइन-ऑन (SSO)',
    'auth.vendor_signin': 'विक्रेता साइन-इन',
    'auth.login_otp': 'ओटीपी द्वारे लॉगिन',
    'auth.new_registration': 'नवीन नोंदणी',
    'auth.identifier_label': 'GeM विक्रेता आयडी / उद्योग क्रमांक / नोंदणीकृत ईमेल',
    'auth.password_label': 'खाते पासवर्ड',
    'auth.forgot_password': 'पासवर्ड विसरलात?',
    'auth.captcha_label': 'सुरक्षा कॅप्चा पडताळणी',
    'auth.mfa_mandatory': '२-टप्प्यांची ओटीपी सुरक्षा पडताळणी (अनिवार्य)',
    'auth.mfa_enforced': 'अनिवार्य लागू',
    'auth.mfa_desc': 'GFR 2017 आणि GeM 2.0 सुरक्षा नियमांनुसार २-टप्प्यांची पडताळणी अनिवार्य आहे.',
    'auth.btn_direct_login': 'थेट लॉगिन करा आणि डॅशबोर्ड उघडा',
    'auth.authenticating': 'सत्र प्रमाणित करत आहे...',
    'auth.workstation_register': 'हे टर्मिनल सत्यापित व्यावसायिक वर्कस्टेशन म्हणून नोंदवा',
    'auth.already_registered': 'आधीच नोंदणीकृत आहात? लॉगिन करा',
    'auth.new_seller_cta': 'नवीन विक्रेता? नोंदणी करा',
    'auth.otp_modal_title': 'दोन-टप्प्यांची सुरक्षा पडताळणी',
    'auth.otp_sent_notice': 'तुमच्या नोंदणीकृत mobile आणि ईमेलवर ६ अंकी सुरक्षा ओटीपी पाठवला आहे.',
    'auth.otp_helper': 'सुरक्षा ओटीपी कोड:',
    'auth.auto_fill': 'आपोआप भरा',
    'auth.verify_enter': 'ओटीपी तपासा आणि प्रवेश करा',
    'auth.cancel': 'रद्द करा',
    
    'gov_auth.title': 'शासकीय खरेदी अधिकारी सुरक्षित साइन-इन',
    'gov_auth.subtitle': 'अधिकृत अधिकारी आणि निविदा मूल्यमापन समिती गेटवे',
    'gov_auth.badge_label': 'अधिकारी बॅज आयडी / अधिकृत NIC ईमेल',
    'gov_auth.pin_label': 'हार्डवेअर टोकन / CAG सुरक्षा पिन',
    'gov_auth.btn_login': 'सार्वभौम सुरक्षा पडताळा आणि प्रवेश करा',
    
    'common.language': 'भाषा',
    'common.select_language': 'पोर्टल भाषा निवडा',
    'common.search': 'शोधा',
    'common.status': 'स्थिती',
    'common.active': 'सक्रिय',
    'common.pending': 'प्रलंबित',
    'common.verified': 'पडताळणी पूर्ण',
    'common.audit_ledger': 'CAG ऑडिट लेजर',
    'common.sealed_vault': 'डबल-ब्लाइंड सीलबंद व्हॉल्ट',
    'common.compliance_score': 'अनुपालन स्कोअर',
    'common.tenders': 'निविदा',
    'common.proposals': 'बोली / प्रस्ताव',
    'common.live_sync': 'GeM आणि CPPP लाइव्ह सिंक सुरू'
  },
  ta: {
    // Tamil
    'gov.india': 'இந்திய அரசு',
    'gov.ministry': 'வர்த்தகம் மற்றும் தொழில் அமைச்சகம்',
    'gov.portal_title': 'GeM 2.0 இணக்கம் மற்றும் பொது கொள்முதல் போர்டல்',
    'gov.tagline': 'தேசிய பொது கொள்முதல் மற்றும் இறையாண்மை ஒப்பந்த மதிப்பீட்டு தளம்',
    'gov.helpdesk': 'GeM உதவி மையம்',
    'gov.portal_sop': 'போர்டல் வழிகாட்டுதல் (SOP)',
    'gov.sovereign_gateway': 'இறையாண்மை நுழைவாயில் இணைக்கப்பட்டது',
    
    'nav.home': 'முகப்பு',
    'nav.officer_portal': 'கொள்முதல் அதிகாரி போர்டல்',
    'nav.officer_login': 'அதிகாரி உள்நுழைவு',
    'nav.officer_register': 'அதிகாரி பதிவு',
    'nav.vendor_portal': 'விற்பனையாளர் போர்டல்',
    'nav.vendor_login': 'விற்பனையாளர் உள்நுழைவு',
    'nav.vendor_register': 'விற்பனையாளர் பதிவு',
    'nav.operational_arch': 'செயல்பாட்டு கட்டமைப்பு',
    'nav.regulatory_faq': 'விதிமுறைகள் FAQ',
    'nav.initiatives': 'எங்கள் முன்முயற்சிகள்',
    'nav.statistics': 'நேரலை புள்ளிவிவரங்கள்',
    'nav.clarification_ticket': 'விளக்கச்சீட்டு',
    'nav.menu': 'பட்டியல்',
    'nav.logout': 'வெளியேறு',
    'nav.back_home': 'முகப்புக்கு திரும்புக',
    'nav.dashboard': 'டாஷ்போர்டு',
    
    'auth.vendor_sso': 'அரசு விற்பனையாளர் ஒற்றை உள்நுழைவு (SSO)',
    'auth.vendor_signin': 'விற்பனையாளர் உள்நுழைவு',
    'auth.login_otp': 'OTP மூலம் உள்நுழைக',
    'auth.new_registration': 'புதிய பதிவு',
    'auth.identifier_label': 'GeM விற்பனையாளர் ஐடி / உத்யம் எண் / மின்னஞ்சல்',
    'auth.password_label': 'கடவுச்சொல்',
    'auth.forgot_password': 'கடவுச்சொல் மறந்ததா?',
    'auth.captcha_label': 'பாதுகாப்பு கேப்ட்சா சரிபார்ப்பு',
    'auth.mfa_mandatory': '2-படி OTP பாதுகாப்பு சரிபார்ப்பு (கட்டாயம்)',
    'auth.mfa_enforced': 'கட்டாயம்',
    'auth.mfa_desc': 'GFR 2017 & GeM 2.0 விதிகளின்படி 2-படி சரிபார்ப்பு கட்டாயமாக்கப்பட்டுள்ளது.',
    'auth.btn_direct_login': 'உள்நுழைந்து டாஷ்போர்டை அணுகவும்',
    'auth.authenticating': 'அங்கீகரிக்கப்படுகிறது...',
    'auth.workstation_register': 'இந்த சாதனத்தை சரிபார்க்கப்பட்ட பணிநிலையமாக பதிவு செய்க',
    'auth.already_registered': 'ஏற்கனவே பதிவாகியுள்ளதா? உள்நுழைக',
    'auth.new_seller_cta': 'புதிய விற்பனையாளரா? பதிவு செய்க',
    'auth.otp_modal_title': 'இரு-காரணி பாதுகாப்பு சரிபார்ப்பு',
    'auth.otp_sent_notice': 'உங்கள் பதிவு செய்யப்பட்ட மொபைல் மற்றும் மின்னஞ்சலுக்கு 6 இலக்க OTP அனுப்பப்பட்டது.',
    'auth.otp_helper': 'பாதுகாப்பு OTP குறியீடு:',
    'auth.auto_fill': 'தானாக நிரப்புக',
    'auth.verify_enter': 'OTP சரிபார்த்து நுழையவும்',
    'auth.cancel': 'ரத்து செய்',
    
    'gov_auth.title': 'அரசு கொள்முதல் அதிகாரி பாதுகாப்பான உள்நுழைவு',
    'gov_auth.subtitle': 'அங்கீகரிக்கப்பட்ட அதிகாரிகள் & ஒப்பந்த மதிப்பீட்டுக் குழு',
    'gov_auth.badge_label': 'அதிகாரி பேட்ஜ் ஐடி / அதிகாரப்பூர்வ NIC மின்னஞ்சல்',
    'gov_auth.pin_label': 'வன்பொருள் டோக்கன் / CAG பின்',
    'gov_auth.btn_login': 'இறையாண்மை அனுமதியை சரிபார்த்து நுழையவும்',
    
    'common.language': 'மொழி',
    'common.select_language': 'போர்டல் மொழியைத் தேர்ந்தெடுக்கவும்',
    'common.search': 'தேடுக',
    'common.status': 'நிலை',
    'common.active': 'செயலில் உள்ளது',
    'common.pending': 'நிலுவையில் உள்ளது',
    'common.verified': 'சரிபார்க்கப்பட்டது',
    'common.audit_ledger': 'CAG தணிக்கை ஏடு',
    'common.sealed_vault': 'ரகசிய இரட்டை-முத்திரையிட்ட வால்ட்',
    'common.compliance_score': 'இணக்க மதிப்பெண்',
    'common.tenders': 'டெண்டர்கள்',
    'common.proposals': 'ஏலங்கள் / முன்மொழிவுகள்',
    'common.live_sync': 'GeM & CPPP நேரலை ஒத்திசைவு செயலில் உள்ளது'
  },
  te: {
    // Telugu
    'gov.india': 'భారత ప్రభుత్వం',
    'gov.ministry': 'వాణిజ్య & పరిశ్రమల మంత్రిత్వ శాఖ',
    'gov.portal_title': 'GeM 2.0 సమ్మతి & ప్రభుత్వ సేకరణ పోర్టల్',
    'gov.tagline': 'జాతీయ పబ్లిక్ ప్రొక్యూర్మెంట్ & టెండర్ మూల్యాంకన వేదిక',
    'gov.helpdesk': 'GeM హెల్ప్‌డెస్క్',
    'gov.portal_sop': 'పోర్టల్ SOP మార్గదర్శకాలు',
    'gov.sovereign_gateway': 'సార్వభౌమ గేట్‌వే అనుసంధానించబడింది',
    
    'nav.home': 'హోమ్',
    'nav.officer_portal': 'సేకరణ అధికారి పోర్టల్',
    'nav.officer_login': 'అధికారి లాగిన్',
    'nav.officer_register': 'అధికారి నమోదు',
    'nav.vendor_portal': 'విక్రేత (వెండర్) పోర్టల్',
    'nav.vendor_login': 'విక్రేత లాగిన్',
    'nav.vendor_register': 'విక్రేత నమోదు',
    'nav.operational_arch': 'కార్యాచరణ నిర్మాణం',
    'nav.regulatory_faq': 'నిబంధనల FAQ',
    'nav.initiatives': 'మా కార్యక్రమాలు',
    'nav.statistics': 'లైవ్ గణాంకాలు',
    'nav.clarification_ticket': 'స్పష్టీకరణ టిక్కెట్',
    'nav.menu': 'మెనూ',
    'nav.logout': 'లాగౌట్',
    'nav.back_home': 'హోమ్‌కు తిరిగి వెళ్లండి',
    'nav.dashboard': 'డాష్‌బోర్డ్',
    
    'auth.vendor_sso': 'ప్రభుత్వ విక్రేత సింగిల్ సైన్-ఆన్ (SSO)',
    'auth.vendor_signin': 'విక్రేత సైన్ ఇన్',
    'auth.login_otp': 'OTP ద్వారా లాగిన్',
    'auth.new_registration': 'కొత్త నమోదు',
    'auth.identifier_label': 'GeM విక్రేత ID / ఉద్యమ్ సంఖ్య / రిజిస్టర్డ్ ఈమెయిల్',
    'auth.password_label': 'ఖాతా పాస్‌వర్డ్',
    'auth.forgot_password': 'పాస్‌వర్డ్ మర్చిపోయారా?',
    'auth.captcha_label': 'భద్రతా క్యాప్చా ధృవీకరణ',
    'auth.mfa_mandatory': '2-దశల OTP భద్రతా ధృవీకరణ (తప్పనిసరి)',
    'auth.mfa_enforced': 'తప్పనిసరి అమలు',
    'auth.mfa_desc': 'GFR 2017 & GeM 2.0 నిబంధనల ప్రకారం 2-దశల ధృవీకరణ తప్పనిసరి చేయబడింది.',
    'auth.btn_direct_login': 'నేరుగా లాగిన్ అయి డాష్‌బోర్డ్ తెరవండి',
    'auth.authenticating': 'ప్రామాణీకరిస్తోంది...',
    'auth.workstation_register': 'ఈ టెర్మినల్‌ను ధృవీకరించబడిన వర్క్‌స్టేషన్‌గా నమోదు చేయండి',
    'auth.already_registered': 'ఇప్పటికే రిజిస్టర్ అయ్యారా? లాగిన్ అవ్వండి',
    'auth.new_seller_cta': 'కొత్త విక్రేత? నమోదు చేసుకోండి',
    'auth.otp_modal_title': 'ద్వి-కారక భద్రతా ధృవీకరణ',
    'auth.otp_sent_notice': 'మీ రిజిస్టర్డ్ మొబైల్ & ఈమెయిల్‌కు 6-అంకెల భద్రతా OTP పంపబడింది.',
    'auth.otp_helper': 'భద్రతా OTP కోడ్:',
    'auth.auto_fill': 'ఆటో-ఫిల్',
    'auth.verify_enter': 'OTP ధృవీకరించి ప్రవేశించండి',
    'auth.cancel': 'రద్దు చేయి',
    
    'gov_auth.title': 'ప్రభుత్వ సేకరణ అధికారి సురక్షిత లాగిన్',
    'gov_auth.subtitle': 'అధికారిక సిబ్బంది & టెండర్ మూల్యాంకన కమిటీ గేట్‌వే',
    'gov_auth.badge_label': 'అధికారి బ్యాడ్జ్ ID / అధికారిక NIC ఈమెయిల్',
    'gov_auth.pin_label': 'హార్డ్‌వేర్ టోకెన్ / CAG భద్రతా పిన్',
    'gov_auth.btn_login': 'సార్వభౌమ క్లియరెన్స్ ధృవీకరించి ప్రవేశించండి',
    
    'common.language': 'భాష',
    'common.select_language': 'పోర్టల్ భాషను ఎంచుకోండి',
    'common.search': 'శోధించండి',
    'common.status': 'స్థితి',
    'common.active': 'యాక్టివ్',
    'common.pending': 'పెండింగ్',
    'common.verified': 'ధృవీకరించబడింది',
    'common.audit_ledger': 'CAG ఆడిట్ లెడ్జర్',
    'common.sealed_vault': 'డబుల్-బ్లైండ్ సీల్డ్ వాల్ట్',
    'common.compliance_score': 'సమ్మతి స్కోరు',
    'common.tenders': 'టెండర్లు',
    'common.proposals': 'బిడ్లు / ప్రతిపాదనలు',
    'common.live_sync': 'GeM & CPPP లైవ్ సింక్ సక్రియంగా ఉంది'
  },
  bn: {
    // Bengali
    'gov.india': 'ভারত সরকার',
    'gov.ministry': 'বাণিজ্য ও শিল্প মন্ত্রক',
    'gov.portal_title': 'GeM 2.0 সম্মতি ও সরকারি ক্রয় পোর্টাল',
    'gov.tagline': 'জাতীয় পাবলিক প্রকিউরমেন্ট ও সার্বভৌমিক দরপত্র মূল্যায়ন ব্যবস্থা',
    'gov.helpdesk': 'GeM হেল্পডেস্ক',
    'gov.portal_sop': 'পোর্টাল নির্দেশিকা (SOP)',
    'gov.sovereign_gateway': 'সার্বভৌমিক গেটওয়ে সংযুক্ত',
    
    'nav.home': 'হোম',
    'nav.officer_portal': 'ক্রয় আধিকারিক পোর্টাল',
    'nav.officer_login': 'আধিকারিক লগইন',
    'nav.officer_register': 'আধিকারিক নিবন্ধন',
    'nav.vendor_portal': 'বিক্রেতা (ভেন্ডর) পোর্টাল',
    'nav.vendor_login': 'বিক্রেতা লগইন',
    'nav.vendor_register': 'বিক্রেতা নিবন্ধন',
    'nav.operational_arch': 'অপারেশনাল আর্কিটেকচার',
    'nav.regulatory_faq': 'নিয়মাবলী সম্পর্কিত প্রশ্নোত্তর',
    'nav.initiatives': 'আমাদের উদ্যোগসমূহ',
    'nav.statistics': 'লাইভ পরিসংখ্যান',
    'nav.clarification_ticket': 'স্পষ্টীকরণ টিকিট',
    'nav.menu': 'মেনু',
    'nav.logout': 'লগআউট',
    'nav.back_home': 'হোমে ফিরে যান',
    'nav.dashboard': 'ড্যাশবোর্ড',
    
    'auth.vendor_sso': 'সরকারি বিক্রেতা একক সাইন-অন (SSO)',
    'auth.vendor_signin': 'বিক্রেতা সাইন ইন',
    'auth.login_otp': 'ওটিপি (OTP) দিয়ে লগইন',
    'auth.new_registration': 'নতুন নিবন্ধন',
    'auth.identifier_label': 'GeM বিক্রেতা আইডি / উদ্যোগ সংখ্যা / নিবন্ধিত ইমেল',
    'auth.password_label': 'অ্যাকাউন্ট পাসওয়ার্ড',
    'auth.forgot_password': 'পাসওয়ার্ড ভুলে গেছেন?',
    'auth.captcha_label': 'নিরাপত্তা ক্যাপচা যাচাইকরণ',
    'auth.mfa_mandatory': '২-পদক্ষেপ ওটিপি নিরাপত্তা যাচাই (বাধ্যতামূলক)',
    'auth.mfa_enforced': 'বাধ্যতামূলক প্রয়োগ',
    'auth.mfa_desc': 'GFR 2017 এবং GeM 2.0 নিয়ম অনুসারে ২-পদক্ষেপ যাচাই বাধ্যতামূলক।',
    'auth.btn_direct_login': 'সরাসরি লগইন করুন ও ড্যাশবোর্ডে প্রবেশ করুন',
    'auth.authenticating': 'সেশন যাচাই হচ্ছে...',
    'auth.workstation_register': 'এই টার্মিনালটিকে যাচাইকৃত ব্যবসায়িক ওয়ার্কস্টেশন হিসেবে নথিভুক্ত করুন',
    'auth.already_registered': 'ইতিমধ্যে নিবন্ধিত? লগইন করুন',
    'auth.new_seller_cta': 'নতুন বিক্রেতা? নিবন্ধন করুন',
    'auth.otp_modal_title': 'দ্বি-স্তরের নিরাপত্তা যাচাইকরণ',
    'auth.otp_sent_notice': 'আপনার নিবন্ধিত মোবাইল ও ইমেলে একটি ৬-সংখ্যার ওটিপি পাঠানো হয়েছে।',
    'auth.otp_helper': 'নিরাপত্তা ওটিপি কোড:',
    'auth.auto_fill': 'স্বয়ংক্রিয়ভাবে পূরণ করুন',
    'auth.verify_enter': 'ওটিপি যাচাই করে প্রবেশ করুন',
    'auth.cancel': 'বাতিল করুন',
    
    'gov_auth.title': 'সরকারি ক্রয় আধিকারিক সুরক্ষিত সাইন-ইন',
    'gov_auth.subtitle': 'অনুমোদিত আধিকারিক ও দরপত্র মূল্যায়ন কমিটি গেটওয়ে',
    'gov_auth.badge_label': 'আধিকারিক ব্যাজ আইডি / প্রাতিষ্ঠানিক NIC ইমেল',
    'gov_auth.pin_label': 'হার্ডওয়্যার টোকেন / CAG পিন',
    'gov_auth.btn_login': 'সার্বভৌমিক অনুমতি যাচাই করে প্রবেশ করুন',
    
    'common.language': 'ভাষা',
    'common.select_language': 'পোর্টালের ভাষা নির্বাচন করুন',
    'common.search': 'অনুসন্ধান',
    'common.status': 'স্থিতি',
    'common.active': 'সক্রিয়',
    'common.pending': 'বিচারাধীন',
    'common.verified': 'যাচাইকৃত',
    'common.audit_ledger': 'CAG অডিট লেজার',
    'common.sealed_vault': 'ডাবল-ব্লাইন্ড সিলযুক্ত ভল্ট',
    'common.compliance_score': 'সম্মতি স্কোর',
    'common.tenders': 'দরপত্র (টেন্ডার)',
    'common.proposals': 'দরপ্রস্তাব / বিড',
    'common.live_sync': 'GeM এবং CPPP লাইভ সিঙ্ক সক্রিয়'
  },
  gu: {
    // Gujarati
    'gov.india': 'ભારત સરકાર',
    'gov.ministry': 'વાણિજ્ય અને ઉદ્યોગ મંત્રાલય',
    'gov.portal_title': 'GeM 2.0 અનુપાલન અને જાહેર ખરીદી પોર્ટલ',
    'gov.tagline': 'રાષ્ટ્રીય જાહેર ખરીદી અને સાર્વભૌમ ટેન્ડર મૂલ્યાંકન એન્જિન',
    'gov.helpdesk': 'GeM સહાયતા કેન્દ્ર',
    'gov.portal_sop': 'પોર્ટલ માનક સંચાલન પ્રક્રિયા (SOP)',
    'gov.sovereign_gateway': 'સાર્વભૌમ સરકારી ગેટવે કનેક્ટેડ',
    
    'nav.home': 'હોમ',
    'nav.officer_portal': 'ખરીદી અધિકારી પોર્ટલ',
    'nav.officer_login': 'અધિકારી લૉગિન',
    'nav.officer_register': 'અધિકારી નોંધણી',
    'nav.vendor_portal': 'વિક્રેતા (વેન્ડર) પોર્ટલ',
    'nav.vendor_login': 'વિક્રેતા લૉગિન',
    'nav.vendor_register': 'વિક્રેતા નોંધણી',
    'nav.operational_arch': 'ઓપરેશનલ આર્કિટેક્ચર',
    'nav.regulatory_faq': 'નિયમનકારી પ્રશ્નોત્તરી (FAQ)',
    'nav.initiatives': 'અમારી પહેલ',
    'nav.statistics': 'લાઈવ આંકડા',
    'nav.clarification_ticket': 'સ્પષ્ટીકરણ ટિકિટ',
    'nav.menu': 'મેનૂ',
    'nav.logout': 'લૉગઆઉટ',
    'nav.back_home': 'મુખ્ય પૃષ્ઠ પર પાછા જાઓ',
    'nav.dashboard': 'ડૅશબોર્ડ',
    
    'auth.vendor_sso': 'સરકારી વિક્રેતા સિંગલ સાઇન-ઑન (SSO)',
    'auth.vendor_signin': 'વિક્રેતા સાઇન-ઇન',
    'auth.login_otp': 'OTP દ્વારા લૉગિન',
    'auth.new_registration': 'નવી નોંધણી',
    'auth.identifier_label': 'GeM વિક્રેતા ID / ઉદ્યમ નંબર / નોંધાયેલ ઇમેઇલ',
    'auth.password_label': 'ખાતાનો પાસવર્ડ',
    'auth.forgot_password': 'પાસવર્ડ ભૂલી ગયા છો?',
    'auth.captcha_label': 'સુરક્ષા કૅપ્ચા ચકાસણી',
    'auth.mfa_mandatory': '૨-પગલાંની OTP સુરક્ષા ચકાસણી (ફરજિયાત)',
    'auth.mfa_enforced': 'ફરજિયાત લાગુ',
    'auth.mfa_desc': 'GFR 2017 અને GeM 2.0 સુરક્ષા નિયમો હેઠળ ૨-પગલાંની ચકાસણી ફરજિયાત છે.',
    'auth.btn_direct_login': 'સીધા લૉગિન કરો અને ડૅશબોર્ડ ઍક્સેસ કરો',
    'auth.authenticating': 'સત્ર પ્રમાણિત થઈ રહ્યું છે...',
    'auth.workstation_register': 'આ ટર્મિનલને ચકાસાયેલ બિઝનેસ વર્કસ્ટેશન તરીકે નોંધો',
    'auth.already_registered': 'પહેલેથી નોંધાયેલા છો? લૉગિન કરો',
    'auth.new_seller_cta': 'નવા વિક્રેતા? નોંધણી કરો',
    'auth.otp_modal_title': 'દ્વિ-પરિબળ સુરક્ષા ચકાસણી',
    'auth.otp_sent_notice': 'તમારા નોંધાયેલ મોબાઇલ અને ઇમેઇલ પર ૬ અંકનો સુરક્ષા OTP મોકલવામાં આવ્યો છે.',
    'auth.otp_helper': 'સુરક્ષા OTP કોડ:',
    'auth.auto_fill': 'ઓટો-ફિલ',
    'auth.verify_enter': 'OTP ચકાસો અને પ્રવેશ કરો',
    'auth.cancel': 'રદ કરો',
    
    'gov_auth.title': 'સરકારી ખરીદી અધિકારી સુરક્ષિત સાઇન-ઇન',
    'gov_auth.subtitle': 'અધિકૃત અધિકારી અને ટેન્ડર મૂલ્યાંકન સમિતિ ગેટવે',
    'gov_auth.badge_label': 'અધિકારી બૅજ ID / સત્તાવાર NIC ઇમેઇલ',
    'gov_auth.pin_label': 'હાર્ડવેર ટોકન / CAG સુરક્ષા પિન',
    'gov_auth.btn_login': 'સાર્વભૌમ સુરક્ષા ચકાસો અને પ્રવેશ કરો',
    
    'common.language': 'ભાષા',
    'common.select_language': 'પોર્ટલ ભાષા પસંદ કરો',
    'common.search': 'શોધો',
    'common.status': 'સ્થિતિ',
    'common.active': 'સક્રિય',
    'common.pending': 'બાકી',
    'common.verified': 'ચકાસાયેલ',
    'common.audit_ledger': 'CAG ઑડિટ લેજર',
    'common.sealed_vault': 'ડબલ-બ્લાઈન્ડ સીલબંધ વૉલ્ટ',
    'common.compliance_score': 'અનુપાલન સ્કોર',
    'common.tenders': 'ટેન્ડરો',
    'common.proposals': 'બિડ / દરખાસ્તો',
    'common.live_sync': 'GeM અને CPPP લાઇવ સિંક સક્રિય'
  },
  kn: {
    // Kannada
    'gov.india': 'ಭಾರತ ಸರ್ಕಾರ',
    'gov.ministry': 'ವಾಣಿಜ್ಯ ಮತ್ತು ಕೈಗಾರಿಕಾ ಸಚಿವಾಲಯ',
    'gov.portal_title': 'GeM 2.0 ಅನುಸರಣೆ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಸಂಗ್ರಹಣೆ ಪೋರ್ಟಲ್',
    'gov.tagline': 'ರಾಷ್ಟ್ರೀಯ ಸಾರ್ವಜನಿಕ ಸಂಗ್ರಹಣೆ ಮತ್ತು ಸಾರ್ವಭೌಮ ಟೆಂಡರ್ ಮೌಲ್ಯಮಾಪನ ವ್ಯವಸ್ಥೆ',
    'gov.helpdesk': 'GeM ಸಹಾಯವಾಣಿ',
    'gov.portal_sop': 'ಪೋರ್ಟಲ್ ಕಾರ್ಯವಿಧಾನ (SOP)',
    'gov.sovereign_gateway': 'ಸಾರ್ವಭೌಮ ಗೇಟ್‌ವೇ ಸಂಪರ್ಕಗೊಂಡಿದೆ',
    
    'nav.home': 'ಮುಖಪುಟ',
    'nav.officer_portal': 'ಖರೀದಿ ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್',
    'nav.officer_login': 'ಅಧಿಕಾರಿ ಲಾಗಿನ್',
    'nav.officer_register': 'ಅಧಿಕಾರಿ ನೋಂದಣಿ',
    'nav.vendor_portal': 'ಮಾರಾಟಗಾರರ (ವೆಂಡರ್) ಪೋರ್ಟಲ್',
    'nav.vendor_login': 'ಮಾರಾಟಗಾರರ ಲಾಗಿನ್',
    'nav.vendor_register': 'ಮಾರಾಟಗಾರರ ನೋಂದಣಿ',
    'nav.operational_arch': 'ಕಾರ್ಯಾಚರಣೆಯ ವಾಸ್ತುಶಿಲ್ಪ',
    'nav.regulatory_faq': 'ನಿಯಂತ್ರಕ FAQ',
    'nav.initiatives': 'ನಮ್ಮ ಉಪಕ್ರಮಗಳು',
    'nav.statistics': 'ಲೈವ್ ಅಂಕಿಅಂಶಗಳು',
    'nav.clarification_ticket': 'ಸ್ಪಷ್ಟೀಕರಣ ಟಿಕೆಟ್',
    'nav.menu': 'ಮೆನು',
    'nav.logout': 'ಸೈನ್ ಔಟ್',
    'nav.back_home': 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    'nav.dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    
    'auth.vendor_sso': 'ಸರ್ಕಾರಿ ಮಾರಾಟಗಾರರ ಸಿಂಗಲ್ ಸೈನ್-ಆನ್ (SSO)',
    'auth.vendor_signin': 'ಮಾರಾಟಗಾರರ ಸೈನ್-ಇನ್',
    'auth.login_otp': 'OTP ಮೂಲಕ ಲಾಗಿನ್',
    'auth.new_registration': 'ಹೊಸ ನೋಂದಣಿ',
    'auth.identifier_label': 'GeM ಮಾರಾಟಗಾರರ ID / ಉದ್ಯಮ ಸಂಖ್ಯೆ / ನೋಂದಾಯಿತ ಇಮೇಲ್',
    'auth.password_label': 'ಖಾತೆ ಪಾಸ್‌ವರ್ಡ್',
    'auth.forgot_password': 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?',
    'auth.captcha_label': 'ಭದ್ರತಾ ಕ್ಯಾಪ್ಚಾ ಪರಿಶೀಲನೆ',
    'auth.mfa_mandatory': '2-ಹಂತದ OTP ಭದ್ರತಾ ಪರಿಶೀಲನೆ (ಕಡ್ಡಾಯ)',
    'auth.mfa_enforced': 'ಕಡ್ಡಾಯವಾಗಿ ಜಾರಿಯಲ್ಲಿದೆ',
    'auth.mfa_desc': 'GFR 2017 ಮತ್ತು GeM 2.0 ನಿಯಮಗಳ ಪ್ರಕಾರ 2-ಹಂತದ ಪರಿಶೀಲನೆ ಕಡ್ಡಾಯವಾಗಿದೆ.',
    'auth.btn_direct_login': 'ನೇರವಾಗಿ ಲಾಗಿನ್ ಆಗಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಪ್ರವೇಶಿಸಿ',
    'auth.authenticating': 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    'auth.workstation_register': 'ಈ ಟರ್ಮಿನಲ್ ಅನ್ನು ಪರಿಶೀಲಿಸಿದ ವ್ಯಾಪಾರ ವರ್ಕ್‌ಸ್ಟೇಷನ್ ಆಗಿ ನೋಂದಾಯಿಸಿ',
    'auth.already_registered': 'ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಲಾಗಿದೆಯೇ? ಲಾಗಿನ್ ಮಾಡಿ',
    'auth.new_seller_cta': 'ಹೊಸ ಮಾರಾಟಗಾರರೇ? ನೋಂದಾಯಿಸಿ',
    'auth.otp_modal_title': 'ದ್ವಿ-ಅಂಶ ಭದ್ರತಾ ಪರಿಶೀಲನೆ',
    'auth.otp_sent_notice': 'ನಿಮ್ಮ ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಮತ್ತು ಇಮೇಲ್‌ಗೆ 6-ಅಂಕಿಯ ಭದ್ರತಾ OTP ಕಳುಹಿಸಲಾಗಿದೆ.',
    'auth.otp_helper': 'ಭದ್ರತಾ OTP ಕೋಡ್:',
    'auth.auto_fill': 'ಸ್ವಯಂ ಭರ್ತಿ',
    'auth.verify_enter': 'OTP ಪರಿಶೀಲಿಸಿ ಪ್ರವೇಶಿಸಿ',
    'auth.cancel': 'ರದ್ದುಮಾಡಿ',
    
    'gov_auth.title': 'ಸರ್ಕಾರಿ ಖರೀದಿ ಅಧಿಕಾರಿ ಸುರಕ್ಷಿತ ಸೈನ್-ಇನ್',
    'gov_auth.subtitle': 'ಅಧಿಕೃತ ಸಿಬ್ಬಂದಿ ಮತ್ತು ಟೆಂಡರ್ ಮೌಲ್ಯಮಾಪನ ಸಮಿತಿ ಗೇಟ್‌ವೇ',
    'gov_auth.badge_label': 'ಅಧಿಕಾರಿ ಬ್ಯಾಡ್ಜ್ ID / ಅಧಿಕೃತ NIC ಇಮೇಲ್',
    'gov_auth.pin_label': 'ಹಾರ್ಡ್‌ವೇರ್ ಟೋಕನ್ / CAG ಪಿನ್',
    'gov_auth.btn_login': 'ಸಾರ್ವಭೌಮ ಅನುಮತಿ ಪರಿಶೀಲಿಸಿ ಪ್ರವೇಶಿಸಿ',
    
    'common.language': 'ಭಾಷೆ',
    'common.select_language': 'ಪೋರ್ಟಲ್ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    'common.search': 'ಹುಡುಕಿ',
    'common.status': 'ಸ್ಥಿತಿ',
    'common.active': 'ಸಕ್ರಿಯ',
    'common.pending': 'ಬಾಕಿ ಉಳಿದಿದೆ',
    'common.verified': 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    'common.audit_ledger': 'CAG ಆಡಿಟ್ ಲೆಡ್ಜರ್',
    'common.sealed_vault': 'ಡಬಲ್-ಬ್ಲೈಂಡ್ ಸೀಲ್ಡ್ ವಾಲ್ಟ್',
    'common.compliance_score': 'ಅನುಸರಣೆ ಅಂಕ',
    'common.tenders': 'ಟೆಂಡರ್‌ಗಳು',
    'common.proposals': 'ಬಿಡ್‌ಗಳು / ಪ್ರಸ್ತಾವನೆಗಳು',
    'common.live_sync': 'GeM ಮತ್ತು CPPP ಲೈವ್ ಸಿಂಕ್ ಸಕ್ರಿಯವಾಗಿದೆ'
  },
  ml: {
    // Malayalam
    'gov.india': 'ഭാരത സർക്കാർ',
    'gov.ministry': 'വാണിജ്യ വ്യവസായ മന്ത്രാലയം',
    'gov.portal_title': 'GeM 2.0 കംപ്ലയൻസ് & പബ്ലിക് പ്രൊക്യുർമെന്റ് പോർട്ടൽ',
    'gov.tagline': 'ദേശീയ പൊതു സംഭരണവും പരമാധികാര ടെൻഡർ മൂല്യനിർണ്ണയ സംവിധാനവും',
    'gov.helpdesk': 'GeM ഹെൽപ്പ്‌ഡെസ്ക്',
    'gov.portal_sop': 'പോർട്ടൽ മാർഗ്ഗനിർദ്ദേശം (SOP)',
    'gov.sovereign_gateway': 'പരമാധികാര ഗേറ്റ്‌വേ ബന്ധിപ്പിച്ചു',
    
    'nav.home': 'ഹോം',
    'nav.officer_portal': 'സംഭരണ ഉദ്യോഗസ്ഥ പോർട്ടൽ',
    'nav.officer_login': 'ഓഫീസർ ലോഗിൻ',
    'nav.officer_register': 'ഓഫീസർ രജിസ്ട്രേഷൻ',
    'nav.vendor_portal': 'വെണ്ടർ പോർട്ടൽ',
    'nav.vendor_login': 'വെണ്ടർ ലോഗിൻ',
    'nav.vendor_register': 'വെണ്ടർ രജിസ്ട്രേഷൻ',
    'nav.operational_arch': 'പ്രവർത്തന ഘടന',
    'nav.regulatory_faq': 'നിയമപരമായ സംശയങ്ങൾ (FAQ)',
    'nav.initiatives': 'ഞങ്ങളുടെ സംരംഭങ്ങൾ',
    'nav.statistics': 'തത്സമയ സ്ഥിതിവിവരക്കണക്കുകൾ',
    'nav.clarification_ticket': 'വ്യക്തത ടിക്കറ്റ്',
    'nav.menu': 'മെനു',
    'nav.logout': 'പുറത്തുകടക്കുക',
    'nav.back_home': 'ഹോമിലേക്ക് മടങ്ങുക',
    'nav.dashboard': 'ഡാഷ്‌ബോർഡ്',
    
    'auth.vendor_sso': 'ഗവൺമെന്റ് വെണ്ടർ സിംഗിൾ സൈൻ-ഓൺ (SSO)',
    'auth.vendor_signin': 'വെണ്ടർ സൈൻ-ഇൻ',
    'auth.login_otp': 'OTP വഴി ലോഗിൻ ചെയ്യുക',
    'auth.new_registration': 'പുതിയ രജിസ്ട്രേഷൻ',
    'auth.identifier_label': 'GeM വെണ്ടർ ID / ഉദ്യം നമ്പർ / ഇമെയിൽ',
    'auth.password_label': 'അക്കൗണ്ട് പാസ്‌വേഡ്',
    'auth.forgot_password': 'പാസ്‌വേഡ് മറന്നോ?',
    'auth.captcha_label': 'സുരക്ഷാ ക്യാപ്ച പരിശോധന',
    'auth.mfa_mandatory': '2-ഘട്ട OTP സുരക്ഷാ പരിശോധന (നിർബന്ധം)',
    'auth.mfa_enforced': 'നിർബന്ധമാക്കി',
    'auth.mfa_desc': 'GFR 2017 & GeM 2.0 നിയമങ്ങൾ പ്രകാരം 2-ഘട്ട പരിശോധന നിർബന്ധമാക്കിയിരിക്കുന്നു.',
    'auth.btn_direct_login': 'നേരിട്ട് ലോഗിൻ ചെയ്ത് ഡാഷ്‌ബോർഡ് തുറക്കുക',
    'auth.authenticating': 'സ്ഥിരീകരിക്കുന്നു...',
    'auth.workstation_register': 'ഈ ടെർമിനൽ പരിശോധിച്ച ബിസിനസ്സ് വർക്ക്സ്റ്റേഷനായി രജിസ്റ്റർ ചെയ്യുക',
    'auth.already_registered': 'നേരത്തെ രജിസ്റ്റർ ചെയ്തിട്ടുണ്ടോ? ലോഗിൻ ചെയ്യുക',
    'auth.new_seller_cta': 'പുതിയ വെണ്ടർ ആണോ? രജിസ്റ്റർ ചെയ്യുക',
    'auth.otp_modal_title': 'ദ്വിമുഖ സുരക്ഷാ പരിശോധന',
    'auth.otp_sent_notice': 'നിങ്ങളുടെ രജിസ്റ്റർ ചെയ്ത മൊബൈലിലേക്കും ഇമെയിലിലേക്കും 6 അക്ക OTP അയച്ചു.',
    'auth.otp_helper': 'സുരക്ഷാ OTP കോഡ്:',
    'auth.auto_fill': 'ഓട്ടോ-ഫിൽ',
    'auth.verify_enter': 'OTP പരിശോധിച്ച് പ്രവേശിക്കുക',
    'auth.cancel': 'റദ്ദാക്കുക',
    
    'gov_auth.title': 'ഗവൺമെന്റ് സംഭരണ ഉദ്യോഗസ്ഥ സുരക്ഷിത ലോഗിൻ',
    'gov_auth.subtitle': 'അംഗീകൃത ഉദ്യോഗസ്ഥ ടെൻഡർ മൂല്യനിർണ്ണയ സമിതി ഗേറ്റ്‌വേ',
    'gov_auth.badge_label': 'ഓഫീസർ ബാഡ്ജ് ID / ഔദ്യോഗിക NIC ഇമെയിൽ',
    'gov_auth.pin_label': 'ഹാർഡ്‌വെയർ ടോക്കൺ / CAG സുരക്ഷാ പിൻ',
    'gov_auth.btn_login': 'സുരക്ഷാ അനുമതി പരിശോധിച്ച് പ്രവേശിക്കുക',
    
    'common.language': 'ഭാഷ',
    'common.select_language': 'പോർട്ടൽ ഭാഷ തിരഞ്ഞെടുക്കുക',
    'common.search': 'തിരയുക',
    'common.status': 'നില',
    'common.active': 'സജീവം',
    'common.pending': 'തീർച്ചപ്പെടുത്തിയിട്ടില്ല',
    'common.verified': 'സ്ഥിരീകരിച്ചു',
    'common.audit_ledger': 'CAG ഓഡിറ്റ് ലെഡ്ജർ',
    'common.sealed_vault': 'ഡബിൾ-ബ്ലൈണ്ട് സീൽഡ് വോൾട്ട്',
    'common.compliance_score': 'കംപ്ലയൻസ് സ്കോർ',
    'common.tenders': 'ടെൻഡറുകൾ',
    'common.proposals': 'ലേലങ്ങൾ / നിർദ്ദേശങ്ങൾ',
    'common.live_sync': 'GeM & CPPP തത്സമയ സിങ്ക് സജീവം'
  },
  pa: {
    // Punjabi
    'gov.india': 'ਭਾਰਤ ਸਰਕਾਰ',
    'gov.ministry': 'ਵਣਜ ਅਤੇ ਉਦਯੋਗ ਮੰਤਰਾਲਾ',
    'gov.portal_title': 'GeM 2.0 ਪਾਲਣਾ ਅਤੇ ਸਰਕਾਰੀ ਖਰੀਦ ਪੋਰਟਲ',
    'gov.tagline': 'ਰਾਸ਼ਟਰੀ ਜਨਤਕ ਖਰੀਦ ਅਤੇ ਨਿਰਪੱਖ ਟੈਂਡਰ ਮੁਲਾਂਕਣ ਪ੍ਰਣਾਲੀ',
    'gov.helpdesk': 'GeM ਹੈਲਪਡੈਸਕ',
    'gov.portal_sop': 'ਪੋਰਟਲ ਕਾਰਜ ਪ੍ਰਣਾਲੀ (SOP)',
    'gov.sovereign_gateway': 'ਸਰਕਾਰੀ ਗੇਟਵੇ ਜੁੜਿਆ ਹੋਇਆ ਹੈ',
    
    'nav.home': 'ਮੁੱਖ ਪੰਨਾ',
    'nav.officer_portal': 'ਖਰੀਦ ਅਧਿਕਾਰੀ ਪੋਰਟਲ',
    'nav.officer_login': 'ਅਧਿਕਾਰੀ ਲੌਗਇਨ',
    'nav.officer_register': 'ਅਧਿਕਾਰੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ',
    'nav.vendor_portal': 'ਵਿਕਰੇਤਾ (ਵੈਂਡਰ) ਪੋਰਟਲ',
    'nav.vendor_login': 'ਵਿਕਰੇਤਾ ਲੌਗਇਨ',
    'nav.vendor_register': 'ਵਿਕਰੇਤਾ ਰਜਿਸਟ੍ਰੇਸ਼ਨ',
    'nav.operational_arch': 'ਸੰਚਾਲਨ ਢਾਂਚਾ',
    'nav.regulatory_faq': 'ਨਿਯਮਿਤ ਸਵਾਲ-ਜਵਾਬ (FAQ)',
    'nav.initiatives': 'ਸਾਡੀਆਂ ਪਹਿਲਕਦਮੀਆਂ',
    'nav.statistics': 'ਲਾਈਵ ਅੰਕੜੇ',
    'nav.clarification_ticket': 'ਸਪੱਸ਼ਟੀਕਰਨ ਟਿਕਟ',
    'nav.menu': 'ਮੀਨੂ',
    'nav.logout': 'ਬਾਹਰ ਜਾਓ',
    'nav.back_home': 'ਮੁੱਖ ਪੰਨੇ ਤੇ ਵਾਪਸ ਜਾਓ',
    'nav.dashboard': 'ਡੈਸ਼ਬੋਰਡ',
    
    'auth.vendor_sso': 'ਸਰਕਾਰੀ ਵਿਕਰੇਤਾ ਸਿੰਗਲ ਸਾਈਨ-ਆਨ (SSO)',
    'auth.vendor_signin': 'ਵਿਕਰੇਤਾ ਸਾਈਨ-ਇਨ',
    'auth.login_otp': 'OTP ਰਾਹੀਂ ਲੌਗਇਨ',
    'auth.new_registration': 'ਨਵੀਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ',
    'auth.identifier_label': 'GeM ਵਿਕਰੇਤਾ ID / ਉਦਯਮ ਨੰਬਰ / ਰਜਿਸਟਰਡ ਈਮੇਲ',
    'auth.password_label': 'ਖਾਤਾ ਪਾਸਵਰਡ',
    'auth.forgot_password': 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?',
    'auth.captcha_label': 'ਸੁਰੱਖਿਆ ਕੈਪਚਾ ਤਸਦੀਕ',
    'auth.mfa_mandatory': '2-ਪੜਾਵੀ OTP ਸੁਰੱਖਿਆ ਤਸਦੀਕ (ਲਾਜ਼ਮੀ)',
    'auth.mfa_enforced': 'ਲਾਜ਼ਮੀ ਲਾਗੂ',
    'auth.mfa_desc': 'GFR 2017 ਅਤੇ GeM 2.0 ਨਿਯਮਾਂ ਤਹਿਤ 2-ਪੜਾਵੀ ਸੁਰੱਖਿਆ ਲਾਜ਼ਮੀ ਕੀਤੀ ਗਈ ਹੈ।',
    'auth.btn_direct_login': 'ਸਿੱਧਾ ਲੌਗਇਨ ਕਰੋ ਅਤੇ ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹੋ',
    'auth.authenticating': 'ਪ੍ਰਮਾਣਿਤ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...',
    'auth.workstation_register': 'ਇਸ ਟਰਮੀਨਲ ਨੂੰ ਪ੍ਰਮਾਣਿਤ ਵਪਾਰਕ ਵਰਕਸਟੇਸ਼ਨ ਵਜੋਂ ਰਜਿਸਟਰ ਕਰੋ',
    'auth.already_registered': 'ਪਹਿਲਾਂ ਹੀ ਰਜਿਸਟਰਡ ਹੋ? ਲੌਗਇਨ ਕਰੋ',
    'auth.new_seller_cta': 'ਨਵੇਂ ਵਿਕਰੇਤਾ? ਰਜਿਸਟਰ ਕਰੋ',
    'auth.otp_modal_title': 'ਦੋ-ਪੜਾਵੀ ਸੁਰੱਖਿਆ ਪ੍ਰਮਾਣੀਕਰਨ',
    'auth.otp_sent_notice': 'ਤੁਹਾਡੇ ਰਜਿਸਟਰਡ ਮੋਬਾਈਲ ਅਤੇ ਈਮੇਲ ਤੇ 6-ਅੰਕਾਂ ਦਾ ਸੁਰੱਖਿਆ OTP ਭੇਜਿਆ ਗਿਆ ਹੈ।',
    'auth.otp_helper': 'ਸੁਰੱਖਿਆ OTP ਕੋਡ:',
    'auth.auto_fill': 'ਆਟੋ-ਭਰੋ',
    'auth.verify_enter': 'OTP ਤਸਦੀਕ ਕਰੋ ਅਤੇ ਦਾਖਲ ਹੋਵੋ',
    'auth.cancel': 'ਰੱਦ ਕਰੋ',
    
    'gov_auth.title': 'ਸਰਕਾਰੀ ਖਰੀਦ ਅਧਿਕਾਰੀ ਸੁਰੱਖਿਅਤ ਸਾਈਨ-ਇਨ',
    'gov_auth.subtitle': 'ਅਧਿਕਾਰਤ ਅਮਲਾ ਅਤੇ ਟੈਂਡਰ ਮੁਲਾਂਕਣ ਕਮੇਟੀ ਗੇਟਵੇ',
    'gov_auth.badge_label': 'ਅਧਿਕਾਰੀ ਬੈਜ ID / ਅਧਿਕਾਰਤ NIC ਈਮੇਲ',
    'gov_auth.pin_label': 'ਹਾਰਡਵੇਅਰ ਟੋਕਨ / CAG ਸੁਰੱਖਿਆ ਪਿੰਨ',
    'gov_auth.btn_login': 'ਸੁਰੱਖਿਆ ਮਨਜ਼ੂਰੀ ਤਸਦੀਕ ਕਰੋ ਅਤੇ ਦਾਖਲ ਹੋਵੋ',
    
    'common.language': 'ਭਾਸ਼ਾ',
    'common.select_language': 'ਪੋਰਟਲ ਭਾਸ਼ਾ ਚੁਣੋ',
    'common.search': 'ਖੋਜੋ',
    'common.status': 'ਸਥਿਤੀ',
    'common.active': 'ਸਰਗਰਮ',
    'common.pending': 'ਬਕਾਇਆ',
    'common.verified': 'ਪ੍ਰਮਾਣਿਤ',
    'common.audit_ledger': 'CAG ਆਡਿਟ ਲੇਜ਼ਰ',
    'common.sealed_vault': 'ਡਬਲ-ਬਲਾਇੰਡ ਸੀਲਬੰਦ ਵਾਲਟ',
    'common.compliance_score': 'ਪਾਲਣਾ ਸਕੋਰ',
    'common.tenders': 'ਟੈਂਡਰ',
    'common.proposals': 'ਬੋਲੀਆਂ / ਤਜਵੀਜ਼ਾਂ',
    'common.live_sync': 'GeM ਅਤੇ CPPP ਲਾਈਵ ਸਿੰਕ ਸਰਗਰਮ ਹੈ'
  }
};

export const ENGLISH_PHRASE_TO_KEY: Record<string, string> = {
  'Home': 'nav.home',
  'Procurement Officer Portal': 'nav.officer_portal',
  'Officer Login': 'nav.officer_login',
  'Officer Registration': 'nav.officer_register',
  'Vendor Portal': 'nav.vendor_portal',
  'Vendor Login': 'nav.vendor_login',
  'Vendor Registration': 'nav.vendor_register',
  'Operational Architecture': 'nav.operational_arch',
  'Regulatory FAQ Dossier': 'nav.regulatory_faq',
  'Our Initiatives': 'nav.initiatives',
  'Portals Gateway': 'nav.portals_gateway',
  'Live Statistics': 'nav.statistics',
  'Statistics': 'nav.statistics',
  'Clarification Ticket': 'nav.clarification_ticket',
  'Menu': 'nav.menu',
  'Sign Out': 'nav.logout',
  'Government of India': 'gov.india',
  'Ministry of Commerce & Industry': 'gov.ministry',
  'GeM 2.0 Compliance & Procurement Portal': 'gov.portal_title',
  'GEM 2.0 COMPLIANCE PORTAL': 'gov.portal_title',
  'National Public Procurement & Sovereign Bid Evaluation Engine': 'gov.tagline',
  'Automated Bidder Compliance & Verification Suite': 'gov.tagline',
  'GeM Helpdesk': 'gov.helpdesk',
  'Portal SOP': 'gov.portal_sop',
  'Status': 'common.status',
  'Active': 'common.active',
  'Pending': 'common.pending',
  'Verified': 'common.verified',
  'CAG Audit Ledger': 'common.audit_ledger',
  'Double-Blind Vault': 'common.sealed_vault',
  'Compliance Score': 'common.compliance_score',
  'Tenders': 'common.tenders',
  'Bids / Proposals': 'common.proposals',
  'Language': 'common.language',
  'Search': 'common.search',
};

import { 
  walkAndTranslateDom, 
  triggerGoogleTranslate, 
  getVocabTranslation 
} from './sovereignTranslations';

// Sovereign Full-DOM Translation Bridge: triggers immediate DOM text replacement and Google Translate
export function applyFullPageTranslation(lang: LanguageCode) {
  if (typeof window === 'undefined') return;
  try {
    // 1. Instant local DOM text node transformation
    walkAndTranslateDom(lang);

    // 2. Google Translate external bridge
    if (!triggerGoogleTranslate(lang)) {
      let count = 0;
      const timer = setInterval(() => {
        count++;
        if (triggerGoogleTranslate(lang) || count > 40) {
          clearInterval(timer);
        }
      }, 100);
    }
  } catch (err) {
    console.error('Translation bridge error:', err);
  }
}

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  currentLanguage: LanguageOption;
  languages: LanguageOption[];
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('gem_portal_language') as LanguageCode;
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
    } catch (e) {}
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('gem_portal_language', lang);
      document.documentElement.lang = lang;
      applyFullPageTranslation(lang);
    } catch (e) {}
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
      applyFullPageTranslation(language);
    } catch (e) {}
  }, [language]);

  const currentLanguage = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const t = (keyOrPhrase: string, fallback?: string): string => {
    const resolvedKey = ENGLISH_PHRASE_TO_KEY[keyOrPhrase] || keyOrPhrase;
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[resolvedKey]) {
      return langDict[resolvedKey];
    }
    // Check rich sovereign vocabulary
    const vocabTrans = getVocabTranslation(keyOrPhrase, language);
    if (vocabTrans) {
      return vocabTrans;
    }
    // Fallback to English dictionary
    if (TRANSLATIONS.en && TRANSLATIONS.en[resolvedKey]) {
      return TRANSLATIONS.en[resolvedKey];
    }
    return fallback || keyOrPhrase;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      currentLanguage,
      languages: SUPPORTED_LANGUAGES,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'en',
      setLanguage: () => {},
      currentLanguage: SUPPORTED_LANGUAGES[0],
      languages: SUPPORTED_LANGUAGES,
      t: (k, fallback) => fallback || k
    };
  }
  return context;
};

