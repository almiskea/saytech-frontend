import React, { createContext, useContext, useEffect, useState } from 'react';
import { Auth0Client } from '@auth0/auth0-spa-js';

const Auth0Context = createContext();

export const useAuth0 = () => {
    const context = useContext(Auth0Context);
    if (!context) {
        throw new Error('useAuth0 must be used within an Auth0Provider');
    }
    return context;
};

export const Auth0Provider = ({ children }) => {
    const [auth0Client, setAuth0Client] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initAuth0 = async () => {
            try {
                const auth0 = new Auth0Client({
                    domain: 'dev-xgfoocqykomy345z.us.auth0.com',
                    clientId: 'B8ahCgArT8cZuYHp1f9g0DVdiuZdXrcz',
                    authorizationParams: {
                        redirect_uri: window.location.origin,
                        audience: 'https://dev-xgfoocqykomy345z.us.auth0.com/api/v2/',
                        scope: 'openid profile email read:users read:user_idp_tokens'
                    },
                    cacheLocation: 'localstorage', // For SPA, use localStorage for token persistence
                    useRefreshTokens: true // Enable refresh tokens for better UX
                });

                setAuth0Client(auth0);

                // Check if user is authenticated after redirect
                if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
                    try {
                        await auth0.handleRedirectCallback();
                        // Clear the URL parameters after successful authentication
                        window.history.replaceState({}, document.title, window.location.pathname);
                        
                        // After successful Auth0 callback, redirect to admin dashboard
                        // We'll use a slight delay to ensure the Auth0 state is fully updated
                        setTimeout(() => {
                            if (window.location.pathname === '/' || window.location.pathname === '/welcome') {
                                window.history.pushState({}, '', '/adminDashboard');
                                window.dispatchEvent(new PopStateEvent('popstate'));
                            }
                        }, 100);
                    } catch (error) {
                        console.error('Error handling redirect callback:', error);
                        setError(error.message);
                    }
                }

                const isAuthenticated = await auth0.isAuthenticated();
                setIsAuthenticated(isAuthenticated);

                if (isAuthenticated) {
                    const user = await auth0.getUser();
                    setUser(user);
                }
            } catch (error) {
                console.error('Error initializing Auth0:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth0();
    }, []);

    const loginWithRedirect = async (options = {}) => {
        try {
            await auth0Client?.loginWithRedirect(options);
        } catch (error) {
            console.error('Error during login:', error);
            setError(error.message);
        }
    };

    const logout = (options = {}) => {
        auth0Client?.logout({
            logoutParams: {
                returnTo: window.location.origin
            },
            ...options
        });
    };

    const getAccessToken = async (options = {}) => {
        try {
            if (!auth0Client) throw new Error('Auth0 client not initialized');
            
            const token = await auth0Client.getTokenSilently({
                authorizationParams: {
                    audience: 'https://dev-xgfoocqykomy345z.us.auth0.com/api/v2/',
                    scope: 'openid profile email read:users read:user_idp_tokens'
                },
                ...options
            });
            return token;
        } catch (error) {
            console.error('Error getting access token:', error);
            
            // If silent auth fails, redirect to login
            if (error.error === 'login_required' || error.error === 'consent_required') {
                await loginWithRedirect();
                return null;
            }
            
            throw error;
        }
    };

    const value = {
        isLoading,
        isAuthenticated,
        user,
        error,
        loginWithRedirect,
        logout,
        getAccessToken
    };

    return (
        <Auth0Context.Provider value={value}>
            {children}
        </Auth0Context.Provider>
    );
};
