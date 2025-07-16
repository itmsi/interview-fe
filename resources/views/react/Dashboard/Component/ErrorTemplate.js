import React from 'react'
import { Button } from 'react-bootstrap'

/**
 * ErrorTemplate Component
 * 
 * Component for displaying errors with consistent and user-friendly appearance
 * 
 * @param {Function} onRetry - Callback function for retry action
 * @param {Number} retryCount - Number of retry attempts (default: 0)
 * @param {Boolean} loading - Loading status during retry (default: false)
 * @param {String} title - Error title (default: "Connection Problem")
 * @param {String} message - Error message (default: message about API)
 * @param {Boolean} showTroubleshooting - Show troubleshooting steps (default: true)
 * @param {ReactNode} customIcon - Custom icon for error (default: X icon)
 * 
 * @example
 * // Basic usage
 * <ErrorTemplate onRetry={handleRetry} loading={loading} />
 * 
 * // Custom title and message
 * <ErrorTemplate 
 *   onRetry={handleRetry}
 *   title="Data Not Found"
 *   message="No data available to display"
 *   showTroubleshooting={false}
 * />
 */

export const ErrorTemplate = ({ 
    onRetry, 
    loading = false,
    title = "Connection Problem",
    message = "Unable to access the API server. Please ensure your internet connection is stable and the server is running normally.",
    showTroubleshooting = true,
    customIcon = null
}) => (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '400px', padding: '2rem' }}>
        <div className="text-center">
            {/* Error Icon */}
            <div className="mb-4">
                {customIcon || (
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="#dc3545" strokeWidth="2" fill="#fff"/>
                        <path d="M15 9l-6 6" stroke="#dc3545" strokeWidth="2"/>
                        <path d="m9 9 6 6" stroke="#dc3545" strokeWidth="2"/>
                    </svg>
                )}
            </div>
            
            {/* Error Message */}
            <h4 className="text-danger mb-3">{title}</h4>
            <p className="text-muted mb-4" style={{ maxWidth: '400px' }}>
                {message}
            </p>
            
            {/* Error Details */}
            <div className="alert alert-danger text-start mb-4" style={{ maxWidth: '500px' }}>
                <strong>Possible causes:</strong>
                <ul className="mb-0 mt-2">
                    <li>Internet connection is down</li>
                    <li>API server is under maintenance</li>
                    <li>Connection timeout</li>
                    <li>Firewall or proxy blocking access</li>
                    <li>Session has expired</li>
                </ul>
            </div>
            
            {/* Action Buttons */}
            <div className="d-flex gap-3 justify-content-center">
                <Button 
                    variant="primary" 
                    onClick={onRetry}
                    className="px-4"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Retrying...
                        </>
                    ) : (
                        <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
                                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 16H3v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Try Again
                        </>
                    )}
                </Button>
                
                <Button 
                    variant="outline-secondary" 
                    onClick={() => window.history.back()}
                    className="px-4"
                    disabled={loading}
                >
                    Go Back
                </Button>
            </div>
            
            {/* Quick Troubleshooting */}
            {showTroubleshooting && (
                <div className="mt-4 pt-3 border-top" style={{ maxWidth: '500px' }}>
                    <div className="text-start">
                        <strong className="text-muted">Quick troubleshooting steps:</strong>
                        <ol className="mt-2 text-muted" style={{ fontSize: '0.9rem' }}>
                            <li>Check your internet connection</li>
                            <li>Refresh the page (Ctrl+F5)</li>
                            <li>Try accessing from another browser</li>
                            <li>Wait a few minutes and try again</li>
                            <li>Make sure you are still logged into the system</li>
                        </ol>
                    </div>
                </div>
            )}
            
            {/* Support Info */}
            <div className="mt-3 pt-3 border-top" style={{ maxWidth: '400px' }}>
                <small className="text-muted">
                    If the problem persists, please contact the system administrator or IT support team.
                </small>
            </div>
        </div>
    </div>
)

// Error Template for various types of errors
export const NetworkErrorTemplate = (props) => (
    <ErrorTemplate 
        {...props}
        title="Network Issue"
        message="Unable to connect to the server. Please check your internet connection."
        customIcon={
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#dc3545"/>
                <path d="M1 1l22 22" stroke="#dc3545" strokeWidth="2"/>
            </svg>
        }
    />
)

export const ServerErrorTemplate = (props) => (
    <ErrorTemplate 
        {...props}
        title="Server Issue"
        message="The server is experiencing problems. The technical team is handling this issue."
        customIcon={
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="20" height="4" rx="1" fill="#dc3545"/>
                <rect x="2" y="10" width="20" height="4" rx="1" fill="#dc3545"/>
                <rect x="2" y="16" width="20" height="4" rx="1" fill="#dc3545"/>
                <circle cx="5" cy="6" r="1" fill="#fff"/>
                <circle cx="5" cy="12" r="1" fill="#fff"/>
                <circle cx="5" cy="18" r="1" fill="#fff"/>
                <path d="M15 6l2 2-2 2" stroke="#fff" strokeWidth="1"/>
                <path d="M15 12l2 2-2 2" stroke="#fff" strokeWidth="1"/>
                <path d="M15 18l2 2-2 2" stroke="#fff" strokeWidth="1"/>
            </svg>
        }
    />
)

export const AuthErrorTemplate = (props) => (
    <ErrorTemplate 
        {...props}
        title="Session Expired"
        message="Your login session has expired. Please log in again to continue."
        customIcon={
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" fill="#dc3545"/>
                <circle cx="12" cy="15" r="2" fill="#fff"/>
            </svg>
        }
    />
)
