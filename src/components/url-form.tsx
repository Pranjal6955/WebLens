import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../lib/utils';

interface URLFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function URLForm({ onSubmit, isLoading }: URLFormProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL (e.g., https://example.com)"
          className="w-full px-4 py-3 pr-12 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          aria-label="Website URL"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md",
            "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          aria-label="Check WCAG compliance"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}