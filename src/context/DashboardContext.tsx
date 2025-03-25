"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Define Context Type
interface DashboardContextType {
    activeComponent: string;
    setActiveComponent: (component: string) => void;
}

// Create Context
const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Custom Hook for Accessing Context
export function useDashboard() {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
}

// Provider Component with Persistent State
export function DashboardProvider({ children }: { children: React.ReactNode }) {
    // Retrieve from localStorage or default to "dashboard"
    const [activeComponent, setActiveComponent] = useState(() => {
        return typeof window !== "undefined"
            ? localStorage.getItem("activeComponent") || "dashboard"
            : "dashboard";
    });

    // Update localStorage whenever activeComponent changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("activeComponent", activeComponent);
        }
    }, [activeComponent]);

    return (
        <DashboardContext.Provider value={{ activeComponent, setActiveComponent }}>
            {children}
        </DashboardContext.Provider>
    );
}
