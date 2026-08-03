'use client';

import React, { ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              padding: '16px',
              margin: '12px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(15, 23, 42, 0.86))',
              border: '1px solid rgba(248, 113, 113, 0.28)',
              backdropFilter: 'blur(10px)',
              color: '#fef2f2',
            }}
          >
            <p style={{ fontWeight: '700', marginBottom: '8px', color: '#fecaca' }}>
              ⚠️ Something went wrong
            </p>
            <p style={{ fontSize: '13px', opacity: 0.85, lineHeight: 1.6 }}>
              {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                marginTop: '12px',
                padding: '8px 12px',
                background: 'rgba(248, 113, 113, 0.2)',
                border: '1px solid rgba(248, 113, 113, 0.45)',
                color: '#fee2e2',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '700',
              }}
            >
              Retry
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
