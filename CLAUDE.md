# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React TypeScript countdown application that allows users to track important dates and events. The app features flip-style countdown timers, event management, and local storage persistence.

## Commands

```bash
# Development
npm start          # Run development server on http://localhost:3000
npm run build      # Build for production to ./build directory
npm test           # Run tests in watch mode
npm test -- --coverage    # Run tests with coverage report
npm test -- --no-watch    # Run tests once without watch mode

# Installation
npm install        # Install all dependencies
```

## Architecture

### Core Technologies
- React 19.1.0 with TypeScript
- Create React App (not ejected)
- TailwindCSS for styling
- @pqina/flip library for flip-style countdown animations
- Local storage for data persistence

### State Management
The app uses React Context (`EventsContext`) for global state management:
- Events are stored in local storage and loaded on app initialization
- Settings (theme, notifications, sound) are also persisted
- No external state management libraries are used

### Component Structure

**Two Flip Clock Implementations:**
1. `FlipClock.tsx` - Custom implementation used in the detail view
2. `FlipClockPqina.tsx` - Uses @pqina/flip library, used in event cards

**Key Architectural Decisions:**
- The app has two main views: Events list and Settings
- Clicking an event card shows a detail view with a larger countdown
- Events can be active or completed
- Date calculations use utility functions in `dateHelpers.ts`

### Styling Approach
- TailwindCSS for utility classes
- Custom CSS in `index.css` for flip clock customizations
- The Pqina flip clock requires careful CSS to avoid clipping issues (uses transform: scale)

### Important Implementation Details

**Flip Clock Styling:**
- The Pqina flip clock is scaled using inline styles in EventCard.tsx
- Custom CSS overrides should be minimal to avoid breaking the flip animation
- The library dynamically loads flip.min.js from the public folder

**Date Handling:**
- All dates are stored as Date objects in state
- JSON serialization/deserialization includes custom date revival
- The app handles past events differently from future events

**Local Storage Structure:**
- `countdown-events`: Array of Event objects
- `countdown-settings`: AppSettings object

## Known Issues and Workarounds

1. **Flip Clock Clipping**: The Pqina flip clock can be clipped by parent containers. Solution: Use transform: scale() instead of modifying the library's internal CSS.

2. **TypeScript Strict Mode**: The project uses strict TypeScript settings. All new code must handle null/undefined cases explicitly.

3. **React 19**: Using React 19 which may have compatibility issues with some older libraries.