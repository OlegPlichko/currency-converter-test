# Currency Converter Application

A React-based currency converter application that allows users to convert between EUR and USD with real-time exchange rate simulation.

## Features

- Real-time exchange rate simulation (updated every 3 seconds)
- EUR to USD and USD to EUR conversion
- Manual exchange rate setting with automatic deactivation on 2% deviation
- Conversion history tracking (last 5 conversions)
- Responsive design with clean UI/UX

## Project Structure

```
src/
├── components/
|   └── __tests__
|   |   └── CurrencyConverter.test.tsx
│   └── CurrencyConverter.tsx
|   └── CurrencyConverter.css
|── App.css
├── App.tsx
└── index.tsx
```

## Technical Implementation

This application is built using:

- React with functional components and hooks
- Tailwind CSS for styling
- Modern JavaScript (ES6+)

## Usage

1. Enter an amount in the input field
2. View the converted amount based on the current exchange rate
3. Use the switch button to toggle between EUR → USD and USD → EUR conversion
4. Optionally set a manual exchange rate
5. View your conversion history in the table at the bottom

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/currency-converter.git
   cd currency-converter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run unit tests
   ```bash
   npm test
   ```

## Deployment

The application is deployed on GitHub Pages at https://olegplichko.github.io/currency-converter-test/.

## Roadmap

See the [roadmap.md](./roadmap.md) file for planned future features and enhancements.

## Limitations & Shortcuts

See the [todo.md](./todo.md) file for current limitations and planned improvements.