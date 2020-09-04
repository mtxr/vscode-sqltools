import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    console.log({ error });
    return { error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error(error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.errorInfo || this.state.error) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }} open>
            <summary>
              <code>{this.state.error && this.state.error.toString()}</code>
            </summary>
            <pre>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <div style={{  marginTop: 30 }}>
            <a href='command:workbench.action.webview.openDeveloperTools'>
              Open VSCode DevTools
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
