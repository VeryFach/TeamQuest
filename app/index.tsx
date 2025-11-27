import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";

export default function Index() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthChecked(true);
      if (user) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/auth/login");
      }
    });
    return unsubscribe;
  }, [router]);

  // Optional: tampilkan loading indicator jika auth belum dicek
  if (!authChecked) return null;

  return null;
}
