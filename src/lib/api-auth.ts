
 const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://neoneapi.hanaplatform.com";

interface LoginCredentials {
  name: string; 
  password: string;
  email?: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: Record<string, unknown>;
  message?: string;
}

export const login = async (
  credentials: LoginCredentials,
  appName: string,
  token: string | null = null
) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const body: Record<string, unknown> = {
      appName,
      ...credentials,
    };

    if (token) {
      console.debug("Logging in with token...");
      headers.Authorization = `Bearer ${token}`;
    } else {
      console.debug("Logging in with credentials...");
    }

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data: LoginResponse = await response.json();

    // Adjust based on what the actual successful response looks like
    // Example handling (update according to real API response):
    if (data.accessToken && data.refreshToken) {
      const accessTokenExpiry = new Date().getTime() + 60 * 60 * 1000; // 1 hour
      const refreshTokenExpiry = new Date().getTime() + 6 * 30 * 24 * 60 * 60 * 1000; // 6 months

      localStorage.setItem(`${appName}_accessToken`, data.accessToken);
      localStorage.setItem(`${appName}_refreshToken`, data.refreshToken);
      localStorage.setItem(`${appName}_accessTokenExpiry`, accessTokenExpiry.toString());
      localStorage.setItem(`${appName}_refreshTokenExpiry`, refreshTokenExpiry.toString());

      if (data.user) {
        localStorage.setItem(`${appName}_user`, JSON.stringify(data.user));
      }

      return {
        success: true,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      };
    }

    // If API returns just { success: true, token: "..." } or something else
    return data;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Login error:", errorMessage);
    throw new Error(errorMessage || "Something went wrong. Please try again.");
  }
};