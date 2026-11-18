# Boosting Haven — Production Security & Anti-DDoS Architecture

This document outlines the multi-layered defense-in-depth security architecture implemented for Boosting Haven to protect against **DDoS attacks, brute force attempts, credential stuffing, clickjacking, and web vulnerabilities**.

---

## 1. Application-Layer Anti-DDoS & Rate Limiting (Implemented in Backend)

The ASP.NET Core Web API implements native .NET 10 rate limiting partitioned by client IP (with automatic recognition of `CF-Connecting-IP` and `X-Forwarded-For` from reverse proxies and CDNs):

### Configured Policies:

| Policy | Scope | Limit | Protection |
| :--- | :--- | :--- | :--- |
| **Global Limiter** | All incoming API requests | 150 requests / min / IP | Mitigates volumetric HTTP flood / slowloris bursts |
| **`AuthRateLimit`** | `/api/auth/*` (Login, Register, Callback) | 12 requests / min / IP | Blocks brute-force password guessing & credential stuffing |
| **`OrdersRateLimit`** | `/api/orders/*` (Create, Checkout, Sessions) | 25 requests / min / IP | Stops bot order spam, inventory exhaustion, and fake checkout floods |

When a client breaches these thresholds, the server returns:
- **HTTP 429 Too Many Requests**
- Header: `Retry-After: 60`
- JSON payload: `{"error": "Too Many Requests", "message": "Anti-DDoS Shield: Rate limit exceeded...", "statusCode": 429}`

---

## 2. Server Resource Hardening (Kestrel Web Server)

To protect the server against memory exhaustion and buffer overflow attacks:

- **`AddServerHeader = false`**: Strips server fingerprinting headers (`Server: Kestrel`), preventing automated scanners from profiling server versions.
- **`MaxRequestBodySize = 10 MB`**: Rejects oversized payloads that attempt to exhaust server RAM.
- **`MaxRequestHeaderCount = 64`** & **`MaxRequestHeadersTotalSize = 32 KB`**: Prevents HTTP header flood attacks.
- **`KeepAliveTimeout = 2 minutes`** & **`RequestHeadersTimeout = 30 seconds`**: Prevents Slowloris attacks (hanging open connections without sending headers).

---

## 3. OWASP Security Headers (API & Edge)

Configured in `Program.cs`, `vercel.json`, and `index.html`:

- **`X-Content-Type-Options: nosniff`**: Prevents MIME-sniffing attacks.
- **`X-Frame-Options: SAMEORIGIN`**: Protects against clickjacking and UI redressing.
- **`X-XSS-Protection: 1; mode=block`**: Activates browser reflective XSS filters.
- **`Referrer-Policy: strict-origin-when-cross-origin`**: Prevents leaking sensitive URL paths in referrers.
- **`Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`**: Restricts access to device hardware APIs.
- **`Strict-Transport-Security (HSTS)`**: Enforces HTTPS encryption across all subdomains.

---

## 4. Production Edge DDoS Protection (Cloudflare Setup Guide)

While application-level rate limiting stops application-layer abuse, volumetric network-layer (L3/L4/L7 multi-gigabit) DDoS attacks should be mitigated at the edge before hitting the origin server.

### Recommended Cloudflare Configuration:

1. **Proxy Status (Orange Cloud)**:
   - In Cloudflare DNS settings, ensure all `A` / `CNAME` records for your domain are set to **Proxied (Orange Cloud)**.
   - This hides your real server IP and routes all traffic through Cloudflare’s global Anycast network.

2. **Cloudflare WAF & DDoS Shield**:
   - Navigate to **Security → DDoS**: Ensure **HTTP DDoS Attack Protection** is set to **High**.
   - Navigate to **Security → Settings**: In the event of an active high-volume attack, enable **Under Attack Mode** (presents a brief JS challenge to verify real users).

3. **Cloudflare Rate Limiting Rules**:
   - Create a WAF Rate Limiting rule on `/api/auth/*` and `/api/orders/*` with a 10-second block duration for IPs exceeding normal traffic.

4. **Origin IP Cloaking & Firewall**:
   - Configure your origin server's hosting firewall (e.g. Windows Firewall, AWS Security Group, Azure NSG) to **only allow inbound ports 80/443 from Cloudflare IP ranges** ([https://www.cloudflare.com/ips/](https://www.cloudflare.com/ips/)). This ensures attackers cannot bypass Cloudflare by sending traffic directly to the origin IP.

---

## 5. Database & Injection Defense

- **Entity Framework Core Parameterization**: All SQL queries use parameterized queries to prevent SQL injection.
- **Input Validation**: All client inputs across authentication and order controllers are strictly typed and validated before database persistence.
