import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ 
                    padding: '20px', 
                    textAlign: 'center', 
                    marginTop: '50px' 
                }}>
                    <h1>Something went wrong.</h1>
                    <button 
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 20px',
                            marginTop: '20px',
                            cursor: 'pointer'
                        }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
