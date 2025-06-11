# Contributing to Soundable API

Thank you for your interest in contributing to the Soundable API! This document outlines the steps to get started with the project, how to make changes, and how to submit your contributions.

## Getting started

You need to have [Bun](https://bun.sh/) installed to run the project. If you don't have it installed, you can follow the instructions on their [website](https://bun.sh/docs/installation).

```bash
# Clone the repository locally.
git clone https://github.com/SoundableHQ/API
cd API

# Install the dependencies.
bun install
```

Once all setup is done, you can run the project using the following command.

```bash
# Automatically watches for changes and restarts the server.
bun dev

# Runs the server without restarting.
bun start
```

## Making changes to the [database schema](./src/database/schema.ts)

If you're doing any changes to the database schema, you have to generate a new migration file. You can do this by running the following command:

```bash
bun run db:migration-gen
```

## Submitting changes

Once you have made your changes and tested them, you can open a pull request (PR) to the `main` branch of the repository. Please ensure that your PR includes the following.

- A clear description of the changes you made
- Any links to relevant issues or discussions
