import { createContext, useContext, useState, ReactNode } from "react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbContextType = {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (items: BreadcrumbItem[]) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined,
);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumbs must be used within a BreadcrumbProvider");
  }
  return context;
};
