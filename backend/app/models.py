from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime

# Auth Models
class UserRegisterRequest(BaseModel):
    email: str
    password: str = Field(min_length=6)
    full_name: str
    vendor_name: str
    role: Literal["OEM_SELLER", "MSME_STARTUP", "WORKS_CONTRACTOR"]
    gstin: str
    pan: str
    turnover_cr: Optional[float] = 5.0
    experience_years: Optional[int] = 3
    brand_name: Optional[str] = ""
    udyam_number: Optional[str] = ""
    dpiit_registered: Optional[bool] = False
    contractor_class: Optional[str] = ""
    mii_percentage: Optional[int] = 75
    contact_phone: Optional[str] = ""
    profile_photo_url: Optional[str] = ""
    authorized_signatory: Optional[str] = ""
    address: Optional[str] = ""
    state: Optional[str] = "Delhi"
    pincode: Optional[str] = ""
    bank_name: Optional[str] = ""
    bank_account: Optional[str] = ""
    ifsc_code: Optional[str] = ""

class GovOfficerRegisterRequest(BaseModel):
    full_name: str
    designation: str
    ministry: str
    department: str
    email: str
    password: str = Field(min_length=6)
    badge_id: Optional[str] = ""
    phone: Optional[str] = ""
    clearance_level: Optional[str] = "LEVEL_3_CAG_SIGNER"
    profile_photo_url: Optional[str] = ""
    office_location: Optional[str] = "New Delhi, India"
    cag_pin: Optional[str] = "2026"

class GovOfficerLoginRequest(BaseModel):
    identifier: str # Email or Badge ID
    password: str

class UserLoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    role: str
    full_name: str
    plan_id: str
    vendor_id: Optional[str] = None
    badge_id: Optional[str] = None
    profile_photo_url: Optional[str] = None

class VendorProfileUpdate(BaseModel):
    name: Optional[str] = None
    brandName: Optional[str] = None
    gstin: Optional[str] = None
    pan: Optional[str] = None
    turnoverCr: Optional[float] = None
    experienceYears: Optional[int] = None
    udyamNumber: Optional[str] = None
    dpiitRegistered: Optional[bool] = None
    contractorClass: Optional[str] = None
    miiPercentage: Optional[int] = None
    contactPhone: Optional[str] = None
    profilePhotoUrl: Optional[str] = None
    authorizedSignatory: Optional[str] = None
    address: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    bankName: Optional[str] = None
    bankAccount: Optional[str] = None
    ifscCode: Optional[str] = None

class OfficerProfileUpdate(BaseModel):
    fullName: Optional[str] = None
    designation: Optional[str] = None
    ministry: Optional[str] = None
    department: Optional[str] = None
    phone: Optional[str] = None
    clearanceLevel: Optional[str] = None
    profilePhotoUrl: Optional[str] = None
    officeLocation: Optional[str] = None

# Billing & Sovereign GeM Treasury Payment Models
class CreateOrderRequest(BaseModel):
    plan_id: Literal["STARTER", "PRO"]
    billing_type: Literal["one_time", "recurring_autopay"] = "one_time"
    payment_method: Optional[Literal["GEM_E_WALLET", "CORPORATE_NETBANKING", "TREASURY_TRANSFER", "UPI_CORPORATE"]] = "GEM_E_WALLET"

class CreateOrderResponse(BaseModel):
    order_id: str
    amount_inr: float
    currency: str = "INR"
    plan_id: str
    is_autopay: bool
    gateway_mode: str = "SOVEREIGN_GEM_GATEWAY"
    transaction_ref: str

class VerifyPaymentRequest(BaseModel):
    order_id: str
    payment_id: Optional[str] = None
    payment_signature: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    razorpay_signature: Optional[str] = None
    plan_id: str
    payment_method: Optional[str] = "GEM_E_WALLET"
    is_autopay: bool = False

class PaymentWebhookEvent(BaseModel):
    event: str
    payload: dict

# Quota & Subscription Status
class UserQuotaStatus(BaseModel):
    user_id: str
    plan_id: str
    evaluations_used: int
    evaluations_limit: int
    has_vector_rag: bool
    has_pricing_advisor: bool
    has_pdf_dossier_export: bool
    current_period_end: str
    is_autopay_enabled: bool

# Evaluation Request
class EvaluationRequest(BaseModel):
    tender_id: str
    tender_title: str
    tender_value_cr: float
    document_ids: List[str] = []
