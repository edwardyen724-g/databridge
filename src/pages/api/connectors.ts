import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';
import { Connector } from '../../models/Connector';
import { getSession } from 'next-auth/react';

interface AuthedRequest extends NextApiRequest {
  user?: { id: string; email: string };
}

const rateLimit = new Map<string, number>();

const limitRate = (key: string) => {
  const currentTime = Date.now();
  const limitWindow = 60000; // 1 minute
  const requestCount = rateLimit.get(key) || 0;

  if (requestCount > 10) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  rateLimit.set(key, requestCount + 1);

  setTimeout(() => {
    rateLimit.set(key, requestCount);
  }, limitWindow);
};

export default async function handler(req: AuthedRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.user = { id: session.user.id, email: session.user.email };

  try {
    limitRate(req.user.email);

    await connectToDatabase();

    switch (req.method) {
      case 'POST':
        const connectorData = req.body;
        const newConnector = await Connector.create({
          ...connectorData,
          userId: req.user.id,
        });
        return res.status(201).json(newConnector);

      case 'GET':
        const connectors = await Connector.find({ userId: req.user.id });
        return res.status(200).json(connectors);

      case 'PUT':
        const { id, ...updateData } = req.body;
        const updatedConnector = await Connector.findByIdAndUpdate(id, updateData, { new: true });
        return res.status(200).json(updatedConnector);

      case 'DELETE':
        const { id: connectorId } = req.body;
        await Connector.findByIdAndDelete(connectorId);
        return res.status(204).end();

      default:
        return res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']).status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
}