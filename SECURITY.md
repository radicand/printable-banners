# Security Policy

## Supported Versions

We currently support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Printable Banners, please report it responsibly:

### For Critical Vulnerabilities

For critical security issues (remote code execution, data leaks, etc.), please:

1. **DO NOT** create a public GitHub issue
2. Email the maintainer directly (check GitHub profile for contact)
3. Include a detailed description of the vulnerability
4. Provide steps to reproduce if possible
5. Wait for a response before public disclosure

### For Non-Critical Issues

For non-critical security concerns, you may:

1. Create a private security advisory on GitHub
2. Use the issue template with the "Security concern" category
3. Mark the issue as sensitive if needed

## Security Best Practices

When contributing to the project:

- **Dependencies**: Keep dependencies updated and audit regularly
- **Input Validation**: Sanitize user inputs (text, file uploads)
- **XSS Prevention**: Use React's built-in XSS protection
- **Data Handling**: Don't store sensitive user data locally
- **Build Security**: Verify build artifacts and deployment pipeline

## Response Timeline

- **Acknowledgment**: Within 24 hours
- **Initial Assessment**: Within 72 hours  
- **Status Updates**: Weekly until resolved
- **Resolution**: Depends on severity (critical issues prioritized)

Thank you for helping keep Printable Banners secure!
