"use client";

import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface SearchFilterProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onFilter?: () => void;
  showFilterButton?: boolean;
  className?: string;
}

export function SearchFilter({
  placeholder = "Buscar...",
  onSearch,
  onFilter,
  showFilterButton = true,
  className = "",
}: SearchFilterProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={placeholder}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {showFilterButton && (
          <Button variant="outline" onClick={onFilter}>
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        )}
      </div>
    </div>
  );
}