# Release Process Documentation

This document outlines the release process for the eprompt-fe Tauri application.

## Overview

The project uses GitHub Actions to automate the creation of cross-platform installers for Windows and macOS. Releases can be triggered either manually or by pushing a git tag.

## Release Workflow Features

- ✅ **Manual trigger** via GitHub Actions UI or release script
- ✅ **Automatic trigger** on git tag push (v*.*.\*)
- ✅ **Cross-platform builds** (Windows x64, macOS x64, macOS ARM64)
- ✅ **Version synchronization** across package.json, Cargo.toml, and tauri.conf.json
- ✅ **Release notes** generation (manual or auto-generated from commits)
- ✅ **Asset uploads** (installers for each platform)
- ✅ **Pre-release support**
- ✅ **Duplicate release prevention**

## Quick Start

### Option 1: Using the Release Script (Recommended)

```bash
# Make sure you're on the main branch and have no uncommitted changes
git checkout main
git pull origin main

# Create a new release
./scripts/release.sh v1.0.0

# Create a pre-release
./scripts/release.sh --prerelease v1.0.0-beta.1

# Add custom release notes
./scripts/release.sh --notes "Major update with new features" v1.2.0

# Dry run to see what would happen
./scripts/release.sh --dry-run v1.0.0
```

### Option 2: Manual GitHub Actions Trigger

1. Go to the **Actions** tab in your GitHub repository
2. Select the **"Release Tauri App"** workflow
3. Click **"Run workflow"**
4. Fill in the required information:
   - **Version**: e.g., `v1.0.0`
   - **Release notes**: Optional custom notes
   - **Pre-release**: Check if this is a pre-release
5. Click **"Run workflow"**

### Option 3: Git Tag Push

```bash
# Update versions manually (package.json, Cargo.toml, tauri.conf.json)
# Commit the version changes
git add .
git commit -m "chore: bump version to v1.0.0"

# Create and push the tag
git tag v1.0.0
git push origin main
git push origin v1.0.0
```

## Release Artifacts

The workflow generates the following installers:

### Windows

- `eprompt-fe_1.0.0_x64_en-US.msi` - Windows Installer (MSI)
- `eprompt-fe_1.0.0_x64-setup.exe` - Windows Setup Executable

### macOS

- `eprompt-fe_1.0.0_aarch64.dmg` - macOS DMG for Apple Silicon (M1/M2)
- `eprompt-fe_1.0.0_x64.dmg` - macOS DMG for Intel processors
- `eprompt-fe_1.0.0_aarch64.app.tar.gz` - macOS App Bundle for Apple Silicon
- `eprompt-fe_1.0.0_x64.app.tar.gz` - macOS App Bundle for Intel

## Version Management

The release process automatically synchronizes versions across:

- `package.json` - npm package version
- `src-tauri/Cargo.toml` - Rust package version
- `src-tauri/tauri.conf.json` - Tauri app version

Version format: `major.minor.patch[-prerelease]` (e.g., `1.0.0`, `1.0.0-beta.1`)

## Release Notes

Release notes can be provided in two ways:

1. **Manual**: Specify custom notes when triggering the workflow
2. **Automatic**: Generated from commit messages since the last tag

## Prerequisites

### GitHub Secrets (Optional but Recommended)

For code signing and additional security:

```env
TAURI_PRIVATE_KEY     # Private key for update signature
TAURI_KEY_PASSWORD    # Password for the private key
```

### Local Development

- Node.js 18+
- Rust (latest stable)
- npm dependencies installed
- GitHub CLI (optional, for script automation)

## Troubleshooting

### Common Issues

#### 1. Release Already Exists

If a release already exists for the tag, the workflow will skip building to avoid duplicates.

**Solution**: Delete the existing release/tag or use a different version number.

#### 2. Version Mismatch

Ensure all version files are synchronized.

**Solution**: Use the release script which handles this automatically.

#### 3. Build Failures

Check the Actions logs for specific build errors.

**Common causes**:

- Missing dependencies
- Rust compilation errors
- Frontend build failures

#### 4. Permission Issues

Ensure the workflow has write permissions to create releases.

**Solution**: Check repository settings → Actions → General → Workflow permissions.

### Debugging

1. **Check workflow logs**: Go to Actions tab and review the failed job
2. **Test locally**: Run `npm run tauri:build` to test the build process
3. **Validate versions**: Ensure version formats are correct across all files

## Workflow Configuration

The release workflow is located at `.github/workflows/release.yml` and includes:

- **Rust caching** for faster builds
- **Cross-platform matrix** builds
- **Artifact uploading** to GitHub releases
- **Release publication** automation

### Customization

To modify the release process:

1. Edit `.github/workflows/release.yml`
2. Update build targets in the matrix strategy
3. Modify version update logic in the `update-version` job
4. Customize release notes generation

## Security Considerations

- Code signing certificates should be stored as GitHub Secrets
- Never commit private keys to the repository
- Use environment-specific secrets for different release channels
- Consider using GitHub Environments for additional protection

## Monitoring

After triggering a release:

1. Monitor the GitHub Actions workflow progress
2. Check that all platform builds complete successfully
3. Verify the release appears in the Releases section
4. Test download and installation of the generated installers

## Support

For issues with the release process:

1. Check this documentation
2. Review GitHub Actions logs
3. Consult [Tauri documentation](https://tauri.app/)
4. Open an issue in the repository
