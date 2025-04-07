import { jwtDecode } from "jwt-decode";
import { LocalStorageHelper } from "./localStorageHelper";
interface DecodedToken {
  exp: number;
  aud?: string;
  sub?: string;
}

export const isValidToken = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
    const expiryTime = decodedToken.exp ? decodedToken.exp * 1000 : 0; 
    const currentTime = Date.now();
    const isTokenExpired = currentTime >= expiryTime;
    return !isTokenExpired ;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

export const getEmailFromToken = (): string => {
  try {
    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(LocalStorageHelper.getAccessToken()); 
    return decodedToken?.sub || "";
  } catch (error) {
    console.error("Error validating token:", error);
    return "";
  }
};

// async function introspectToken(accessToken: string): Promise<any> {
//     if (!OKTA_BASE_URL) {
//         throw new Error("OKTA_BASE_URL not found in environment variables");
//     }
 
//     try {
//         const params = new URLSearchParams();
//         const url = `${OKTA_BASE_URL}/oauth2/default/v1/introspect`;
//         params.append("token", accessToken);
//         params.append("token_type_hint", "access_token");
 
//         const basicAuth = Buffer.from(`${OKTA_CLIENT_ID}:${OKTA_CLIENT_SECRET}`).toString("base64");
//         const response = await axios.post(url, params.toString(), {
//             headers: {
//                 "Content-Type": "application/x-www-form-urlencoded",
//                 Authorization: `Basic ${basicAuth}`,
//             },
//         });
 
//         if (response.status == 200) return response.data;
//         else {
//             console.error("Introspect API response : " + response.status + " " + response.statusText);
//             return { active: false, aud: "", erorr: response.status + " " + response.statusText };
//         }
//     } catch (error) {
//         console.error("Error introspecting token:", error);
//         throw error;
//     }
// }
 
// DOCUMENT_AI_OKTA_CLIENT_ID = 0oa268b9dhxaIQcIe0h8
// OKTA_CLIENT_ID=0oa1tnas44k42nt8b0h8
// OKTA_CLIENT_SECRET=ZEkKHABZAazc1CVmMQBhpF5PlnnD37MiHxoN0YEWJMeQ7FXf1eUfdCa97JJ9pxPl
