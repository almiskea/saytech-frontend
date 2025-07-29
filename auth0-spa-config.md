# Auth0 SPA Configuration Guide

## Auth0 Dashboard Configuration

### 1. Application Settings
Your Auth0 application should be configured as a **Single Page Application (SPA)**:

- **Application Type**: Single Page Application
- **Token Endpoint Authentication Method**: None (for SPAs)
- **Allowed Callback URLs**: `http://localhost:3000, https://yourdomain.com`
- **Allowed Logout URLs**: `http://localhost:3000, https://yourdomain.com`
- **Allowed Web Origins**: `http://localhost:3000, https://yourdomain.com`

### 2. Authorize Management API Access
Since you're using the Auth0 Management API, you need to authorize your application:

1. Go to **Applications** → **APIs** tab
2. Find **Auth0 Management API**
3. Click **Authorize** next to your application
4. Grant these scopes:
   - `read:users` - Read user information
   - `read:user_idp_tokens` - Read user identity provider tokens

### 3. Grant Types
Ensure your SPA application has these grant types enabled:
- ✅ Authorization Code
- ✅ Refresh Token
- ❌ Implicit (not needed for SPA)
- ❌ Client Credentials (not for SPAs)

## Backend Configuration

### Environment Variables
Add these to your backend environment:

```env
AUTH0_DOMAIN=dev-xgfoocqykomy345z.us.auth0.com
AUTH0_AUDIENCE=https://dev-xgfoocqykomy345z.us.auth0.com/api/v2/
AUTH0_ISSUER=https://dev-xgfoocqykomy345z.us.auth0.com/
```

### JWT Validation Middleware (Example for Node.js/Express)

```javascript
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    audience: process.env.AUTH0_AUDIENCE,
    issuer: process.env.AUTH0_ISSUER,
    algorithms: ['RS256']
});

// Apply to protected routes
app.use('/api/requests', jwtCheck);
```

### Java Spring Boot Example

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Value("${auth0.audience}")
    private String audience;
    
    @Value("${auth0.domain}")
    private String domain;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(authz -> authz
            .requestMatchers("/api/requests/**").authenticated()
            .anyRequest().permitAll())
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .decoder(jwtDecoder())
                    .jwtAuthenticationConverter(jwtAuthenticationConverter())
                )
            );
        return http.build();
    }
    
    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder
            .withJwkSetUri("https://" + domain + "/.well-known/jwks.json")
            .build();
    }
}
```

## Testing the Setup

1. **Login Flow**: User clicks login → redirected to Auth0 → enters credentials → redirected back
2. **Token Verification**: Backend receives JWT token in Authorization header
3. **Token Validation**: Backend validates token against Auth0's public keys
4. **API Access**: Authenticated requests can access protected endpoints

## Troubleshooting

### Common Issues:

1. **"access_denied" error**: Usually means audience mismatch
2. **CORS errors**: Add your frontend URL to Auth0 Allowed Origins
3. **Token expired**: Implement token refresh in your frontend
4. **Invalid signature**: Check if backend is using correct JWKS URL

### Debug Steps:

1. Check browser network tab for Auth0 requests
2. Verify JWT token at jwt.io
3. Check backend logs for detailed error messages
4. Ensure Auth0 domain and audience match exactly

## Frontend Configuration Summary

Your React app is now configured with:
- ✅ SPA-specific Auth0 client settings
- ✅ Token caching in localStorage
- ✅ Refresh token support
- ✅ Proper audience for your backend API
- ✅ Graceful error handling for auth failures

The frontend will automatically handle login redirects and token management for you!
