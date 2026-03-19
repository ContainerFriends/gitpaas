# Contributing to GitPaaS

Thanks for your interest in contributing to **GitPaaS** — a self-hosted PaaS for Docker Swarm, GitOps-driven, inspired by ArgoCD.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Before You Start](#before-you-start)
- [Local Development Setup](#local-development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Submitting Changes](#submitting-changes)
- [Code Standards](#code-standards)
- [Commit Convention](#commit-convention)
- [Reporting Issues](#reporting-issues)

---

## Project Overview

GitPaaS watches Git repositories and reconciles the desired state (defined in your repo) with the actual state of your Docker Swarm cluster — continuously, automatically, and declaratively.

Core concepts:
- **App** — a Git repo + target Swarm stack mapping
- **Reconciler** — the control loop that diffs and applies state
- **Agent** — runs on Swarm managers, executes `docker stack deploy`
- **UI/API** — dashboard and REST/WebSocket interface

---

## Before You Start

- Check open [issues](../../issues) and [PRs](../../pulls) to avoid duplicating effort.
- For significant changes, open an issue first to discuss the approach.
- Read the [Architecture doc](./docs/architecture.md) if you plan to touch the reconciler or agent.

---

## Local development setup

### Requirements

| Tool    | Minimum version              |
|---------|------------------------------|
| Docker  | 24.x with Swarm mode enabled |
| Node.js | 24.14.0                      |

### 1. Clone and configure

```bash
git clone https://github.com/your-org/gitpaas.git
cd gitpaas
cp packages/setup/.env.example packages/setup/.env
cp apps/backend/.env.example apps/backend/.env
```

In the backend environment variables, you must modify the `DEVELOPMENT_SERVER_URL` property and enter your tunneled URL so that the GitHub App can communicate with your machine.

### 3. Run setup package

```bash
npm run setup
```

### 3. Start applications

```bash
npm run dev:backend
npm run dev:github-installer
```

This command launches the applications in development mode to simulate the behavior of the server where GitPaaS is running.

---

## Development workflow

Once the stack has been installed in your environment and the applications are up and running, follow these guidelines to simulate certain system workflows:

### Installing the GitHub App

In a production environment, when the user runs the `install.sh` installation script, it returns a URL to install the GitHub App if it does not already exist on the system. To replicate this process locally:

1. Make a request to the backend at the path `http://localhost:4000/v1/health?token=random-token-for-setup`, where the **token** must be the one you defined in the `SETUP_TOKEN` environment variable.

2. The backend will return a JSON response containing a URL for the GitHub Installer app. This URL must be opened in a browser (make sure the GitHub Installer app is running).

---

## Contributing workflow

1. **Fork** the repo and create a branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes.** Keep commits focused and atomic.

3. **Test locally** — unit tests must pass, and if your change touches reconciliation or Swarm interaction, e2e tests must pass too.

4. **Lint** before pushing:
   ```bash
   make lint
   ```

5. **Push** and open a Pull Request against `main`.

---

## Submitting Changes

### Pull Request checklist

- [ ] Branch is up to date with `main`
- [ ] All tests pass (`make test`)
- [ ] Linter passes (`make lint`)
- [ ] New behavior is covered by tests
- [ ] Docs updated if needed (new config, new API endpoint, changed behavior)
- [ ] PR description explains *what* and *why*, not just *what*

### PR size

Keep PRs small and focused. Large refactors should be discussed in an issue first and may be split into multiple PRs.

---

## Code Standards

- **Go**: follow standard Go conventions (`gofmt`, `golangci-lint`). Errors must be handled — no bare `_` ignores for errors.
- **UI**: ESLint + Prettier enforced via pre-commit hooks.
- **No secrets in code**: use `.env` and the documented config system.
- **Feature flags**: experimental features should be behind a config flag, not merged as always-on.

---

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(optional scope): short description

feat(reconciler): add retry backoff on stack deploy failure
fix(api): return 404 when app not found instead of 500
docs: update local dev setup instructions
chore: bump Go to 1.22
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`

---

## Reporting Issues

Use GitHub Issues. Include:
- GitPaaS version / commit SHA
- Docker and Swarm version
- Steps to reproduce
- Expected vs actual behavior
- Relevant logs (`docker service logs gitpaas_api`)

For security vulnerabilities, **do not open a public issue** — email `security@your-org.com` instead.

---

## Questions?

Open a [Discussion](../../discussions) or drop a message in `#gitpaas-dev` on our community Slack.
