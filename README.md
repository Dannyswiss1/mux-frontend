# Mux Dashboard

The developer console for **Mux Protocol** — manage API keys, track wallet creation, and monitor account activity on Stellar.

Mux Dashboard is the interface for developers building on Mux. It provides visibility into the **Invisible Wallet system** while abstracting away all blockchain complexity.

---

## Overview

Mux Dashboard allows developers to:

* **Create and manage API keys** for SDK access
* **Track Stellar account creation** on Testnet and Mainnet
* **Monitor wallet activity** and balances
* **View usage metrics** such as transaction counts and account status
* **Configure basic project-level settings**

End users do not interact with this dashboard — it is purely for developers integrating Mux into their applications.

---

## Core Principles

* **Developer-first UX**: designed for fast onboarding and management
* **Invisible Wallet visibility**: see accounts and activity without exposing keys or blockchain jargon
* **Safe and clear**: all actions are explicit; sensitive operations are handled by the backend

---

## Key Features

* **API Key Management**: generate, rotate, and revoke keys
* **Wallet/Account Tracking**: monitor accounts created via the SDK
* **Activity Metrics**: view transaction volumes and status
* **Requests over time**: visualize API request traffic trends
* **Wallet creation analytics**: monitor daily wallet creation volume
* **Network Switching**: testnet vs mainnet tracking
* **Usage Monitoring**: see platform-sponsored actions and account health

---

## Getting Started

### Prerequisites

* Node.js >= 18
* Access to Mux Backend API

### Installation

```bash
git clone https://github.com/muxlabs/mux-frontend.git
cd mux-frontend
pnpm install
pnpm run dev
```

### Auth and API client behavior

This repo now includes a minimal auth flow and API client support for dev mode:

* `src/lib/api.js` adds request header support with `x-request-id` and automatic session refresh on `401`
* `src/lib/session.js` persists auth state in `localStorage` and clears stale sessions gracefully
* `src/hooks/useWallets.ts` adds a wallet query hook that loads wallets from `/api/wallets`
* `src/app/api/auth/refresh/route.ts`, `/api/wallets/route.ts`, and `/api/wallets/[id]/route.ts` simulate auth-protected backend behavior for local testing

### Smoke tests

Run full smoke tests with:

```bash
npm test
```

---

## Design Philosophy

* The dashboard is **developer-focused**, not end-user focused
* **Backend handles wallets and transactions**; the dashboard is a monitoring and management tool
* Makes it simple to **observe, control, and integrate** Mux-powered wallets

---

## Roadmap

* Per-key usage analytics
* Webhooks and notifications for SDK events
* Team access management
* Audit logs for all wallet and API activity
