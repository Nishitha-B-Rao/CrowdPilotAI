import { render, screen } from "@testing-library/react";
import IncidentCopilotPage from "@/app/incident-copilot/page";
import { describe, it, expect } from "vitest";

describe("Decision Timeline Tests", () => {
  it("should render the decision timeline and AI recommendations properly", () => {
    render(<IncidentCopilotPage />);
    
    // Verify timeline / copilot elements
    expect(screen.getByText(/Active Incidents & Dispatch/i)).toBeInTheDocument();
    
    // Ensure the AI chat box is rendered
    expect(screen.getByPlaceholderText(/Describe an incident/i)).toBeInTheDocument();
  });
});
