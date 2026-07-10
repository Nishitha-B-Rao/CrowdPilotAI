import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import Dashboard from '../src/app/page'

describe('Dashboard XAI Component', () => {
  beforeEach(() => {
    render(<Dashboard />)
  })

  it('renders the main dashboard metrics', () => {
    expect(screen.getByText('Total Stadium Occupancy')).toBeInTheDocument()
    expect(screen.getByText('Active Incidents')).toBeInTheDocument()
    expect(screen.getByText('Live Analysis')).toBeInTheDocument()
  })

  it('displays the XAI decision timeline', async () => {
    // Wait for the mock data to load in useEffect
    await waitFor(() => {
      expect(screen.getByText(/Gate C occupancy reached 84%/i)).toBeInTheDocument()
    })
    
    // Check if the recommendation action is visible
    expect(screen.getByText(/Recommendation:/i)).toBeInTheDocument()
  })

  it('expands the XAI reasoning pipeline when clicking "Why this recommendation?"', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Why this recommendation\?/i)).toBeInTheDocument()
    })
    
    const expandButton = screen.getByText(/Why this recommendation\?/i)
    fireEvent.click(expandButton)
    
    // Check if the reasoning pipeline appears
    expect(screen.getByText(/1\. Observation/i)).toBeInTheDocument()
    expect(screen.getByText(/2\. Reasoning/i)).toBeInTheDocument()
    expect(screen.getByText(/3\. Prediction/i)).toBeInTheDocument()
    
    // Check if reasons are rendered
    expect(screen.getByText(/Recent metro arrival increased incoming fans./i)).toBeInTheDocument()
  })
})
