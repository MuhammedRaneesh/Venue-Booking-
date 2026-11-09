"use client";

import { useState, useEffect } from "react";
import { CategoryStatsCards } from "./CategoryStatsCards";
import { CategoryFilterBar } from "./CategoryFilterBar";
import { CategoryTable } from "./CategoryTable";
import { CategoryFormDrawer } from "./CategoryFormDrawer";
import { CategoryDeleteDialog } from "./CategoryDeleteDialog";
import { useCategoriesList } from "../hooks/useCategories";
import { Category, CategoryQueryParams } from "../types/category.types";

export function CategoriesManagementView() {
  const [filters, setFilters] = useState<CategoryQueryParams>({
    page: 1,
    limit: 10,
  });

  // Debounced search
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

  const queryParams: CategoryQueryParams = {
    ...filters,
    search: debouncedSearch,
  };

  const { data, isLoading, isError } = useCategoriesList(queryParams);

  // Drawer & Dialog State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const handleOpenCreate = () => {
    setCategoryToEdit(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setCategoryToEdit(category);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setCategoryToEdit(null);
  };

  const handleFilterChange = (newFilters: Partial<CategoryQueryParams>) => {
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
      status: undefined,
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
          Categories
        </h1>
        <p className="text-sm text-[#888888]">
          Manage event occasion categories, taxonomy slugs, and catalog banners.
        </p>
      </div>

      {/* 1. Statistics Cards */}
      <CategoryStatsCards
        categories={data?.categories}
        totalCount={data?.totalCount}
        isLoading={isLoading}
      />

      {/* 2. Filter Bar */}
      <CategoryFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onOpenCreateDrawer={handleOpenCreate}
      />

      {/* 3. Category Table */}
      <CategoryTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        page={filters.page || 1}
        onPageChange={handlePageChange}
        onEditCategory={handleOpenEdit}
        onDeleteCategory={(cat) => setCategoryToDelete(cat)}
        onOpenCreateDrawer={handleOpenCreate}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Slide-Over Sidebar Drawer (Not a modal!) */}
      <CategoryFormDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        categoryToEdit={categoryToEdit}
      />

      {/* 5. Delete Safety Confirmation Dialog */}
      <CategoryDeleteDialog
        category={categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
      />
    </div>
  );
}

