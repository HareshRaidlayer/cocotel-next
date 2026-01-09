interface LoginCredentials {
  name: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data?: unknown;
}
interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

const NEST_URL = process.env.NEXT_PUBLIC_NEST_API_BASE_URL || "https://neoneapi.hanaplatform.com"

export async function registerUser(credentials: RegisterCredentials): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${NEST_URL}/api/auth/signup/password`, {
}
const NEST_URL = process.env.NEXT_PUBLIC_NEST_API_BASE_URL || "https://neoneapi.hanaplatform.com"
export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await fetch(`${NEST_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appName: 'app3534482538357',
        name: credentials.email,
        legalname: credentials.name,
        email: credentials.email,
        password: credentials.password,
        role: '1749109628034',
        mobile: credentials.phone || 'null',
         otpMethod: "email"
        name: credentials.name,
        password: credentials.password,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Registration successful',
        data: result,
      };
    }

    return {
      success: false,
      message: result.message || 'Registration failed',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
}
export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await fetch(`${NEST_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appName: 'app3534482538357',
        name: credentials.name,
        password: credentials.password,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Login successful',
        data: result,
      };
    }

    return {
      success: false,
      message: result.message || 'Login failed',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
}