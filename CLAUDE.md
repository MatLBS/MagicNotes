# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MagicNotes is a React Native mobile application built with Expo Router and TypeScript. The app appears to be a note-taking application with camera integration and user authentication features.

## Technology Stack

- **Framework**: Expo SDK ~53.0.13 with React Native 0.79.4
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native) 
- **State Management**: React hooks and AsyncStorage
- **Authentication**: Expo Auth Session, Google Sign-In, Appwrite
- **Camera**: Expo Camera for photo capture
- **Backend**: Appwrite (react-native-appwrite)
- **Type Safety**: TypeScript

## Development Commands

```bash
# Start development server
npm start
# or
npx expo start

# Platform-specific builds
npx expo run:android
npx expo run:ios
npm run web

# Linting
npm run lint

# Reset project to blank template
npm run reset-project
```

## Project Structure

- **`app/`**: File-based routing with Expo Router
  - `_layout.tsx`: Root layout with Stack navigator
  - `(tabs)/`: Tab-based navigation group
    - `_layout.tsx`: Custom tab bar with TabIcon component
    - `index.tsx`: Home screen
    - `profile.tsx`: Profile screen
  - `index.tsx`, `login.tsx`, `register.tsx`: Auth screens

- **`components/`**: Reusable React Native components
  - `BottomSheet.tsx`: Modal-like bottom sheet component
  - `CustomButton.tsx`: Styled button component
  - `InputField.tsx`: Form input component
  - `PhotoPreviewSections.tsx`: Camera preview component
  - `DeleteNote.tsx`, `DeleteNoteModal.tsx`: Note deletion components

- **`constants/`**: Asset imports and app constants
  - `images.ts`: Image asset exports
  - `icons.ts`: Icon asset exports

- **`assets/`**: Static assets (images, icons, fonts)

## Styling System

The app uses NativeWind with a custom color palette defined in `tailwind.config.js`:
- Primary colors: `#030014`, `#151312`
- Light variants: `#D6C6FF`, `#A8B5DB`, `#9CA4AB`  
- Dark variants: `#221f3d`, `#0f0d23`
- Accent: `#AB8BFF`

## Key Architecture Patterns

- **File-based routing**: Expo Router automatically creates routes based on file structure in `app/`
- **Component composition**: Reusable components in `/components` folder
- **Asset organization**: Centralized asset imports through constants files
- **Tab navigation**: Custom tab bar implementation with highlight animations
- **Authentication flow**: Separate auth screens outside tab navigation

## Development Notes

- The app uses Expo's new architecture (`newArchEnabled: true`)
- TypeScript is configured with typed routes experiment enabled
- EAS Build is configured with project ID for deployment
- Google Sign-In is configured for iOS with URL scheme
- Camera permissions and media library access are required for photo features