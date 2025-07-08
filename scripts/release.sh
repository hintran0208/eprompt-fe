#!/bin/bash

# Release helper script for eprompt-fe
# This script helps create releases for the Tauri application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Help function
show_help() {
    echo "Usage: $0 [OPTIONS] <version>"
    echo ""
    echo "Create a new release for the eprompt-fe Tauri application"
    echo ""
    echo "Arguments:"
    echo "  version           Version number (e.g., v1.0.0, 1.2.3)"
    echo ""
    echo "Options:"
    echo "  -h, --help        Show this help message"
    echo "  -p, --prerelease  Mark as pre-release"
    echo "  -n, --notes       Release notes (optional)"
    echo "  -d, --dry-run     Show what would be done without making changes"
    echo ""
    echo "Examples:"
    echo "  $0 v1.0.0"
    echo "  $0 --prerelease v1.0.0-beta.1"
    echo "  $0 --notes \"Major update with new features\" v1.2.0"
    echo ""
}

# Parse arguments
PRERELEASE=false
RELEASE_NOTES=""
DRY_RUN=false
VERSION=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -p|--prerelease)
            PRERELEASE=true
            shift
            ;;
        -n|--notes)
            RELEASE_NOTES="$2"
            shift 2
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -*)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
        *)
            if [[ -z "$VERSION" ]]; then
                VERSION="$1"
            else
                print_error "Too many arguments"
                show_help
                exit 1
            fi
            shift
            ;;
    esac
done

# Validate version argument
if [[ -z "$VERSION" ]]; then
    print_error "Version argument is required"
    show_help
    exit 1
fi

# Normalize version (add v prefix if missing)
if [[ ! "$VERSION" =~ ^v ]]; then
    VERSION="v$VERSION"
fi

# Validate version format
if [[ ! "$VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.-]+)?$ ]]; then
    print_error "Invalid version format. Expected: v1.2.3 or v1.2.3-beta.1"
    exit 1
fi

print_header "Release Configuration"
echo "Version: $VERSION"
echo "Pre-release: $PRERELEASE"
echo "Release notes: ${RELEASE_NOTES:-"(will be auto-generated)"}"
echo "Dry run: $DRY_RUN"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository"
    exit 1
fi

# Check if working directory is clean
if [[ -n $(git status --porcelain) ]]; then
    print_warning "Working directory has uncommitted changes"
    if [[ "$DRY_RUN" == "false" ]]; then
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
fi

# Check if tag already exists
if git rev-parse "$VERSION" >/dev/null 2>&1; then
    print_error "Tag $VERSION already exists"
    exit 1
fi

# Check if we have the GitHub CLI
if ! command -v gh &> /dev/null; then
    print_warning "GitHub CLI (gh) not found. You'll need to trigger the release manually."
    MANUAL_TRIGGER=true
else
    MANUAL_TRIGGER=false
fi

print_header "Pre-flight Checks"
print_success "Version format is valid"
print_success "Git repository detected"
print_success "Tag $VERSION is available"

if [[ "$DRY_RUN" == "true" ]]; then
    print_header "Dry Run - Would Execute"
    echo "1. Update package.json version to ${VERSION#v}"
    echo "2. Update src-tauri/Cargo.toml version to ${VERSION#v}"
    echo "3. Update src-tauri/tauri.conf.json version to ${VERSION#v}"
    echo "4. Commit version changes"
    echo "5. Create and push tag $VERSION"
    if [[ "$MANUAL_TRIGGER" == "false" ]]; then
        echo "6. Trigger GitHub Actions workflow for release"
    else
        echo "6. Manual workflow trigger required"
    fi
    exit 0
fi

print_header "Creating Release"

# Update package.json
print_success "Updating package.json version"
npm version "${VERSION#v}" --no-git-tag-version

# Update Cargo.toml
print_success "Updating Cargo.toml version"
sed -i.bak "s/^version = \".*\"/version = \"${VERSION#v}\"/" src-tauri/Cargo.toml
rm -f src-tauri/Cargo.toml.bak

# Update tauri.conf.json
print_success "Updating tauri.conf.json version"
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/\"version\": \".*\"/\"version\": \"${VERSION#v}\"/" src-tauri/tauri.conf.json
else
    sed -i "s/\"version\": \".*\"/\"version\": \"${VERSION#v}\"/" src-tauri/tauri.conf.json
fi

# Commit changes
print_success "Committing version changes"
git add package.json src-tauri/Cargo.toml src-tauri/tauri.conf.json package-lock.json 2>/dev/null || true
git commit -m "chore: bump version to $VERSION"

# Create and push tag
print_success "Creating and pushing tag $VERSION"
git tag "$VERSION"
git push origin HEAD
git push origin "$VERSION"

# Trigger GitHub Actions workflow
if [[ "$MANUAL_TRIGGER" == "false" ]]; then
    print_success "Triggering GitHub Actions release workflow"
    
    # Prepare workflow inputs
    WORKFLOW_INPUTS="version=$VERSION"
    if [[ -n "$RELEASE_NOTES" ]]; then
        WORKFLOW_INPUTS="$WORKFLOW_INPUTS,release_notes=$RELEASE_NOTES"
    fi
    if [[ "$PRERELEASE" == "true" ]]; then
        WORKFLOW_INPUTS="$WORKFLOW_INPUTS,prerelease=true"
    fi
    
    gh workflow run release.yml --field "$WORKFLOW_INPUTS"
    
    print_header "Release Initiated"
    print_success "GitHub Actions workflow triggered"
    echo "Monitor progress at: https://github.com/$(gh repo view --json owner,name -q '.owner.login + "/" + .name")')/actions"
else
    print_header "Manual Action Required"
    print_warning "GitHub CLI not available"
    echo "Go to GitHub Actions and manually trigger the 'Release Tauri App' workflow with:"
    echo "  Version: $VERSION"
    if [[ -n "$RELEASE_NOTES" ]]; then
        echo "  Release notes: $RELEASE_NOTES"
    fi
    if [[ "$PRERELEASE" == "true" ]]; then
        echo "  Pre-release: true"
    fi
fi

print_header "Release Summary"
echo "🏷️  Tag: $VERSION"
echo "📝 Commit: $(git rev-parse --short HEAD)"
echo "🌐 Repository: $(git config --get remote.origin.url)"
echo ""
print_success "Release process initiated successfully!"
