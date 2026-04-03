# Contributing to NihonGO

Thank you for your interest in contributing to NihonGO. As a production-focused commercial project, we maintain strict quality standards and legal requirements for all contributions.

## Intellectual Property & Contributor License Agreement (CLA)

By contributing to this repository, you agree to transfer all rights, title, and interest in and to your contributions to the project owners. You acknowledge that your contributions may be used in commercial, subscription-based products.

## Development Workflow

1.  **Branch Strategy**: Permanent branches are `main` (production) and `develop` (staging). Features should be built on `feat/` or `fix/` branches.
2.  **Linting**: Ensure all code passes `npm run lint` with zero errors or warnings.
3.  **Tests**: New features must include comprehensive unit tests using Vitest.
4.  **Resilience**: Follow the established distributed architecture patterns (idempotency, offline-first, backpressure).

## Pull Request Guidelines

- **Atomic Commits**: Keep commits focused and logically grouped.
- **Documentation**: Update relevant markdown files and inline comments if logic changes.
- **Review**: All PRs require at least one approval from a lead maintainer.
- **CI**: Checks must be green before merging.

## Reporting Issues

Please use the provided issue templates for bug reports or feature requests. For security vulnerabilities, please refer to the [Security Policy](SECURITY.md).
