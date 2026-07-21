# Enterprise Product Management Platform – UI Documentation

## Overview

This repository contains a React-based admin UI built with Vite and Material UI. The application provides an authenticated DevOps/product management portal with a single main shell under `/devops` and a separate login route at `/devops/login`.

The UI is designed for enterprise workflows: product/customer management, requests and approvals, security scans, releases and deployments, analytics, and a profile/configuration editor.

---

# Application Architecture

## Entry Point

* `src/index.jsx`
  * Mounts the React app into the DOM.

* `src/App.jsx`
  * Wraps the app with theme, authentication, routing, and alert providers.
  * Uses `ThemePrefsProvider`, `ThemeProvider`, `AuthProvider`, `BrowserRouter`, and `AlertCenterProvider`.

* `src/AppRoutes.jsx`
  * Defines public and authenticated routes.
  * Public route: `/devops/login`.
  * Authenticated shell route: `/devops`.
  * Redirects `/` and unknown routes to login or app shell.

---

# Core Platform Services

## Theme Management

`src/contexts/ThemeContext.jsx`

Manages user appearance preferences.

* Six color presets.
* Font family options.
* Font size slider.
* Persists preferences in `localStorage`.
* Constructs a dynamic Material UI theme.
* Updates CSS custom properties for custom table styling.

---

## Authentication and Session

`src/services/AuthProvider.jsx`

Handles user authentication state and session storage.

* Stores authenticated user profile in `sessionStorage`.
* Provides `loginWithCredentials` and `logout`.
* Supports temporary API bypass mode when `VITE_AUTH_FROM_API=false`.
* Ensures user redirection to login on unauthenticated access.

---

## Global Alerts and Confirmations

`src/contexts/AlertCenter.jsx`

A shared notification and confirmation system.

* Snackbar toast notifications.
* Confirmation dialog that returns a promise.
* Supports `success`, `error`, `warning`, and `info` states.
* Accessible from any component via `useAlertCenter()`.

---

# Application Shell

## Main Layout

`src/components/Layout/Layout.jsx`

Provides the authenticated application shell and internal page navigation.

* Left navigation drawer with searchable menu.
* Drawer resizing and responsive behavior.
* Top app bar with profile menu and theme settings.
* Section-based page rendering using internal state.
* Scroll-to-top button.
* Mobile behavior collapsing the drawer.

---

## App Container

`src/components/ui/AppLayout.jsx`

Wraps the application content and ensures full viewport layout.

* Uses flexbox to keep main content filling available space.
* Provides a simple shell for all pages.

---

## Theme Settings Dialog

`src/components/ui/ThemeSettingsDialog.jsx`

Provides UI controls for theme customization.

* Color preset selection.
* Font family selection.
* Font size slider.
* Live preview panel.
* Reset to defaults.

---

# Backend Connectivity

## API Layer

`src/services/api.js`

Configures Axios for backend requests.

* Combines backend host and API prefix.
* Uses `Content-Type: application/json`.
* Sends credentials for cookie auth.
* Redirects to `/devops/login` on 401 responses.

---

## Backend Settings

`src/config/backend.js`

Stores backend configuration defaults.

* `VITE_BACKEND_URL` or `http://localhost:8080`.
* `VITE_API_PREFIX` or `/api/devops`.
* Session cookie name.

---

## Tenant Storage

`src/services/tenantStorage.js`

Provides tenant data from static JSON.

* Reads tenant definitions from `src/data/tenants.json`.
* Currently in-memory only; no backend persistence.

---

# Pages and Screens

## Login

`src/pages/LoginPage.jsx`

Provides secure sign-in support.

* Username and password fields.
* Password visibility toggle.
* Client-side validation.
* Redirects authenticated users to `/devops`.

---

## Dashboard

`src/pages/Dashboard.jsx`

The main analytics and overview page.

* KPI summary cards.
* Recent activity and status panels.
* Compact data tables and charts.

---

## Repository Request Form

`src/pages/RepositoryRequestForm.jsx`

Allows users to submit Git repository requests.

* Form-driven request creation.
* Presumably integrates with backend request workflows.

---

## Requests History

`src/pages/RequestsHistory.jsx`

Lists historical requests.

* Tracks request status and details.
* Provides user-centric request history.

---

## Pending Approvals

