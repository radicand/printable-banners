# Contributing to Printable Banners

Thank you for your interest in contributing to Printable Banners! This project follows a **minimal core architecture** philosophy, focusing on simplicity and maintainability.

## Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/printable-banners.git
   cd printable-banners
   ```
3. **Install dependencies**:
   ```bash
   bun install
   ```
4. **Start development server**:
   ```bash
   bun run dev
   ```
5. **Run tests** to ensure everything works:
   ```bash
   bun test
   bun run test:e2e
   ```

## Development Workflow

### Making Changes

1. **Create a feature branch** from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards:
   - Write clear, self-documenting code
   - Follow TypeScript best practices
   - Use Tailwind CSS for styling
   - Maintain the minimal core philosophy

3. **Add tests** for new functionality:
   - Unit tests for core logic in `tests/unit/`
   - E2E tests for user-facing features in `tests/e2e/`
   - Ensure browser-dependent features are tested via E2E, not unit tests

4. **Run the full test suite**:

   ```bash
   bun test          # Unit tests
   bun run test:e2e  # E2E tests
   bun run lint      # Code linting
   bun run build     # Production build
   ```

5. **Commit your changes** with a clear message:

   ```bash
   git commit -m "feat: add new banner template system"
   ```

6. **Push to your fork** and **create a pull request**

### Code Standards

- **TypeScript**: Use strict typing, avoid `any`
- **React**: Functional components with hooks
- **Testing**: Write tests for new features; maintain existing test coverage
- **Accessibility**: Follow WCAG guidelines for UI components
- **Performance**: Prioritize simplicity over premature optimization

## Pull Request Guidelines

### Before Submitting

- [ ] Tests pass locally (`bun test && bun run test:e2e`)
- [ ] Code follows project style (`bun run lint`)
- [ ] Build succeeds (`bun run build`)
- [ ] Changes are documented (README, comments, etc.)
- [ ] PR addresses a single concern (no unrelated changes)

### PR Requirements

1. **Clear title and description** explaining what and why
2. **Reference related issues** if applicable
3. **Include screenshots** for UI changes
4. **All CI checks must pass** before merging
5. **Maintain backward compatibility** unless explicitly breaking

### What We Look For

✅ **Good contributions:**

- Bug fixes with test cases
- Performance improvements with benchmarks
- New templates that follow existing patterns
- Documentation improvements
- Accessibility enhancements

❌ **Contributions we might decline:**

- Features that violate minimal core principles
- Complex abstractions without clear benefits
- Breaking changes without migration path
- Code without tests
- Changes that significantly increase bundle size

## Project Philosophy

### Minimal Core Principles

- **Simplicity over complexity**: Prefer straightforward solutions
- **Performance through simplicity**: Avoid premature optimization
- **Testable design**: Write code that's easy to test
- **User-focused**: Prioritize user experience over developer convenience
- **Maintainable**: Code should be readable and modifiable

### Technical Decisions

- **Bun runtime**: For performance, but maintain Node.js compatibility
- **React + TypeScript**: Type safety and component reusability
- **Tailwind CSS**: Utility-first styling for consistency
- **Playwright E2E**: Real browser testing for critical user flows

## Getting Help

- **Documentation**: Check the [README](./README.md) first
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Code Review**: Maintainer will provide feedback on PRs

## Maintainer Notes

This is a **single-maintainer project**. Please be patient with review times. Quality over speed is prioritized to maintain the project's integrity.

## Recognition

Contributors will be acknowledged in:

- README contributor section (coming soon)
- Release notes for significant contributions
- GitHub contributor graphs

---

**Ready to contribute?** Start by looking at issues labeled `good first issue` or `help wanted`.

Thank you for helping make Printable Banners better! 🎉
