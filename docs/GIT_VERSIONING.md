# Git Versioning Guide

This document explains how to use Git tags for version control and how to revert to stable versions when needed.

## Available Stable Versions

- `v1.0.0-stable`: Initial stable version with working authentication and items management
  - Features:
    - User authentication with localStorage
    - Items CRUD operations
    - Toast notifications
    - Dashboard functionality
    - Error handling

## Viewing Available Tags

To see all available tagged versions:

```bash
git tag -l
```

To see details of a specific tag:

```bash
git tag show v1.0.0-stable
```

## Reverting to a Stable Version

If you encounter issues and need to revert to a stable version, follow these steps:

### Option 1: Direct Checkout

1. Save your current changes (if needed):
   ```bash
   git stash
   ```

2. Checkout the stable version:
   ```bash
   git checkout v1.0.0-stable
   ```

### Option 2: Create New Branch from Stable Version

This is useful if you want to start fresh while keeping your current changes in a different branch:

1. Save your current changes:
   ```bash
   git stash
   ```

2. Create and checkout a new branch from the stable version:
   ```bash
   git checkout -b new-branch-name v1.0.0-stable
   ```

3. (Optional) Apply your saved changes:
   ```bash
   git stash pop
   ```

## Dependencies Management

When reverting to a stable version:

1. The `package.json` and `package-lock.json` files will be restored to their state at that version
2. If your `node_modules` directory is intact and matches the package files, no action is needed
3. If you experience any issues, run:
   ```bash
   npm install
   ```

## Creating New Stable Versions

When you have a new stable state that you want to tag:

1. Add your changes:
   ```bash
   git add .
   ```

2. Create a descriptive commit:
   ```bash
   git commit -m "feat: description of changes

   Detailed description of:
   - What was changed
   - Why it was changed
   - Any breaking changes"
   ```

3. Create a new tag:
   ```bash
   git tag -a v1.x.x-stable -m "Description of this stable version"
   ```

4. (Optional) Push tags to remote:
   ```bash
   git push origin v1.x.x-stable
   ```

## Best Practices

1. Always create descriptive commit messages
2. Use semantic versioning for tags (v1.0.0, v1.1.0, etc.)
3. Add `-stable` suffix to tags that represent stable versions
4. Include detailed messages when creating tags
5. Test the application after reverting to ensure everything works as expected

## Troubleshooting

If you encounter issues after reverting:

1. Check if you have the correct Node.js version
2. Verify that all environment variables are set correctly
3. Try removing `node_modules` and running `npm install`
4. Make sure your database schema matches the version you reverted to

## Database Management

When reverting to a previous version:

1. Check the Prisma schema version
2. Run migrations if needed:
   ```bash
   npx prisma migrate reset
   npx prisma generate
   npx prisma db push
   ```

## Contact

If you encounter any issues or need help with version management, please contact the development team.
