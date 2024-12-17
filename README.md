# Project Environment Setup

This project uses environment variables to manage sensitive data and configuration settings. We use two important files for this purpose: `.env`.

## `.env` File

The `.env` file is used to store environment variables like API keys, base URLs, and other configuration settings. These variables are injected into the application at runtime. Note - EXPO_PUBLIC_ prefix is necessary for env naming.

### Example `.env` file:
```plaintext
EXPO_PUBLIC_BASE_URL=https://api.example.com
```

## `.expo-env.d.ts` File
```
declare module '@env' {
  export const BASE_URL: string | number | bool |;  //etc
  // Add other environment variables here as needed
}
```

### Project structure

```shell
.
Frontend
├── .idea/
├── app/
│   ├── (app)/
│   │   ├── (main)/
│   │   │   └── home.jsx                # Main authenticated screen
│   ├── (tabs)/
│   │   ├── _layout.js                 # Layout for bottom tab navigation
│   │   ├── explore.js                 # Explore tab screen
│   │   ├── index.js                   # Default tab (home or dashboard)
│   │   └── _layout.js                 # Tab navigation layout
│   ├── (auth)/
│   │   ├── login.tsx                  # Login screen
│   │   ├── register.tsx               # Registration screen
│   ├── _layout.js                     # layout
│   ├── +not-found.tsx                 # 404 page for auth stack
│   └── index.tsx                      # Entry Point || Default route in auth stack
├── assets                   # Assets folder for images, fonts, etc.
├── components               # Reusable UI components
│   ├── Button.tsx           # Example button component
│   ├── Header.tsx           # Example header component
│
├── constants                # Constants and configuration files
│   ├── colors.ts            # Color palette
│   ├── endpoints.ts         # API endpoints
│
├── context/                           # Contexts
│   └── AuthContext.js                 # Authentication context
│
├── hooks                    # Custom hooks
│   ├── useAuth.ts           # Hook for authentication state
│   ├── useFetch.ts          # Hook for fetching data
│
├── redux                    # Redux for state management
│   ├── authSlice.ts         # Authentication slice
│   ├── store.ts             # Redux store setup
│
├── scripts                  # Utility scripts
│   ├── clean-cache.sh       # Example script for cleaning cache
│
├── .expo                    # Expo-specific metadata (auto-generated)
├── .idea                    # IDE-specific metadata
├── .gitignore               # Git ignore file
├── app.json                 # App configuration
├── expo-env.d.ts            # TypeScript environment configuration for Expo
├── package-lock.json        # Lock file for npm dependencies
├── package.json             # Dependency management
├── README.md                # Project documentation
├── tsconfig.json            # TypeScript configuration

```

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
