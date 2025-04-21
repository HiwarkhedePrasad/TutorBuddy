import { createContext, useEffect, useState, useContext } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { registerUser } from "../util/api"; // API to store user in DB

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user } = useUser(); // Get user data from Clerk
  const { getToken } = useAuth(); // Get JWT token for API requests
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        const token = await getToken(); // Get Clerk JWT token
        const userInfo = {
          name: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
          clerkId: user.id,
          role: "student", // Default role
        };

        const response = await registerUser(userInfo, token); // Send to backend
        setUserData(response);
      }
    };

    fetchUser();
  }, [user]);

  return (
    <AuthContext.Provider value={{ userData }}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
