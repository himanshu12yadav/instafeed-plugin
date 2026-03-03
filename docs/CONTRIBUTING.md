# Contributing

Guidelines for contributing to the Shopify Instafeed App.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment: Copy `.env.example` to `.env`
4. Run locally: `npm run dev`

## Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add product search to Instagram posts
fix: resolve OAuth loop on scope change
docs: update deployment guide
refactor: simplify database helpers
```

## Code Standards

### Linting

Run before committing:
```bash
npm run lint
```

### Formatting

Prettier is configured. Most editors auto-format on save.

### File Structure

- Routes in `app/routes/` following Remix conventions
- Components in `app/components/`
- Database functions in `app/db.server.js`
- Shared utilities in `app/lib/` (create if needed)

### Component Guidelines

- Use Shopify Polaris components for UI
- Props should be typed (JSDoc or TypeScript)
- Include error boundaries for routes

## Pull Request Process

1. Create feature branch from `main`
2. Make changes with clear commits
3. Test locally with `npm run dev`
4. Run lint: `npm run lint`
5. Create PR with description
6. Address review comments
7. Merge after approval

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactor

## Testing
How were changes tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Documentation updated
- [ ] No new warnings
```

## Testing

### Manual Testing Checklist

- [ ] App installs correctly
- [ ] Instagram OAuth works
- [ ] Posts are fetched and stored
- [ ] Post selection works
- [ ] Product linking works
- [ ] Theme block displays correctly
- [ ] Webhooks process correctly
- [ ] Subscription flow works

### Testing Webhooks

```bash
shopify app webhook trigger --topic APP_UNINSTALLED
```

## Documentation

Update docs when:
- Adding new features
- Changing API routes
- Modifying database schema
- Updating configuration

Documentation lives in `docs/` folder.

## Questions?

Open an issue for:
- Bug reports
- Feature requests
- Questions about the codebase
