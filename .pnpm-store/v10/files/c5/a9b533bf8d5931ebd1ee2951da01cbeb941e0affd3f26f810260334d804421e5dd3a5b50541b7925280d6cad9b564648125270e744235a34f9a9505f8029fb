import * as React from 'react';
interface ErrorBoundaryProps {
    message?: React.ReactNode;
    description?: React.ReactNode;
    children?: React.ReactNode;
    id?: string;
}
interface ErrorBoundaryStates {
    error?: Error | null;
    info?: {
        componentStack?: string;
    };
}
declare class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryStates> {
    state: {
        error: undefined;
        info: {
            componentStack: string;
        };
    };
    componentDidCatch(error: Error | null, info: object): void;
    render(): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | React.JSX.Element | null | undefined;
}
export default ErrorBoundary;
