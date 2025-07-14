# Printable Banners

[![Build Status](https://github.com/radicand/printable-banners/workflows/Build%20and%20Deploy/badge.svg)](https://github.com/radicand/printable-banners/actions)
[![PR Validation](https://github.com/radicand/printable-banners/workflows/Pull%20Request%20Validation/badge.svg)](https://github.com/radicand/printable-banners/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white)](https://bun.sh/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub release](https://img.shields.io/github/release/radicand/printable-banners.svg)](https://github.com/radicand/printable-banners/releases/)
[![GitHub issues](https://img.shields.io/github/issues/radicand/printable-banners.svg)](https://github.com/radicand/printable-banners/issues)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)

A web application for creating and customizing printable banners, built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Template System**: Choose from pre-built templates like "Welcome Home", "Congratulations", and "Happy Birthday"
- ✏️ **Text Customization**: Edit text, change fonts, colors, sizes, and positioning
- 🖨️ **Ink Saver Mode**: Optional outline-only rendering to save printer ink
- 📄 **Multi-page Support**: Create banners that span multiple landscape pages
- � **PDF Generation**: Download high-quality PDFs ready for printing with precise cross-page positioning
- 👁️ **PDF Preview**: Preview your banner PDF before downloading
- �🔧 **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js
- A modern web browser (Chrome, Safari, Firefox)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd printable-banners
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Start the development server:

   ```bash
   bun run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── core/                 # Core business logic
│   ├── banner/          # Banner model and utilities
│   └── template/        # Template system
├── components/          # React UI components
│   ├── editor/          # Banner editing interface
│   ├── templates/       # Template selection
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
└── utils/               # Utility functions

tests/
├── unit/                # Unit tests for core logic
├── integration/         # Component integration tests
└── e2e/                 # End-to-end tests (Playwright)
```

## Usage

### Creating a Banner

1. **Choose a Template**: Select from available templates or start with a blank banner
2. **Add Text**: Use the text input to add new text elements
3. **Customize**: Select text elements to edit their properties:
   - Text content
   - Font size and family
   - Color
   - Position and rotation
4. **Preview**: See real-time preview of your banner
5. **Print**: Use the print function to output your banner across multiple pages

### Ink Saver Mode

Toggle "Ink Saver Mode" to render text as outlines instead of filled text. This:

- Reduces ink consumption
- Speeds up printing
- Can create an appealing aesthetic effect

### Page Assembly

Banners are designed to be printed in landscape orientation on standard paper sizes (8.5"×11" by default). For larger banners:

1. Print all pages
2. Arrange pages in order
3. Tape or glue pages together to form the complete banner

## Development

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run E2E tests
bun run test:e2e
```

### Building for Production

```bash
bun run build
```

### Code Quality

```bash
# Lint code
bun run lint

# Format code
bun run format
```

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Runtime**: Bun (with Node.js compatibility)
- **Testing**: Bun test + Playwright

## Browser Support

- **Primary**: Chrome (full support)
- **Secondary**: Safari (best-effort compatibility)
- Modern browser features are used with progressive enhancement

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details on:

- Development workflow
- Code standards  
- Pull request process
- Project philosophy

Quick start for contributors:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Run tests: `bun test && bun run test:e2e`
5. Submit a pull request

For bug reports and feature requests, please use our [GitHub Issues](https://github.com/radicand/printable-banners/issues).

## Roadmap

### Phase 1 ✅

- [x] Basic banner model and text rendering
- [x] Core template system
- [x] Simple UI with text editing
- [x] Cross-page text positioning
- [x] Print preview functionality
- [x] Font scaling and page calculation

### Phase 2 ✅

- [x] Smart text sizing and positioning
- [x] Print positioning optimization
- [x] PDF export functionality with precise cross-page positioning
- [x] PDF preview functionality
- [x] PDF buffer generation for advanced use cases

### Phase 3 (Current)

- [ ] Font selection improvements
- [ ] Basic decorative elements
- [ ] Enhanced templates

### Phase 4 (Planned)

- [ ] Advanced decorative elements (flowers, borders)
- [ ] Custom page size configuration
- [ ] Print optimization enhancements

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=radicand/printable-banners&type=Date)](https://star-history.com/#radicand/printable-banners&Date)

## Acknowledgments

- Built following minimal core architecture principles
- Designed for extensibility and maintainability
- Focused on user experience and accessibility
