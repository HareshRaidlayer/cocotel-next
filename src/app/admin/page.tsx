"use client";

import { useState } from 'react';

export default function AdminSyncPage() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<{ result?: { taskUid?: string } } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/search/hotels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'sync' }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Sync failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Meilisearch Admin</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Data Synchronization</h2>
          <p className="text-gray-600 mb-6">
            Sync hotel data from MongoDB to Meilisearch for fast search functionality.
          </p>

          <button
            onClick={handleSync}
            disabled={syncing}
            className={`px-6 py-3 rounded-lg font-medium ${
              syncing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white transition-colors`}
          >
            {syncing ? 'Syncing...' : 'Sync Data'}
          </button>

          {result && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Sync Successful!</h3>
              <p className="text-green-700">
                Task ID: {result.result?.taskUid}
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Sync Failed</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-2">Instructions</h3>
          <ol className="list-decimal list-inside text-blue-700 space-y-2">
            <li>Make sure Meilisearch is running on your server</li>
            <li>Click &ldquo;Sync Data&rdquo; to initialize the search index</li>
            <li>Wait for the sync to complete</li>
            <li>Test the search functionality on your website</li>
          </ol>
        </div>
      </div>
    </div>
  );
}