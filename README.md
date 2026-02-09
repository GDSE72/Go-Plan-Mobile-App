# Go-Plan Mobile App 🌍✈️

Go-Plan is a smart travel companion app for exploring Sri Lanka. It combines a rich visual feed of destinations with an AI-powered trip planner to help users create personalized itineraries.

## ✨ Features

- **Explore Feed**: Discover beautiful destinations (Kandy, Galle, Ella, etc.) with curated images.
- **AI Trip Planner**: Generate custom trip plans based on your preferences, budget, and duration.
- **State Management**: Robust data handling using **Redux Toolkit** (caching feed, persisting auth state).
- **User Authentication**: Secure login via Email and Google Sign-In (Firebase Auth).
- **Rich Imagery**: Dynamic image sources ensuring every location has a relevant photo.
- **Trip Details**: View detailed itineraries with maps, activities, and local tips.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Expo CLI (`npm install -g expo-cli`)
- Android Studio / Xcode (for simulators) or Expo Go app (for physical devices)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd Go-Plan-Mobile-App
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add your Firebase and API keys:

    ```env
    EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_client_id
    EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
    ```

    > **Note:** The `EXPO_PUBLIC_GEMINI_API_KEY` is crucial for the AI Trip Planner to function.

4.  **Run the App:**

    ```bash
    npx expo start -c
    ```

    - Use `-c` to clear cache when changing environment variables.
    - Press `a` for Android, `w` for Web.
    - Scan the QR code with Expo Go.

## 📸 Screenshots

_Screenshots will be added soon._

## 🛠️ Data Management

This project uses **Firebase Firestore** for data storage and **Redux** for state management.

### Upload Data Scripts

To seed the database with travel data and images:

```bash
# Upload Feed Data (Big_Sri_Lanka_Travel_Data.json)
node -r dotenv/config uploadData.js

# Upload Trip Planner Data (All_Travel_Data_With_Images.json)
node -r dotenv/config uploadTripData.js
```

### Automated Image Discovery

To scan for city names in URLs and automatically assign images:

```bash
node harvestCityImages.js
```

## 📂 Project Structure

- `app/`: Expo Router pages and screens.
- `components/`: Reusable UI components.
- `store/`: Redux configuration and slices (`auth`, `feed`, `trip`).
- `services/`: AI and external service integrations.
- `uploadData.ts` / `uploadTripData.ts`: Database seeding scripts.

---

Built with ❤️ using Expo, React Native, Firebase, Redux, and Gemini AI.
