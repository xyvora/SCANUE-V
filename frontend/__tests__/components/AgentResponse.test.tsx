import type { PropsWithChildren, HTMLAttributes } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { AgentResponse } from '@/components/AgentResponse'

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: PropsWithChildren) => <>{children}</>,
}))

describe('AgentResponse', () => {
  it('renders correctly for PFC agent', () => {
    render(<AgentResponse agent="PFC" response="Test PFC response" />)
    expect(screen.getByText('PFC Agent')).toBeInTheDocument()
    expect(screen.getByText('Test PFC response')).toBeInTheDocument()
  })

  it('renders correctly for General agent', () => {
    render(<AgentResponse agent="General" response="Test General response" />)
    expect(screen.getByText('General Agent')).toBeInTheDocument()
    expect(screen.getByText('Test General response')).toBeInTheDocument()
  })

  it('toggles response visibility on click', () => {
    render(<AgentResponse agent="PFC" response="Test PFC response" />)
    const button = screen.getByRole('button')
    
    // Response starts visible
    expect(screen.getByText('Test PFC response')).toBeInTheDocument()
    
    // First click hides it
    fireEvent.click(button)
    expect(screen.queryByText('Test PFC response')).not.toBeInTheDocument()
    
    // Second click shows it
    fireEvent.click(button)
    expect(screen.getByText('Test PFC response')).toBeInTheDocument()
  })

  it('uses correct icons for each agent type', () => {
    const { rerender } = render(<AgentResponse agent="PFC" response="Test PFC response" />)
    expect(screen.getByLabelText('PFC Agent')).toBeInTheDocument()

    rerender(<AgentResponse agent="General" response="Test General response" />)
    expect(screen.getByLabelText('General Agent')).toBeInTheDocument()
  })

  it('applies correct styling', () => {
    render(<AgentResponse agent="PFC" response="Test response" />)
    const responseContainer = screen.getByText('Test response').closest('.glass-effect')
    expect(responseContainer).toHaveClass('glass-effect', 'rounded-b-lg')
  })
})

