# IDS Security Policy

Outlined in this document are the practices and policies that IDS applies to help ensure that we release stable/secure software, and react appropriately to security issues when they arise.

## Reporting Security Issues

If you need to report a security issue. Please use the [issue template](https://github.com/infor-design/enterprise/issues/new/choose), be careful not reveal any secure information and send that if needed on a private channel. We triage most issues by the next business day.

## Onboarding Developers

All new technical hires are introduced to our security policy as part of the onboarding process as outlined by the ISO (Infor Security Office)

## Internal Audits

Developers watch for security issues proactively. We have a dedicated security team (ISO) who perform ongoing penetration testing, code auditing, and other forms of security oversight. We use automated vulnerability scanning and code scanning tools in the github ecosystem. We also encourage and test the components so they will work with Content Security Policy (CSP).

## Storage of Data

No issues or comments in the repo should contain any private or secure information.

## Development Process

We have a well-defined, security-focused, development process:

No code goes into production unless it is reviewed by at least two other developers. The onus is on the reviewer to ask hard questions if they see any red flags for security. During the code-review process, if you see logic that's complicated and lacks a test, politely ask the developer for a test.

Any new code pushed to production is first thoroughly unit tested , e2e tested and QA tested in a staging environment. Mechanisms are in place for rolling back any changes that are pushed to production or patching fixes backwards to the previous version if needed.

Tests should not contain user-data, make sure to anonymize email addresses, usernames, etc.

## AntiVirus Software

By policy all our machines and servers must run AntiVirus software.
