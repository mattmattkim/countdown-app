# Countdown App

A beautiful React TypeScript application for tracking important dates and events with flip-style countdown timers.

## Features

- 📅 **Event Management** - Create, edit, delete, and complete events
- ⏰ **Flip-Style Timers** - Animated countdown displays using the Pqina Flip library
- 💾 **Local Storage** - All events and settings persist between sessions
- 🎨 **Modern UI** - Clean, responsive design with TailwindCSS
- 📱 **Mobile Friendly** - Works great on all screen sizes
- 🎯 **Event Categories** - Organize events by type (birthday, anniversary, holiday, etc.)
- ✅ **Event Completion** - Mark past events as completed

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mattmattkim/countdown-app.git
cd countdown-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm start` - Run development server
- `npm test` - Run tests in watch mode
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App (one-way operation)

## Usage

### Adding Events
1. Click the "+" button to add a new event
2. Choose an emoji, enter a title, and select a date
3. Optionally add a category and notes
4. Click "Add Event" to save

### Viewing Countdowns
- Events are displayed as cards showing time remaining
- Click any event card to see a detailed countdown view
- The flip-style timer shows hours, minutes, and seconds

### Managing Events
- Use the menu (⋮) on each card to edit or delete events
- Mark events as completed when they've passed
- Access settings from the bottom navigation

## Technologies Used

- **React 19** with TypeScript
- **TailwindCSS** for styling
- **@pqina/flip** for flip-style countdown animations
- **lucide-react** for icons
- **date-fns** for date utilities
- **Create React App** (not ejected)

## Project Structure

```
src/
├── components/       # React components
├── contexts/        # React Context for state management
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── index.css        # Global styles and Tailwind imports
```

## Contributing

Feel free to submit issues and pull requests!

## License

This project is open source and available under the MIT License.