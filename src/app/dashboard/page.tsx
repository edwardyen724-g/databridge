import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { FirebaseOptions } from "firebase/app";
import axios from "axios";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [dataIntegrations, setDataIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await fetchDataIntegrations(user.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchDataIntegrations = async (userId: string) => {
    try {
      const response = await axios.get(`/api/integrations/${userId}`);
      setDataIntegrations(response.data);
    } catch (err) {
      console.error("Error fetching data integrations:", err instanceof Error ? err.message : String(err));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  return (
    <div>
      <h1>Integrate Your Data Effortlessly with Industry-Specific Solutions</h1>
      <h2>Welcome, {user.displayName || user.email}</h2>
      <div>
        <h3>Your Integrations:</h3>
        {dataIntegrations.length > 0 ? (
          <ul>
            {dataIntegrations.map((integration) => (
              <li key={integration.id}>{integration.name}</li>
            ))}
          </ul>
        ) : (
          <p>No integrations found. Please set up your data integrations.</p>
        )}
      </div>
      <div>
        <h3>Features</h3>
        <ul>
          <li>Industry-specific connectors for healthcare and finance with customizable fields</li>
          <li>User-friendly interface for setting up and managing integrations without coding</li>
          <li>Real-time data sync capabilities with error logging and notification</li>
          <li>Compliance checks to ensure data integrity and regulations adherence</li>
          <li>Simple dashboard for monitoring integration performance and health</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;