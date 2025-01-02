import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MessageActions } from '@/components/MessageActions';

describe('MessageActions', () => {
  const message = {
    id: '1',
    content: 'Test message',
    isUser: true,
    timestamp: new Date().toISOString(),
  };

  it('renders the component correctly', () => {
    render(<MessageActions message={message} />);
    expect(screen.getByLabelText('Positive feedback')).toBeInTheDocument();
    expect(screen.getByLabelText('Negative feedback')).toBeInTheDocument();
  });

  it('triggers positive feedback action', () => {
    render(<MessageActions message={message} />);
    fireEvent.click(screen.getByLabelText('Positive feedback'));
    // Assert the expected behavior or state changes
  });

  it('triggers negative feedback action', () => {
    render(<MessageActions message={message} />);
    fireEvent.click(screen.getByLabelText('Negative feedback'));
    // Assert the expected behavior or state changes
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDeleteMock = jest.fn();
    render(<MessageActions message={message} onDelete={onDeleteMock} />);
    fireEvent.click(screen.getByLabelText('Delete message'));
    expect(onDeleteMock).toHaveBeenCalledWith(message.id);
  });

  it('does not render delete button when onDelete is not provided', () => {
    render(<MessageActions message={message} />);
    expect(screen.queryByLabelText('Delete message')).not.toBeInTheDocument();
  });
}); 