/**
 * API client for Privacy Prediction Service
 */

const API_BASE_URL = 'http://localhost:8003';

export interface AppData {
  app_name: string;
  category: string;
  free: boolean;
  has_ads: boolean;
  has_iap: boolean;
  is_game: boolean;
  is_social: boolean;
  perm_location: number;
  perm_camera: number;
  perm_microphone: number;
  perm_contacts: number;
  perm_phone: number;
  perm_sms: number;
  perm_storage: number;
  perm_calendar: number;
  perm_network: number;
  perm_device_info: number;
  perm_accounts: number;
  perm_system: number;
  perm_other: number;
}

export interface PredictionResult {
  app_name: string;
  privacy_level: string;
  privacy_score: number;
  confidence: number;
  level_probabilities: Record<string, number>;
  risk_assessment: string;
  key_risk_factors: string[];
  recommendations: string[];
  timestamp: string;
}

export interface ApiHealthResponse {
  message: string;
  status: string;
  models_loaded: {
    classification: boolean;
    regression: boolean;
  };
}

export interface CategoriesResponse {
  categories: string[];
  count: number;
}

class PrivacyApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'PrivacyApiError';
  }
}

class PrivacyApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        let errorDetails;
        try {
          errorDetails = await response.json();
        } catch {
          errorDetails = { message: response.statusText };
        }
        
        throw new PrivacyApiError(
          errorDetails.detail || errorDetails.message || `HTTP ${response.status}`,
          response.status,
          errorDetails
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof PrivacyApiError) {
        throw error;
      }
      
      // Network or other errors
      throw new PrivacyApiError(
        error instanceof Error ? error.message : 'Network error occurred'
      );
    }
  }

  /**
   * Check API health and model status
   */
  async getHealth(): Promise<ApiHealthResponse> {
    return this.makeRequest<ApiHealthResponse>('/');
  }

  /**
   * Get available app categories
   */
  async getCategories(): Promise<CategoriesResponse> {
    return this.makeRequest<CategoriesResponse>('/categories');
  }

  /**
   * Predict privacy risk for an app
   */
  async predictPrivacy(appData: AppData): Promise<PredictionResult> {
    return this.makeRequest<PredictionResult>('/predict', {
      method: 'POST',
      body: JSON.stringify(appData),
    });
  }

  /**
   * Get demo prediction with sample data
   */
  async getDemoPredict(): Promise<PredictionResult> {
    return this.makeRequest<PredictionResult>('/predict/demo');
  }
}

// Export singleton instance
export const privacyApi = new PrivacyApiClient();

// Export error class for error handling
export { PrivacyApiError };