import { render, screen, waitFor } from "@testing-library/react";
import AnalyticsPage from "@/app/analytics/page";
import { describe, it, expect, vi } from "vitest";

// Mock resize observer for Recharts
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("Analytics Tests", () => {
  it("should render Analytics and Heatmap views", async () => {
    render(<AnalyticsPage />);
    
    // Verify the analytics layout loads correctly
    expect(screen.getByText(/Crowd Flow Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Occupancy vs Average/i)).toBeInTheDocument();
  });
});
