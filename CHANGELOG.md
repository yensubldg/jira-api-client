# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - Unreleased

### Added
- Support for dual authentication methods:
  - Bearer token authentication (recommended)
  - Basic authentication with email/password
- Comprehensive documentation for both authentication methods in README
- Security considerations section in README
- CHANGELOG.md file to track changes

### Changed
- Updated BaseApiClient to automatically detect and use the appropriate authentication method
- Improved test coverage for authentication methods

## [1.0.2] - 2024-03-08

### Added
- Initial public release
- Support for Jira REST API v3
- Issue management (CRUD operations)
- Comment management
- Transition management
- Project management
- User management
- Pagination utilities
- Error handling utilities
- TypeScript type definitions
- Comprehensive documentation
- Test suite

[1.0.3]: https://github.com/yensubldg/jira-api-client/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/yensubldg/jira-api-client/releases/tag/v1.0.2 