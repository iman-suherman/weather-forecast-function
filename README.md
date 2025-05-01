# Weather Forecast Application

A Next.js application that provides hourly weather forecasts using the Open-Meteo API. The application features an interactive map for location selection and displays detailed weather information.

## Features

- Interactive map for location selection
- Hourly weather forecasts
- Temperature, wind speed, and humidity information
- Weather condition icons
- Responsive design
- Deployed on Google Cloud Functions

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Leaflet for maps
- Open-Meteo API
- Google Cloud Functions

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Build the application:
   ```bash
   npm run build
   ```

## Deployment

To deploy to Google Cloud Functions:

1. Make sure you have the Google Cloud SDK installed and configured
2. Run the deployment command:
   ```bash
   npm run deploy:function
   ```

## API Usage

The application uses the Open-Meteo API (https://open-meteo.com/) to fetch weather data. No API key is required.

## License

MIT