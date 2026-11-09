"use client";

import { useState, useEffect } from "react";
import { UserStatsCards } from "./UserStatsCards";
import { UsersFilterBar } from "./UsersFilterBar";
import { UsersTable } from "./UsersTable";
import { UserDetailsModal } from "./UserDetailsModal";
import { useUsersList } from "../hooks/useUsers";
import { UsersQueryParams } from "../types/user.types";

export function UsersManagementView() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [filters, setFilters] = useState<UsersQueryParams>({
    page: 1,
    limit: 10,
  });

  // Debounced search query
  const [debouncedSearch, setDebouncedSearch] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      const clean = filters.search?.trim();
      setDebouncedSearch(clean && clean.length > 0 ? clean : undefined);
    }, 300);

    return () => clearTimeout(handler);
  }, [filters.search]);

  // Query users with debounced search
  const queryParams: UsersQueryParams = {
    page: filters.page,
    limit: filters.limit,
    role: filters.role || undefined,
    isActive: filters.isActive,
    search: debouncedSearch,
  };

  const { data, isLoading, isError } = useUsersList(queryParams);

  const handleFilterChange = (newFilters: Partial<UsersQueryParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: undefined,
      role: undefined,
      isActive: undefined,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#F5F2EB]">
          Users
        </h1>
        <p className="text-sm text-[#888888]">
          Monitor and manage platform members, customer accounts, and venue owners.
        </p>
      </div>

      {/* 1. Metric Cards */}
      <UserStatsCards />

      {/* 2. Filter & Search Controls */}
      <UsersFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* 3. Table View */}
      <UsersTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        page={filters.page || 1}
        onPageChange={handlePageChange}
        onSelectUser={(userId) => setSelectedUserId(userId)}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Profile Details Modal */}
      <UserDetailsModal
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />
    </div>
  );
}