`src/pages/PendingApprovals.jsx`

A workflow approval list.

* Displays pending approval items.
* Intended for decision workflows.

---

## Pending Quality Approvals

`src/pages/PendingQualityApprovals.jsx`

Focused on quality review tasks.

* Tracks quality gate approvals.
* Displays tasks awaiting review.

---

## Vulnerability Scans

`src/pages/VulnerabilityScans.jsx`

Security scan management.

* Shows vulnerability findings.
* Supports scan status visibility.

---

## Artifacts Repository

`src/pages/ArtifactsRepository.jsx`

Manages artifact metadata.

* Displays build artifacts or package entries.
* Supports repository workflow views.

---

## SBOM

`src/pages/SBOM.jsx`

Software Bill of Materials tracking.

* Displays component and dependency inventory.
* Useful for supply-chain transparency.

---

## Releases

`src/pages/Releases.jsx`

Manages release tracking.

* Shows release versions and statuses.
* Provides release overview cards.

---

## Deployments

`src/pages/Deployments.jsx`

Deployment history and status.

* Shows environment deployments.
* Includes deployment metrics and records.

---

## Analytics

`src/pages/Analytics.jsx`

Business and operational analytics.

* Displays metrics, trends, and charts.
* Supports data-driven decision making.

---

## Release Planning

`src/pages/ReleasePlanning.jsx`

Planning and roadmap workspace.

* Timeline / Gantt-style views.
* Milestone and team planning cards.

---

## Customer Management

`src/pages/CustomerManagement.jsx`

Tracks customer records.

* Displays customer profiles and details.
* Supports customer segmentation and lifecycle.

---

## Product Management

`src/pages/ProductManagement.jsx`

Manages product catalog entries.

* Displays products with status chips.
* Supports product metadata and admin actions.

---

## Profile Editor

`src/pages/ProfileEditor.jsx`

A complex configuration workspace for generating deployment profiles.

* Multi-tab editor.
* YAML generation and preview.
* Sections for global settings, database, Kafka, Redis, MQ, observability, security, integration, and microservices.
* Includes tenant and environment selection.

---

# Profile Editor Components

`src/components/profile-editor/`

The profile editor is composed of several modular panels:

* `ProfileSelectorBar.jsx`
* `YamlPreviewDrawer.jsx`
* `SectionHeader.jsx`
* `panels/GettingStartedPanel.jsx`
* `panels/GlobalConfigPanel.jsx`
* `panels/DatabaseConfigPanel.jsx`
* `panels/KafkaConfigPanel.jsx`
* `panels/RedisConfigPanel.jsx`
* `panels/MessageQueuePanel.jsx`
* `panels/ObservabilityPanel.jsx`
* `panels/SecurityPanel.jsx`
* `panels/IntegrationPanel.jsx`
* `panels/MicroserviceConfigPanel.jsx`

These panels define the profile editor’s configuration workflow and YAML output.

---

# Navigation and UI Patterns

* Single authenticated shell at `/devops`.
* State-driven page selection inside `Layout.jsx`.
* Material UI for consistent design.
* Responsive screen behavior.
* Global alerts and confirmations.
* Theme personalization with user preferences.

---

# Technical Stack

Built with:

* React
* Vite
* React Router
* Material UI
* Axios
* Context API
* Material React Table

Architecture is centered on:

* Modular page components.
* Shared providers for theme, auth, and alerts.
* Clear separation of pages, services, and shared UI.

---

# Deployment

* `vite.config.js` controls base URL and build output.
* Static assets live in `public/`.
* Environment variables configure backend integration.
* Build output is optimized for production.

---

# Project Structure

* `src/App.jsx` — app composition and provider nesting.
* `src/AppRoutes.jsx` — route configuration.
* `src/components/Layout/` — main shell and navigation.
* `src/components/ui/` — shared layout and personalization UI.
* `src/contexts/` — theme and alert providers.
* `src/services/` — authentication, API, and tenant utilities.
* `src/pages/` — main application screens.
* `src/config/` — backend configuration.
* `src/components/profile-editor/` — profile editor workspace.

---

# Summary

This UI is a polished enterprise portal focused on DevOps and product operations. It offers secure authentication, centralized management screens, approvals and workflow views, analytics, and a configuration-rich profile editor built using modern React patterns.
