import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { signInWithGoogle } from "../services/auth.service";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    // Dapatkan dari Google Cloud Console
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      if (id_token) {
        signInWithGoogle(id_token)
          .then((user) => {
            console.log("Google Sign In success:", user.email);
          })
          .catch((error) => {
            console.error("Google Sign In error:", error.message);
          });
      }
    }
  }, [response]);

  const handleGoogleSignIn = async () => {
    try {
      await promptAsync();
    } catch (error: any) {
      console.error("Google Auth error:", error.message);
    }
  };

  return {
    handleGoogleSignIn,
    isLoading: !request,
  };
};
