#!/bin/bash

# Playwright Test Runner Script for Printable Banners

echo "🎭 Printable Banners - Playwright Test Suite"
echo "============================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to run tests with specific configuration
run_tests() {
    local project=$1
    local description=$2
    
    echo -e "\n${YELLOW}Running $description tests...${NC}"
    echo "Command: bun run test:e2e --project=$project"
    
    if bun run test:e2e --project=$project; then
        echo -e "${GREEN}✅ $description tests passed!${NC}"
        return 0
    else
        echo -e "${RED}❌ $description tests failed!${NC}"
        return 1
    fi
}

# Function to show test options
show_options() {
    echo -e "\n${YELLOW}Available test options:${NC}"
    echo "1. run_tests chromium 'Chrome Desktop'"
    echo "2. run_tests webkit 'Safari Desktop'"
    echo "3. run_tests 'Mobile Chrome' 'Mobile Chrome'"
    echo "4. run_tests 'Mobile Safari' 'Mobile Safari'"
    echo "5. bun run test:e2e (all tests)"
    echo "6. bun run test:e2e:ui (interactive UI)"
    echo ""
    echo "Example usage:"
    echo "  ./scripts/test-e2e.sh chromium"
    echo "  ./scripts/test-e2e.sh all"
}

# Main execution
case "$1" in
    "chromium")
        run_tests "chromium" "Chrome Desktop"
        ;;
    "webkit")
        run_tests "webkit" "Safari Desktop"
        ;;
    "mobile-chrome")
        run_tests "Mobile Chrome" "Mobile Chrome"
        ;;
    "mobile-safari")
        run_tests "Mobile Safari" "Mobile Safari"
        ;;
    "all")
        echo -e "${YELLOW}Running all tests...${NC}"
        bun run test:e2e
        ;;
    "ui")
        echo -e "${YELLOW}Opening Playwright UI...${NC}"
        bun run test:e2e:ui
        ;;
    "help"|"--help"|"-h"|"")
        show_options
        ;;
    *)
        echo -e "${RED}Unknown option: $1${NC}"
        show_options
        exit 1
        ;;
esac
