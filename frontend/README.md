# Expense Sharing Application (SplitApp)

A clean, responsive frontend application for sharing expenses with friends and groups, built with React, TypeScript, and Tailwind CSS.

## Features

- **User Management**: Create and manage users in the system
- **Group Management**: Create groups and add members to organize expenses
- **Expense Tracking**: Add expenses with flexible split options (Equal, Exact, Percentage)
- **Balance Tracking**: View who owes you and who you owe
- **Settlement**: Settle balances with other users

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite

## Prerequisites

Before running the frontend, ensure you have:

1. Node.js (v18 or higher) installed
2. The Spring Boot backend running on `http://localhost:8080`

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Navigation.tsx   # Navigation bar
│   ├── Dashboard.tsx    # Dashboard/home page
│   ├── Users.tsx        # User management
│   ├── Groups.tsx       # Group management
│   ├── Expenses.tsx     # Expense creation
│   └── Balances.tsx     # Balance tracking and settlement
├── services/
│   └── api.ts          # API service layer with Axios
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles with Tailwind

```

## API Integration

The application connects to the Spring Boot backend at `http://localhost:8080` with the following endpoints:

- `POST /users` - Create a new user
- `GET /users` - Get all users
- `GET /users/{id}/balances` - Get user balances
- `POST /groups` - Create a new group
- `GET /groups` - Get all groups
- `GET /groups/{id}` - Get group by ID
- `POST /expenses` - Create a new expense
- `POST /settle` - Settle a balance

## Usage Guide

### 1. Create Users
Navigate to the Users page and create users by providing name and email.

### 2. Create Groups
Go to the Groups page, create a group, and select members from the existing users.

### 3. Add Expenses
On the Expenses page:
- Select a group
- Enter the expense amount and description
- Choose who paid for the expense
- Select split type (Equal, Exact, or Percentage)
- Select participants and their split amounts

### 4. View Balances
On the Balances page:
- Select a user to view their balances
- See who owes them and who they owe
- View net balance summary

### 5. Settle Balances
From the Balances page, you can settle dues with other users by selecting the person and entering the settlement amount.

## Important Notes

- Ensure the backend server is running before using the application
- All API calls include proper error handling with user-friendly messages
- The application is fully responsive and works on desktop and mobile devices
- Form validation is implemented for all input fields

## Troubleshooting

If you encounter connection errors:
1. Verify the backend is running on `http://localhost:8080`
2. Check the browser console for detailed error messages
3. Ensure CORS is properly configured on the backend

## License

This project is created for educational purposes.
