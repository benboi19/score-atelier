/**
 * Simplified React hooks for Privacy API integration (without React Query)
 */

import { useState, useCallback } from 'react';
import { 
  privacyApi, 
  AppData, 
  PredictionResult, 
  PrivacyApiError,
  ApiHealthResponse,
  CategoriesResponse 
} from '@/lib/privacy-api';

/**
 * Hook to check API health status
 */
export function useApiHealth() {
  const [data, setData] = useState<ApiHealthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PrivacyApiError | null>(null);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await privacyApi.getHealth();
      setData(result);
    } catch (err) {
      setError(err as PrivacyApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, checkHealth };
}

/**
 * Hook to get available categories
 */
export function useCategories() {
  const [data, setData] = useState<CategoriesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PrivacyApiError | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await privacyApi.getCategories();
      setData(result);
    } catch (err) {
      setError(err as PrivacyApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchCategories };
}

/**
 * Hook for privacy prediction
 */
export function usePrivacyPrediction() {
  const [data, setData] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PrivacyApiError | null>(null);

  const predict = useCallback(async (appData: AppData) => {
    setLoading(true);
    setError(null);
    setData(null);
    
    try {
      const result = await privacyApi.predictPrivacy(appData);
      setData(result);
      return result;
    } catch (err) {
      const error = err as PrivacyApiError;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, predict };
}

/**
 * Hook to get demo prediction
 */
export function useDemoPredict() {
  const [data, setData] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PrivacyApiError | null>(null);

  const getDemoPredict = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await privacyApi.getDemoPredict();
      setData(result);
      return result;
    } catch (err) {
      const error = err as PrivacyApiError;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getDemoPredict };
}

/**
 * Custom hook for managing app form state with validation
 */
export function useAppForm(initialData?: Partial<AppData>) {
  const [formData, setFormData] = useState<AppData>({
    app_name: '',
    category: '',
    free: true,
    has_ads: false,
    has_iap: false,
    is_game: false,
    is_social: false,
    perm_location: 0,
    perm_camera: 0,
    perm_microphone: 0,
    perm_contacts: 0,
    perm_phone: 0,
    perm_sms: 0,
    perm_storage: 0,
    perm_calendar: 0,
    perm_network: 1,
    perm_device_info: 0,
    perm_accounts: 0,
    perm_system: 0,
    perm_other: 0,
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback((field: keyof AppData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const updateMultipleFields = useCallback((updates: Partial<AppData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.app_name.trim()) {
      newErrors.app_name = 'App name is required';
    }

    if (!formData.category) {
      newErrors.category = 'App category is required';
    }

    // Validate permission ranges
    const permissionFields = [
      'perm_location', 'perm_contacts', 'perm_phone', 'perm_sms',
      'perm_storage', 'perm_calendar', 'perm_network', 'perm_device_info',
      'perm_system'
    ];

    permissionFields.forEach(field => {
      const value = formData[field as keyof AppData] as number;
      if (value < 0 || value > 10) {
        newErrors[field] = 'Value must be between 0 and 10';
      }
    });

    // Special validation for binary fields
    ['perm_camera', 'perm_microphone', 'perm_accounts'].forEach(field => {
      const value = formData[field as keyof AppData] as number;
      if (value < 0 || value > 5) {
        newErrors[field] = 'Value must be between 0 and 5';
      }
    });

    // Validate perm_other (0-50)
    if (formData.perm_other < 0 || formData.perm_other > 50) {
      newErrors.perm_other = 'Value must be between 0 and 50';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      app_name: '',
      category: '',
      free: true,
      has_ads: false,
      has_iap: false,
      is_game: false,
      is_social: false,
      perm_location: 0,
      perm_camera: 0,
      perm_microphone: 0,
      perm_contacts: 0,
      perm_phone: 0,
      perm_sms: 0,
      perm_storage: 0,
      perm_calendar: 0,
      perm_network: 1,
      perm_device_info: 0,
      perm_accounts: 0,
      perm_system: 0,
      perm_other: 0,
      ...initialData,
    });
    setErrors({});
  }, [initialData]);

  // Calculate derived values
  const totalPermissions = Object.entries(formData)
    .filter(([key]) => key.startsWith('perm_'))
    .reduce((sum, [_, value]) => sum + (value as number), 0);

  const hasHighRiskPermissions = 
    formData.perm_location > 0 ||
    formData.perm_contacts > 0 ||
    formData.perm_phone > 0 ||
    formData.perm_microphone > 0 ||
    formData.perm_camera > 0;

  return {
    formData,
    errors,
    updateField,
    updateMultipleFields,
    validateForm,
    resetForm,
    totalPermissions,
    hasHighRiskPermissions,
    isValid: Object.keys(errors).length === 0 && formData.app_name.trim() && formData.category,
  };
}

/**
 * Hook for managing prediction history
 */
export function usePredictionHistory() {
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);

  const addPrediction = useCallback((prediction: PredictionResult) => {
    setPredictions(prev => [prediction, ...prev.slice(0, 9)]); // Keep last 10
  }, []);

  const clearHistory = useCallback(() => {
    setPredictions([]);
  }, []);

  const removePrediction = useCallback((timestamp: string) => {
    setPredictions(prev => prev.filter(p => p.timestamp !== timestamp));
  }, []);

  return {
    predictions,
    addPrediction,
    clearHistory,
    removePrediction,
  };
}