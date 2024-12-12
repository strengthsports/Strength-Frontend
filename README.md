# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

### Project structure

```shell
.
Frontend
├── app
│   ├── (authenticated)      # Authenticated stack
│   │   ├── _layout.tsx      # Main layout for authenticated users
│   │   ├── (tabs)           # Bottom Tab Navigation
│   │   │   ├── _layout.tsx  # Tab navigator layout
│   │   │   ├── home.tsx     # Home screen under tabs
│   │   │   ├── profile.tsx  # Profile screen under tabs
│   │   │   ├── settings.tsx # Settings screen under tabs (example)
│   │   ├── other-screen.tsx # Any additional screen outside tabs (optional)
│   │   ├── dashboard.tsx    # Example non-tabbed screen
│   │
│   ├── (unauthenticated)    # Unauthenticated stack
│   │   ├── _layout.tsx      # Main layout for unauthenticated users
│   │   ├── sign-in.tsx      # Sign-in screen
│   │   ├── register.tsx     # Registration screen (optional)
│   │
│   ├── _layout.tsx          # Global layout to decide stack based on auth state
│   ├── +not-found.tsx       # Custom 404 page for unmatched routes
│
├── assets                   # Assets folder for images, fonts, etc.
├── components               # Reusable UI components
│   ├── Button.tsx           # Example button component
│   ├── Header.tsx           # Example header component
│
├── constants                # Constants and configuration files
│   ├── colors.ts            # Color palette
│   ├── endpoints.ts         # API endpoints
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
