# Next.js Authentication Template

A comprehensive Next.js starter template with authentication, state management, and modern styling. This template helps you quickly build secure and scalable web applications with best practices in place.

## Features

- 🔐 **Authentication with AuthJS (NextAuth.js)**
  - Credentials-based login (Email & Password)
  - Social authentication (Google, GitHub OAuth)
- 🔄 **State Management using Redux**
- 🗄️ **MongoDB Database Integration**
- 📧 **Email Service using Resend**
- 💅 **Styling with TailwindCSS and Shadcn UI**
- 🌓 **Dark/Light Mode Support**
- ⚡ **Type-safe with TypeScript**

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/sakshxm08/nextjs-auth-template.git
cd nextjs-auth-template
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add the following variables:

```env
MONGODB_URI=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```

### 4. Run the Development Server

```sh
npm run dev
```

Then, open `http://localhost:3000` in your browser.

## Authentication Setup

### Email/Password Authentication

- Implements custom email/password authentication using AuthJS.
- Supports email verification and password reset.

### OAuth Authentication

- **GitHub**: Callback URL - `{NEXT_PUBLIC_APP_URL}/api/auth/callback/github`
- **Google**: Redirect URI - `{NEXT_PUBLIC_APP_URL}/api/auth/callback/google`

## Usage Examples

### Authentication Hook Usage

```tsx
import { signIn } from "next-auth/react";

const LoginPage = () => {
  const handleSignin = (provider) => signIn(provider);
};
```

### Redux State Usage

```tsx
import { useSelector } from "react-redux";

const UserProfile = () => {
  const user = useSelector((state) => state.user.user);
};
```

## Deployment

This project is ready for deployment on **Vercel**, **AWS**, or any hosting service that supports Next.js.

```sh
npm run build
npm start
```

## Contributing

Feel free to submit issues or pull requests to improve this template.

## License

MIT License
