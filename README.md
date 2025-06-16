# Roulette Strategy Simulator

A web-based roulette strategy simulator built with Nuxt.js, recreating the functionality of the original JavaFX desktop application.

## Features

### Roulette Types
- **European Roulette**: Single zero (0) wheel
- **American Roulette**: Double zero (0, 00) wheel  
- **Numbers 1-36 Only**: Basic numbered wheel without zeros

### Betting Strategies
- **Martingale Strategy**: Double bet amount after each loss, reset to base after win
- **Fixed Bet Strategy**: Consistent bet amount every round
- **Cocomo Strategy**: Bet on opposite color of previous result with progressive amounts

### Simulation Features
- Configurable initial balance (default: $1,000)
- Variable simulation rounds (10, 50, 100, 500, 1000)
- Real-time statistics tracking
- Balance history visualization with HTML5 canvas chart
- Recent results table with win/loss details

### Statistics Tracked
- Current balance
- Maximum/minimum balance reached
- Win/loss count and percentage
- Total bets and payouts
- Balance history over time

## Technology Stack

- **Framework**: Nuxt.js 3.17.5 with Vue 3
- **UI**: Nuxt UI with Tailwind CSS
- **Language**: TypeScript
- **Build**: Vite with static site generation
- **Deployment**: Can be deployed as static files to any hosting service

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Generate static site
npm run generate

# Preview production build
npm run preview
```

## Static Site Generation

This application is fully compatible with static site generation:

```bash
npm run generate
```

The generated files in `.output/public` can be deployed to any static hosting service like Netlify, Vercel, GitHub Pages, or AWS S3.

## Architecture

### Core Models
- `Spot`: Roulette numbers (0-36, 00) with utility methods
- `RouletteType`: Different roulette wheel configurations
- `Bet`: Individual bet with type, amount, and payout
- `Strategy`: Interface for implementing betting strategies

### Utilities
- `SpotHelper`: Roulette number analysis (color, even/odd, dozens, columns)
- `BetHelper`: Bet calculations and win/loss determination
- `ChartHelper`: Canvas-based balance visualization

### Strategies
- `BaseStrategy`: Abstract base class with common functionality
- `MartingaleStrategy`: Classic progressive betting system
- `FixedBetStrategy`: Simple flat betting approach
- `CocomoStrategy`: Color-based contrarian strategy

## Original Project

This web application is based on the JavaFX roulette simulator available at:
https://github.com/cyrus07424/rouletteSimulator

The core logic and betting strategies have been faithfully reproduced in TypeScript while providing a modern web interface.

## License

MIT License - see the original repository for full license terms.
