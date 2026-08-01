'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

export function SearchBar({
  placeholder = 'Search…',
  onSearch,
}: {
  placeholder?: string;
  onSearch: (query: string) => void;
}) {
  const [value, setValue] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(value);
      }}
      className="relative flex-1"
    >
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-white py-3 pl-10 pr-4 text-[15px] focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
      />
    </form>
  );
}
