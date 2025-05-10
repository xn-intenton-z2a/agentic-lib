# GITHUB_APP_AUTH

## Crawl Summary
Three authentication flows with exact token types and use cases:  
1. GitHub App authentication uses RS256 JWT signed with your app’s private key to request installation tokens and manage app resources.  
2. Installation authentication uses an installation access token to act as the app on resources owned by the installing account, ideal for noninteractive automation.  
3. User authentication uses a user access token to act on behalf of a user, constrained by user permissions and ideal when user attribution is required.

## Normalised Extract
Table of Contents:
 1. Authentication Modes
   1.1 As GitHub App
   1.2 As App Installation
   1.3 On Behalf of User

1.1 As GitHub App
  • Token Type: JWT
  • Signing Algorithm: RS256
  • Use Cases: Generate installation access tokens; call REST endpoints to manage app registrations and installations.

1.2 As App Installation
  • Token Type: Installation Access Token
  • Issued For: specific installation_id
  • Use Cases: Automation workflows; resource access under the installing account; attribute actions to the app.

1.3 On Behalf of User
  • Token Type: User Access Token
  • Issued Via: web application or device flow
  • Use Cases: Constrain app actions to those permitted for a particular user; attribute actions to a user.

## Supplementary Details
Authentication as App: JWT header must include alg=RS256, typ=JWT; payload must set iat (issued at), exp (max 10 minutes after iat), iss (GitHub App ID).  
Installation Token: scoped to installation_id; bearer token in Authorization: "token <installation_token>" header.  
User Token: returned via OAuth flow; use in Authorization: "token <user_token>" header; expires or refresh per app config.

## Reference Details
API Endpoints & Patterns:
• Create JWT:
  - Sign header {"alg":"RS256","typ":"JWT"} and payload {"iat":<now>,"exp":<now+600>,"iss":<app_id>} with app private key.
• Request Installation Access Token:
  POST https://api.github.com/app/installations/{installation_id}/access_tokens
  Headers:
    Authorization: Bearer <jwt>
    Accept: application/vnd.github.v3+json
  Response: {"token":string,"expires_at":string}

• Use Installation Token:
  Authorization: token <installation_token>
  Example: GET /repos/{owner}/{repo}/issues with header Authorization: token <installation_token>

• Request User Token (Web Flow):
  1. Redirect user to https://github.com/login/oauth/authorize?client_id=<app_client_id>&scope=<scopes>
  2. Exchange code: POST https://github.com/login/oauth/access_token with client_id, client_secret, code
  3. Receive {access_token:string,token_type:bearer,scope:string}

Best Practices:
• Rotate JWT every 5 minutes.  
• Limit JWT exp to ≤10 minutes.  
• Use installation tokens for automation, never JWT directly to modify repository content.  
• Store private keys securely (e.g., AWS KMS, Vault).

Troubleshooting:
• Invalid JWT: check system clock skew <30 s.  
• 401 Unauthorized on installation token: verify installation_id and JWT has correct iss claim.  
• 403 Forbidden: ensure requested scopes/pat match installation permissions.

## Information Dense Extract
modes:app(jwtrs256,iat,exp≤600s,iss=app_id)→GET/POST /app/installations;installation(token)→acts on app-owned resources;user(token via OAuth)→acts on behalf. endpoints:POST /app/installations/{installation_id}/access_tokens auth:Bearer<JW T>→returns {token,expires_at}. use:Authorization:token<installation_token>. JWT gen:header{alg:RS256,typ:JWT},payload{iat,exp,iss}. user flow:redirect→/login/oauth/authorize?client_id=&scope=;exchange code→POST /login/oauth/access_token→{access_token}. best:rotate jwt5m,exp≤10m,store keys secure,installation tokens for repo changes. troubleshoot:clock skew<30s,verify iss,install permissions.

## Sanitised Extract
Table of Contents:
 1. Authentication Modes
   1.1 As GitHub App
   1.2 As App Installation
   1.3 On Behalf of User

1.1 As GitHub App
   Token Type: JWT
   Signing Algorithm: RS256
   Use Cases: Generate installation access tokens; call REST endpoints to manage app registrations and installations.

1.2 As App Installation
   Token Type: Installation Access Token
   Issued For: specific installation_id
   Use Cases: Automation workflows; resource access under the installing account; attribute actions to the app.

1.3 On Behalf of User
   Token Type: User Access Token
   Issued Via: web application or device flow
   Use Cases: Constrain app actions to those permitted for a particular user; attribute actions to a user.

## Original Source
GitHub Apps Authentication
https://docs.github.com/en/developers/apps/authenticating-with-github-apps

## Digest of GITHUB_APP_AUTH

# About Authentication with a GitHub App  (retrieved 2023-11-27)

## Authentication Modes

### 1. Authenticate as a GitHub App
Use a JSON Web Token (JWT) signed by your app’s private key (RS256).  
• Purpose: generate installation access tokens; manage app resources (list installations, update settings).  

### 2. Authenticate as an App Installation
Use an installation access token issued for a specific installation.  
• Purpose: attribute activity to the app; access resources owned by the installing account.  

### 3. Authenticate on Behalf of a User
Use a user access token created via the GitHub App user flow.  
• Purpose: attribute activity to an individual user; constrain actions to user permissions.

---

Attribution: GitHub Docs, Data Size: 611482 bytes, Links Found: 7242, Error: None

## Attribution
- Source: GitHub Apps Authentication
- URL: https://docs.github.com/en/developers/apps/authenticating-with-github-apps
- License: License: CC BY 4.0
- Crawl Date: 2025-05-10T03:33:28.520Z
- Data Size: 611482 bytes
- Links Found: 7242

## Retrieved
2025-05-10
