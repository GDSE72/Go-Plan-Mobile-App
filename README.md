# 🌍✈️ Go-Plan Mobile App

**Go-Plan** is a smart travel companion mobile application designed to help users explore Sri Lanka effortlessly.  
It combines a visually rich destination feed with an **AI-powered trip planner** to generate personalized travel itineraries.

---

## ✨ Features

- **Explore Feed** – Discover popular Sri Lankan destinations such as Kandy, Galle, Ella, and more.
- **AI Trip Planner** – Generate custom travel plans based on budget, duration, and interests.
- **User Authentication** – Secure login using Email & Google Sign-In (Firebase Authentication).
- **State Management** – Efficient data handling with **Redux Toolkit**.
- **Rich Visual Experience** – Dynamic image sourcing for every destination.
- **Trip Management** – View, save, and manage detailed itineraries with local tips.

---

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js (v18+)
- Expo CLI (`npm install -g expo-cli`)
- Android Studio / Xcode or Expo Go App

---

### 📦 Installation

```bash
git clone <repository-url>
cd Go-Plan-Mobile-App
npm install
```

### 🔐 Environment Variables

Create a `.env` file in the root directory:

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

> ⚠️ `EXPO_PUBLIC_GEMINI_API_KEY` is required for the AI Trip Planner.

### ▶️ Run the App

```bash
npx expo start -c
```

---

## 📸 Screenshots

### 🔐 Authentication

| Sign Up | Sign In |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/0aa68c33-0880-485d-868f-aebf2a2287e3" width="200" /> | <img src="https://github.com/user-attachments/assets/b93e72c8-ec60-4f46-b6da-c6dc5d764aa9" width="200" /> |

---

### 🔎 Discovery

| Home | Feed | All Destinations |
| :---: | :---: | :---: |
| <img src="https://github.com/user-attachments/assets/39a3497c-0706-44ce-9b48-20cb4957c087" width="160" /><br/><img src="https://github.com/user-attachments/assets/748d4a1e-b719-48bc-90e4-3092dc07cab4" width="160" /> | <img src="https://github.com/user-attachments/assets/dc14cb7c-98d1-4fad-bd4a-a07e3202d789" width="160" /><br/><img src="https://github.com/user-attachments/assets/cc95a5ad-e77a-4e14-8cc6-c8c4d12bb9ba" width="160" /> | <img src="https://github.com/user-attachments/assets/1c890986-013d-44aa-9ffd-df457e112536" width="160" /> |

---

### 🧭 Planning & Trips

| Trip Plan | Trip Details | Saved Trips |
| :---: | :---: | :---: |
| <img src="https://github.com/user-attachments/assets/f89facbd-1dfb-4b53-9d2a-0a92d456463f" width="180" /> | <img src="https://github.com/user-attachments/assets/553239f2-d17f-4c05-bccf-15d55e120016" width="180" /><br/><img src="https://github.com/user-attachments/assets/8d705635-05e0-4e37-83ad-f1f58cd72c68" width="180" /> | <img src="https://github.com/user-attachments/assets/8247e71f-b4b3-4b35-b3fc-032792f47441" width="180" /> |

---

### 👤 User Profile

| Profile |
| :---: |
| <img src="https://github.com/user-attachments/assets/ce36084b-0df9-455b-9c28-b8fdcb9585ae" width="200" /> |

---

## 🛠️ Data Management

- Firebase Firestore
- Redux Toolkit

### 📤 Upload Data

```bash
node -r dotenv/config uploadData.js
node -r dotenv/config uploadTripData.js
```

### 🖼️ Image Harvesting

```bash
node harvestCityImages.js
```

---

## 📂 Project Structure

```plaintext
app/
components/
store/
services/
uploadData.ts
uploadTripData.ts
harvestCityImages.js
```

---

## 🧠 Tech Stack

- Expo / React Native
- Redux Toolkit
- Firebase
- Gemini AI

---

## ❤️ Acknowledgements

Built with ❤️ to explore Sri Lanka smarter 🇱🇰
