"use client";

import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

interface PermissionGateProps {
  children: ReactNode;
  requireAdmin?: boolean;
  fallback?: ReactNode;
}

export function PermissionGate({
  children,
  requireAdmin = false,
  fallback = null,
}: PermissionGateProps) {
  const { isAdmin } = useAuth();

  if (requireAdmin && !isAdmin) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
