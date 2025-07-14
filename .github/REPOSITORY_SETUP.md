# GitHub Repository Configuration

This repository uses the following GitHub settings for optimal collaboration:

## Branch Protection Rules

### Main Branch (`main`)
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
  - ✅ `validate-pr` workflow must pass
  - ✅ All unit tests must pass
  - ✅ All E2E tests must pass
  - ✅ Linting must pass
  - ✅ Build must succeed
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ✅ Dismiss stale reviews when new commits are pushed
- ❌ Allow force pushes (disabled for safety)
- ❌ Allow deletions (disabled for safety)

## Repository Settings

### General
- **Default branch**: `main`
- **Issue templates**: Enabled
- **Discussions**: Disabled (using Issues for now)
- **Wiki**: Disabled (using docs/ folder)
- **Projects**: Disabled (using Issues/Milestones)

### Security
- **Vulnerability alerts**: Enabled
- **Dependabot alerts**: Enabled
- **Dependabot security updates**: Enabled
- **Dependabot version updates**: Enabled (configured in `.github/dependabot.yml`)
- **Code scanning**: Enabled (Trivy via GitHub Actions)

### Merge Settings
- **Allow merge commits**: ✅ Enabled (with clean history)
- **Allow squash merging**: ✅ Enabled (default for PRs)
- **Allow rebase merging**: ✅ Enabled
- **Automatically delete head branches**: ✅ Enabled

## Recommended Repository Setup

To configure these settings for your forked repository:

1. Go to **Settings** → **Branches**
2. Add branch protection rule for `main`
3. Configure the settings as listed above
4. Go to **Settings** → **General** → **Pull Requests**
5. Configure merge settings as listed above

## Required Status Checks

The following GitHub Actions workflows must pass:
- `.github/workflows/pr-validation.yml`
- Any additional CI checks you configure

## Labels

Recommended labels for issue management:
- `bug` - Something isn't working
- `enhancement` - New feature or request  
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority: high` - High priority issue
- `priority: low` - Low priority issue
- `question` - Further information is requested
- `wontfix` - This will not be worked on
