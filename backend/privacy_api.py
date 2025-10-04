"""
FastAPI Backend for Privacy Prediction Service
Serves the trained Random Forest models via REST API
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Union
import pandas as pd
import numpy as np
import joblib
import os
from datetime import datetime
import json
from app_database import app_db

app = FastAPI(
    title="Privacy Prediction API",
    description="ML-powered privacy risk assessment for mobile apps",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:4173", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AppData(BaseModel):
    """App data model for privacy prediction"""
    # Basic app info
    app_name: str = Field(..., description="Name of the app")
    category: str = Field(..., description="App category (e.g., Communication, Social, Games)")
    
    # App characteristics
    free: bool = Field(True, description="Is the app free?")
    has_ads: bool = Field(False, description="Does the app contain ads?")
    has_iap: bool = Field(False, description="Does the app have in-app purchases?")
    is_game: bool = Field(False, description="Is this a game app?")
    is_social: bool = Field(False, description="Is this a social app?")
    
    # Permission counts (0-10 scale)
    perm_location: float = Field(0, ge=0, le=10, description="Location permissions count")
    perm_camera: int = Field(0, ge=0, le=5, description="Camera permissions (0/1)")
    perm_microphone: int = Field(0, ge=0, le=5, description="Microphone permissions (0/1)")
    perm_contacts: float = Field(0, ge=0, le=10, description="Contact permissions count")
    perm_phone: float = Field(0, ge=0, le=10, description="Phone permissions count")
    perm_sms: float = Field(0, ge=0, le=10, description="SMS permissions count")
    perm_storage: float = Field(0, ge=0, le=10, description="Storage permissions count")
    perm_calendar: float = Field(0, ge=0, le=10, description="Calendar permissions count")
    perm_network: float = Field(1, ge=0, le=10, description="Network permissions count")
    perm_device_info: float = Field(0, ge=0, le=10, description="Device info permissions count")
    perm_accounts: int = Field(0, ge=0, le=5, description="Account permissions (0/1)")
    perm_system: float = Field(0, ge=0, le=10, description="System permissions count")
    perm_other: float = Field(0, ge=0, le=50, description="Other permissions count")
    
    # Derived fields (computed)
    total_permissions: Optional[float] = Field(None, description="Total permissions (auto-calculated)")
    permission_density: Optional[float] = Field(None, description="Permission density (auto-calculated)")
    
    # Boolean indicators (derived from permission counts)
    has_location: Optional[bool] = Field(None, description="Has location access (auto-calculated)")
    has_camera: Optional[bool] = Field(None, description="Has camera access (auto-calculated)")
    has_microphone: Optional[bool] = Field(None, description="Has microphone access (auto-calculated)")
    has_contacts: Optional[bool] = Field(None, description="Has contact access (auto-calculated)")
    has_sms: Optional[bool] = Field(None, description="Has SMS access (auto-calculated)")

class PredictionResponse(BaseModel):
    """Response model for privacy prediction"""
    app_name: str
    privacy_level: str
    privacy_score: float
    confidence: float
    level_probabilities: Dict[str, float]
    risk_assessment: str
    key_risk_factors: List[str]
    recommendations: List[str]
    timestamp: datetime

class PrivacyPredictor:
    def __init__(self):
        self.classification_model = None
        self.regression_model = None
        self.feature_names = None
        self.categories = []
        self.load_models()
        
    def load_models(self):
        """Load trained models and feature information"""
        try:
            # Find latest model files
            classification_path = self._find_latest_model('classification')
            regression_path = self._find_latest_model('regression')
            
            if classification_path:
                self.classification_model = joblib.load(classification_path)
                print(f"✅ Classification model loaded: {classification_path}")
            
            if regression_path:
                self.regression_model = joblib.load(regression_path)
                print(f"✅ Regression model loaded: {regression_path}")
            
            # Load feature information
            self._load_feature_info()
            
        except Exception as e:
            print(f"❌ Error loading models: {e}")
    
    def _find_latest_model(self, model_type):
        """Find the latest model file"""
        pattern = f"random_forest_{model_type}_"
        models = [f for f in os.listdir('.') if f.startswith(pattern) and f.endswith('.joblib')]
        if models:
            return max(models, key=lambda x: os.path.getmtime(x))
        return None
    
    def _load_feature_info(self):
        """Load feature names and categories from processed data"""
        try:
            df = pd.read_excel('processed_privacy_classification.xlsx', sheet_name='Processed_Dataset')
            self.feature_names = df.drop(columns=['privacy_level']).columns.tolist()
            
            # Extract categories from one-hot encoded columns
            self.categories = [col.replace('category_', '') for col in self.feature_names if col.startswith('category_')]
            print(f"✅ Loaded {len(self.feature_names)} features and {len(self.categories)} categories")
            
        except Exception as e:
            print(f"❌ Error loading feature info: {e}")
    
    def prepare_features(self, app_data: AppData) -> np.ndarray:
        """Convert app data to feature vector"""
        # Calculate derived fields
        app_data.total_permissions = (
            app_data.perm_location + app_data.perm_camera + app_data.perm_microphone +
            app_data.perm_contacts + app_data.perm_phone + app_data.perm_sms +
            app_data.perm_storage + app_data.perm_calendar + app_data.perm_network +
            app_data.perm_device_info + app_data.perm_accounts + app_data.perm_system +
            app_data.perm_other
        )
        
        app_data.permission_density = app_data.total_permissions * 1000  # Simple density estimate
        
        # Calculate boolean indicators
        app_data.has_location = app_data.perm_location > 0
        app_data.has_camera = app_data.perm_camera > 0
        app_data.has_microphone = app_data.perm_microphone > 0
        app_data.has_contacts = app_data.perm_contacts > 0
        app_data.has_sms = app_data.perm_sms > 0
        
        # Create feature vector
        features = {}
        
        # Basic features
        features['free'] = 1 if app_data.free else 0
        features['has_ads'] = 1 if app_data.has_ads else 0
        features['has_iap'] = 1 if app_data.has_iap else 0
        features['is_game'] = 1 if app_data.is_game else 0
        features['is_social'] = 1 if app_data.is_social else 0
        
        # Permission features
        features['perm_location'] = app_data.perm_location
        features['perm_camera'] = app_data.perm_camera
        features['perm_microphone'] = app_data.perm_microphone
        features['perm_contacts'] = app_data.perm_contacts
        features['perm_phone'] = app_data.perm_phone
        features['perm_sms'] = app_data.perm_sms
        features['perm_storage'] = app_data.perm_storage
        features['perm_calendar'] = app_data.perm_calendar
        features['perm_network'] = app_data.perm_network
        features['perm_device_info'] = app_data.perm_device_info
        features['perm_accounts'] = app_data.perm_accounts
        features['perm_system'] = app_data.perm_system
        features['perm_other'] = app_data.perm_other
        features['total_permissions'] = app_data.total_permissions
        features['permission_density'] = app_data.permission_density
        
        # Boolean indicators
        features['has_location'] = 1 if app_data.has_location else 0
        features['has_camera'] = 1 if app_data.has_camera else 0
        features['has_microphone'] = 1 if app_data.has_microphone else 0
        features['has_contacts'] = 1 if app_data.has_contacts else 0
        features['has_sms'] = 1 if app_data.has_sms else 0
        
        # One-hot encode category
        for cat in self.categories:
            features[f'category_{cat}'] = 1 if cat.lower() == app_data.category.lower() else 0
        
        # Create DataFrame with correct feature order
        df = pd.DataFrame([features])
        
        # Ensure all features are present in correct order
        if self.feature_names:
            missing_features = set(self.feature_names) - set(df.columns)
            for feature in missing_features:
                df[feature] = 0
            df = df[self.feature_names]
        
        return df.values
    
    def predict(self, app_data: AppData) -> PredictionResponse:
        """Make privacy prediction for app"""
        if not self.classification_model or not self.regression_model:
            raise HTTPException(status_code=500, detail="Models not loaded properly")
        
        try:
            # Prepare features
            X = self.prepare_features(app_data)
            
            # Make predictions
            level_pred = self.classification_model.predict(X)[0]
            level_probs = self.classification_model.predict_proba(X)[0]
            score_pred = self.regression_model.predict(X)[0]
            
            # Get class names and probabilities
            classes = self.classification_model.classes_
            level_probabilities = {cls: float(prob) for cls, prob in zip(classes, level_probs)}
            confidence = float(level_probabilities[level_pred])
            
            # Generate risk assessment
            risk_assessment = self._get_risk_assessment(level_pred, score_pred)
            key_risk_factors = self._identify_risk_factors(app_data)
            recommendations = self._generate_recommendations(level_pred, key_risk_factors)
            
            return PredictionResponse(
                app_name=app_data.app_name,
                privacy_level=level_pred,
                privacy_score=round(float(score_pred), 2),
                confidence=confidence,
                level_probabilities=level_probabilities,
                risk_assessment=risk_assessment,
                key_risk_factors=key_risk_factors,
                recommendations=recommendations,
                timestamp=datetime.now()
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
    
    def _get_risk_assessment(self, level: str, score: float) -> str:
        """Generate risk assessment text"""
        if level == "LOW":
            return "✅ Low Privacy Risk - This app has minimal privacy concerns"
        elif level == "MEDIUM":
            return "⚠️ Moderate Privacy Risk - This app accesses some personal data"
        elif level == "HIGH":
            return "⚠️ High Privacy Risk - This app accesses significant personal information"
        else:  # CRITICAL
            return "🚨 Critical Privacy Risk - This app has extensive access to sensitive data"
    
    def _identify_risk_factors(self, app_data: AppData) -> List[str]:
        """Identify detailed, app-specific privacy risk factors"""
        factors = []
        category = app_data.category.lower()
        
        # Permission-based risks with context
        if app_data.perm_location > 0:
            if category in ['social', 'dating', 'communication']:
                factors.append(f"Tracks your location for social features - may share whereabouts with contacts")
            elif category in ['travel & local', 'maps & navigation']:
                factors.append(f"Location tracking essential for navigation but creates detailed movement history")
            elif category in ['shopping', 'food & drink']:
                factors.append(f"Monitors location for targeted ads and store recommendations")
            else:
                factors.append(f"Location access may not be necessary for {category} apps - review why needed")
        
        if app_data.perm_contacts > 0:
            if category in ['social', 'communication', 'dating']:
                factors.append(f"Accesses your contact list - may upload phone numbers to servers")
            elif category in ['productivity', 'business']:
                factors.append(f"Contact access for work features but may sync with cloud services")
            else:
                factors.append(f"Unusual contact access for {category} apps - check app necessity")
        
        if app_data.perm_camera > 0:
            if category in ['photography', 'social', 'communication']:
                factors.append(f"Camera access for photos/videos - may analyze or store image metadata")
            elif category in ['shopping', 'finance']:
                factors.append(f"Camera used for scanning - may process sensitive document information")
            else:
                factors.append(f"Camera access in {category} apps could enable unauthorized recording")
        
        if app_data.perm_microphone > 0:
            if category in ['communication', 'music & audio', 'social']:
                factors.append(f"Microphone for calls/audio but may enable background listening")
            elif category in ['productivity', 'education']:
                factors.append(f"Voice features available but creates audio data that could be stored")
            else:
                factors.append(f"Microphone access unusual for {category} - potential privacy risk")
        
        if app_data.perm_phone > 0:
            if category in ['communication', 'business', 'finance']:
                factors.append(f"Phone access for calls/SMS - may log communication patterns")
            else:
                factors.append(f"Phone permissions in {category} apps could access call history")
        
        if app_data.perm_sms > 0:
            if category in ['communication', 'finance', 'business']:
                factors.append(f"SMS access for verification codes but may read all text messages")
            else:
                factors.append(f"SMS access in {category} apps is concerning - may read private messages")
        
        if app_data.perm_storage > 0:
            factors.append(f"File access may scan photos, documents, and personal files on your device")
        
        # App-specific risks
        if app_data.has_ads:
            if category in ['games', 'entertainment']:
                factors.append(f"Ad-supported model may track gaming habits and show targeted content")
            elif category in ['social', 'communication']:
                factors.append(f"Advertising in social apps can create detailed behavioral profiles")
            else:
                factors.append(f"Advertisements may track usage patterns across multiple apps")
        
        if app_data.has_iap:
            factors.append(f"In-app purchases may store payment information and spending patterns")
        
        # Category-specific concerns
        if category == 'social':
            factors.append("Social apps typically collect extensive data for friend suggestions and content curation")
        elif category == 'dating':
            factors.append("Dating apps often access sensitive personal information and location data")
        elif category == 'finance':
            factors.append("Financial apps handle highly sensitive data and may share with third parties")
        elif category == 'health & fitness':
            factors.append("Health apps collect sensitive medical data that may not be HIPAA protected")
        elif category == 'games' and app_data.has_ads:
            factors.append("Gaming apps with ads often have aggressive data collection for targeted advertising")
        
        # Permission density analysis
        if app_data.total_permissions and app_data.total_permissions > 25:
            factors.append(f"Requests {int(app_data.total_permissions)} permissions - unusually high for most apps")
        elif app_data.total_permissions and app_data.total_permissions > 15:
            factors.append(f"Requests {int(app_data.total_permissions)} permissions - consider if all are necessary")
        
        # Network and data concerns
        if app_data.perm_network > 3:
            factors.append("Extensive network access may enable frequent data transmission to servers")
        
        # Account and system access
        if app_data.perm_accounts > 0:
            factors.append("Account access may link your app usage with other Google/system services")
        
        if app_data.perm_system > 2:
            factors.append("Deep system access could potentially interfere with other apps or system settings")
        
        # If no major concerns, add category-appropriate notes
        if len(factors) < 2:
            if category in ['tools', 'productivity']:
                factors.append("Generally minimal data collection typical for utility apps")
            elif category in ['education', 'books & reference']:
                factors.append("Educational apps usually have lower privacy risks")
            else:
                factors.append("Review app's privacy policy for data collection details")
        
        return factors[:6]  # Limit to most important factors
    
    def _generate_recommendations(self, level: str, risk_factors: List[str]) -> List[str]:
        """Generate contextual privacy recommendations"""
        recommendations = []
        
        # Level-based recommendations
        if level == "CRITICAL":
            recommendations.append("🛑 Consider finding alternative apps with better privacy practices")
            recommendations.append("📋 Read the privacy policy carefully before use")
        elif level == "HIGH":
            recommendations.append("⚠️ Review and limit permissions after installation")
            recommendations.append("🔍 Monitor what data this app accesses over time")
        elif level == "MEDIUM":
            recommendations.append("✅ App has moderate privacy impact - use with normal caution")
        else:  # LOW
            recommendations.append("✅ App appears to have good privacy practices")
        
        # Specific risk-based recommendations
        risk_text = " ".join(risk_factors).lower()
        
        if "location" in risk_text:
            if "social" in risk_text or "dating" in risk_text:
                recommendations.append("📍 Consider disabling location sharing in social features")
            else:
                recommendations.append("📍 Turn off location access when app is not in use")
        
        if "contact" in risk_text:
            recommendations.append("📱 Limit contact access and review friend suggestion settings")
        
        if "camera" in risk_text or "microphone" in risk_text:
            recommendations.append("🎤 Check app settings for audio/video recording permissions")
        
        if "sms" in risk_text or "phone" in risk_text:
            recommendations.append("💬 Be cautious of apps that can access messages and calls")
        
        if "advertisement" in risk_text or "ads" in risk_text:
            recommendations.append("🎯 Consider premium versions to avoid ad tracking")
            recommendations.append("🔒 Use ad blockers or privacy-focused browsers when possible")
        
        if "financial" in risk_text or "payment" in risk_text:
            recommendations.append("💳 Enable two-factor authentication for financial features")
        
        if "health" in risk_text or "medical" in risk_text:
            recommendations.append("🏥 Verify if health data is shared with insurance companies")
        
        if "permissions" in risk_text and ("25" in risk_text or "15" in risk_text):
            recommendations.append("⚙️ Manually disable unnecessary permissions in device settings")
        
        # Data protection recommendations
        if level in ["HIGH", "CRITICAL"]:
            recommendations.append("🔐 Use a VPN to protect your internet traffic")
            recommendations.append("📊 Regularly review your digital footprint and privacy settings")
        
        # Remove duplicates and limit to most relevant
        recommendations = list(dict.fromkeys(recommendations))  # Remove duplicates
        return recommendations[:5]

# Initialize predictor
predictor = PrivacyPredictor()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Privacy Prediction API", 
        "status": "healthy",
        "models_loaded": {
            "classification": predictor.classification_model is not None,
            "regression": predictor.regression_model is not None
        }
    }

@app.get("/categories")
async def get_categories():
    """Get available app categories"""
    return {
        "categories": predictor.categories,
        "count": len(predictor.categories)
    }

class SimpleAppQuery(BaseModel):
    """Simple app query model for app name search"""
    app_name: str = Field(..., description="Name of the app to search for")
    category: Optional[str] = Field(None, description="App category (optional)")

class AppSearchResult(BaseModel):
    """App search result model"""
    app_name: str
    category: str
    privacy_score: float
    privacy_level: str

@app.get("/search")
async def search_apps(q: str) -> List[AppSearchResult]:
    """Search for apps by name"""
    try:
        results = app_db.get_similar_apps(q, limit=10)
        return [AppSearchResult(**result) for result in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.post("/predict/simple")
async def predict_simple(query: SimpleAppQuery) -> PredictionResponse:
    """
    Predict privacy risk using just app name (lookup from dataset)
    """
    try:
        # First, try to find the app in our dataset
        app_data_dict = app_db.search_app(query.app_name)
        
        if app_data_dict:
            # Use real app data from dataset
            app_data = AppData(**app_data_dict)
            result = predictor.predict(app_data)
            
            # Add a note that this used real data
            result.risk_assessment += " (Based on real app data)"
            return result
        else:
            # App not found in dataset, return suggestions
            similar_apps = app_db.get_similar_apps(query.app_name, limit=5)
            if similar_apps:
                suggestions = [app['app_name'] for app in similar_apps]
                raise HTTPException(
                    status_code=404, 
                    detail=f"App '{query.app_name}' not found in database. Similar apps: {', '.join(suggestions[:3])}"
                )
            else:
                raise HTTPException(
                    status_code=404, 
                    detail=f"App '{query.app_name}' not found in database. Try searching with a different name."
                )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/predict", response_model=PredictionResponse)
async def predict_privacy(app_data: AppData):
    """Predict privacy risk for an app"""
    # If only app_name and category are provided (basic search), try to get real data
    # Check if most permission fields are at default values (indicating basic input)
    permission_sum = (
        app_data.perm_location + app_data.perm_camera + app_data.perm_microphone +
        app_data.perm_contacts + app_data.perm_phone + app_data.perm_sms +
        app_data.perm_storage + app_data.perm_calendar + app_data.perm_device_info +
        app_data.perm_accounts + app_data.perm_system + app_data.perm_other
    )
    
    # If permission sum is very low (only default network perm) and other flags are default, likely basic input
    has_only_basic_data = (
        permission_sum <= 1 and  # Only default network permission (1) allowed
        app_data.perm_network == 1 and  # Network should be at default
        not app_data.has_ads and
        not app_data.has_iap and
        not app_data.is_game and
        not app_data.is_social
    )
    
    if has_only_basic_data:
        # Try to find real app data
        real_app_data = app_db.search_app(app_data.app_name)
        if real_app_data:
            # Use real data but keep the original app_name
            real_app_data['app_name'] = app_data.app_name
            enhanced_app_data = AppData(**real_app_data)
            result = predictor.predict(enhanced_app_data)
            result.risk_assessment += " (Enhanced with real app data)"
            return result
    
    # Use provided data as-is
    return predictor.predict(app_data)

@app.get("/predict/demo")
async def predict_demo():
    """Demo prediction with sample data"""
    sample_app = AppData(
        app_name="Sample Social App",
        category="Social",
        free=True,
        has_ads=True,
        has_iap=False,
        is_game=False,
        is_social=True,
        perm_location=2.0,
        perm_camera=1,
        perm_microphone=1,
        perm_contacts=2.0,
        perm_phone=1.0,
        perm_sms=0.0,
        perm_storage=3.0,
        perm_calendar=0.0,
        perm_network=5.0,
        perm_device_info=1.0,
        perm_accounts=1,
        perm_system=2.0,
        perm_other=8.0
    )
    
    return predictor.predict(sample_app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)