import { render, screen } from '@testing-library/react';
import { ChatInterfaceClient } from '../../components/ChatInterfaceClient';

describe('ChatInterfaceClient', () => {
  it('renders chat interface', () => {
    render(<ChatInterfaceClient />);
    
    // Check for key elements
    expect(screen.getByText(/SCANUEV Chat/i)).toBeInTheDocument();
    expect(screen.getByText(/hi there/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message .* agent/i)).toBeInTheDocument();
  });

  it('renders agent selection buttons', () => {
    render(<ChatInterfaceClient />);
    
    expect(screen.getByText(/PFC/i)).toBeInTheDocument();
    expect(screen.getByText(/General/i)).toBeInTheDocument();
  });
});
