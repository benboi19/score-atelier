"""
App Database Lookup Service
Provides real app data from the dataset for accurate predictions
"""

import pandas as pd
import json
from typing import Optional, Dict, Any, List

class AppDatabase:
    def __init__(self):
        self.df = None
        self.load_dataset()
    
    def load_dataset(self):
        """Load the privacy dataset"""
        try:
            self.df = pd.read_excel('privacydataset.xlsx')
            print(f"✅ Loaded app database with {len(self.df)} apps")
        except Exception as e:
            print(f"❌ Failed to load dataset: {e}")
    
    def search_app(self, app_name: str) -> Optional[Dict[str, Any]]:
        """
        Search for an app by name (fuzzy matching)
        Returns the app data if found
        """
        if self.df is None:
            return None
        
        # Try exact match first
        exact_match = self.df[self.df['app_name'].str.lower() == app_name.lower()]
        if len(exact_match) > 0:
            return self._row_to_dict(exact_match.iloc[0])
        
        # Try partial match
        partial_match = self.df[self.df['app_name'].str.contains(app_name, case=False, na=False)]
        if len(partial_match) > 0:
            # Return the first match
            return self._row_to_dict(partial_match.iloc[0])
        
        return None
    
    def get_similar_apps(self, app_name: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Get apps with similar names"""
        if self.df is None:
            return []
        
        # Search for apps containing the search term
        matches = self.df[self.df['app_name'].str.contains(app_name, case=False, na=False)]
        
        # Return top matches
        results = []
        for _, row in matches.head(limit).iterrows():
            results.append({
                'app_name': row['app_name'],
                'category': row['category'],
                'privacy_score': row['privacy_score'],
                'privacy_level': row['privacy_level']
            })
        
        return results
    
    def _row_to_dict(self, row) -> Dict[str, Any]:
        """Convert DataFrame row to API-compatible dictionary"""
        return {
            'app_name': row['app_name'],
            'category': row['category'],
            'free': bool(row['free']) if pd.notna(row['free']) else True,
            'has_ads': bool(row['has_ads']) if pd.notna(row['has_ads']) else False,
            'has_iap': bool(row['has_iap']) if pd.notna(row['has_iap']) else False,
            'is_game': bool(row['is_game']) if pd.notna(row['is_game']) else False,
            'is_social': bool(row['is_social']) if pd.notna(row['is_social']) else False,
            'perm_location': float(row['perm_location']) if pd.notna(row['perm_location']) else 0,
            'perm_camera': int(row['perm_camera']) if pd.notna(row['perm_camera']) else 0,
            'perm_microphone': int(row['perm_microphone']) if pd.notna(row['perm_microphone']) else 0,
            'perm_contacts': float(row['perm_contacts']) if pd.notna(row['perm_contacts']) else 0,
            'perm_phone': float(row['perm_phone']) if pd.notna(row['perm_phone']) else 0,
            'perm_sms': float(row['perm_sms']) if pd.notna(row['perm_sms']) else 0,
            'perm_storage': float(row['perm_storage']) if pd.notna(row['perm_storage']) else 0,
            'perm_calendar': float(row['perm_calendar']) if pd.notna(row['perm_calendar']) else 0,
            'perm_network': float(row['perm_network']) if pd.notna(row['perm_network']) else 1,
            'perm_device_info': float(row['perm_device_info']) if pd.notna(row['perm_device_info']) else 0,
            'perm_accounts': int(row['perm_accounts']) if pd.notna(row['perm_accounts']) else 0,
            'perm_system': float(row['perm_system']) if pd.notna(row['perm_system']) else 0,
            'perm_other': float(row['perm_other']) if pd.notna(row['perm_other']) else 0,
        }

# Global instance
app_db = AppDatabase()