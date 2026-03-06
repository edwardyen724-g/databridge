import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

interface AuthedRequest extends NextApiRequest {
  user?: {
    uid: string;
    email: string;
  };
}

// Initialize Firebase Admin SDK
const firebaseAdminApp = initializeApp({
  credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_SDK_CONFIG || '{}')),
});

const db = getFirestore(firebaseAdminApp);

const errorsMap = new Map<string, number>();

const rateLimit = (key: string) => {
  const currentTime = Date.now();
  const requestCount = errorsMap.get(key) || 0;

  // Allow 5 requests per minute
  if (requestCount >= 5) {
    throw new Error('Rate limit exceeded');
  }

  errorsMap.set(key, requestCount + 1);
  setTimeout(() => errorsMap.delete(key), 60000);
};

export default async function handler(req: AuthedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { errorMessage, additionalInfo } = req.body;

  if (!errorMessage) {
    return res.status(400).json({ message: 'Error message is required' });
  }

  try {
    const userId = req.user?.uid || 'anonymous';
    
    // Rate limiting check
    rateLimit(userId);

    const errorLog = {
      userId,
      errorMessage,
      additionalInfo,
      timestamp: new Date().toISOString(),
    };

    await db.collection('error_logs').add(errorLog);

    return res.status(200).json({ message: 'Error logged successfully' });
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
}