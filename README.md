# Love AI

Love AI is an AI-powered character companion web application inspired by platforms like Character.AI.

The project focuses on personality-driven conversations, custom AI characters, immersive roleplay interactions, and a modern responsive user experience.

It was built as a full-stack AI SaaS-style application using Next.js, PostgreSQL, Better Auth, OpenRouter, and modern web technologies.

> Note: Payment gateway integration is not included yet. The current version focuses on authentication, character creation, AI conversations, media handling, and core product experience.

---

## Live Demo

Demo:
https://love-ai-demo.vercel.app

---

## Overview

Love AI allows users to discover, create, and chat with AI-powered characters that have their own personalities, backgrounds, and conversation styles.

Users can create fictional characters by defining:

- Character name
- Age
- Gender
- Character image
- Description
- Backstory
- First message
- Personality and conversation context

The AI then uses this information to maintain character-driven conversations.

The application is designed as a portfolio-grade AI product that demonstrates both frontend product development and backend AI integration.

---

## Key Features

### AI Character Chat

Users can chat with AI characters that respond based on their personality, background, and predefined context.

The application uses OpenRouter for model access and Hermes 3 Instruct as the current AI model.

### Custom Character Creation

Users can create their own AI characters with:

- Profile image
- Name
- Age
- Gender
- Description
- Backstory
- First message
- Character personality

This allows each AI character to behave differently during conversations.

### Character Discovery

Users can browse available AI characters and discover different personalities and conversation styles.

### Authentication

User authentication is handled using Better Auth.

Authentication flows include protected user functionality and account-based access to features.

### Image Upload

Character images are uploaded and managed using ImageKit.

### Persistent Data

Application data is stored in PostgreSQL through NeonDB.

Drizzle ORM is used for schema definition and database access.

### Responsive UI

The interface is designed to work across desktop and mobile devices using:

- Tailwind CSS
- shadcn/ui
- responsive layouts
- reusable UI components

---

## Tech Stack

### Frontend

- Next.js 16
- App Router
- TypeScript
- Tailwind CSS
- shadcn/ui

The project uses the Next.js App Router architecture without a `/src` directory.

### Backend & Database

- Next.js Server APIs / Server-side logic
- PostgreSQL
- NeonDB
- Drizzle ORM

### Authentication

- Better Auth

### AI

- OpenRouter
- Hermes 3 Instruct

### Media

- ImageKit

### Deployment

- Vercel

---

## AI Architecture

The AI conversation flow is designed around character context.

```text
User
  ↓
Selected Character
  ↓
Character Personality + Description + Backstory
  ↓
Conversation History
  ↓
OpenRouter
  ↓
Hermes 3 Instruct
  ↓
AI Character Response
```
