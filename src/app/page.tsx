import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">
          Integrate Your Data Effortlessly with Industry-Specific Solutions
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Seamless integration for data-driven decisions in specialized industries.
        </p>
      </section>
      <Image
        src="/images/data-bridge-illustration.svg"
        alt="Data Bridge Illustration"
        width={600}
        height={400}
        className="mb-8"
      />
      <section className="w-full max-w-4xl px-4">
        <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-left text-gray-700">
          <li>Industry-specific connectors for healthcare and finance with customizable fields</li>
          <li>User-friendly interface for setting up and managing integrations without coding</li>
          <li>Real-time data sync capabilities with error logging and notification</li>
          <li>Compliance checks to ensure data integrity and regulations adherence</li>
          <li>Simple dashboard for monitoring integration performance and health</li>
        </ul>
      </section>
      <Link href="/signup" className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Get Started
      </Link>
    </main>
  );
};

export default HomePage;