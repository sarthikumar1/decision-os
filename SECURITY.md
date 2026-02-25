# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. Email the maintainers or use GitHub's private vulnerability reporting feature
3. Include a description of the vulnerability, steps to reproduce, and potential impact
4. Allow up to 72 hours for an initial response

## Security Practices

- **No secrets in code**: All sensitive values use environment variables
- **Input validation**: All user input is validated before processing
- **No server-side data**: MVP uses localStorage only (client-side)
- **Dependencies**: We regularly audit dependencies with `npm audit`
- **No external data fetching**: The app does not scrape or fetch external data
- **CSP headers**: Configured via Next.js middleware (when applicable)
- **XSS prevention**: React's default escaping + no `dangerouslySetInnerHTML`

## Dependency Updates

We use Dependabot (when configured) to keep dependencies up to date. Critical security patches are applied within 48 hours.
