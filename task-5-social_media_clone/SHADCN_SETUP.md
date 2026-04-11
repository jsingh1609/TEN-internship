# 🚀 Instagram Clone - shadcn/ui Setup Guide

## Project Setup

### 1. Initialize shadcn/ui Project

```bash
# Create new Vite project with TypeScript
npm create vite@latest instagram-clone -- --template react-ts
cd instagram-clone

# Install dependencies
npm install

# Initialize shadcn/ui
npx shadcn-ui@latest init
```

**During initialization, select:**
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ CSS variables for colors
- ✅ Default style (you can choose New York or Default)
- ✅ Path aliases: `@/*` → `./src/*`

### 2. Install Required Dependencies

```bash
# Core dependencies
npm install lucide-react clsx tailwind-merge
npm install @radix-ui/react-avatar @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-tooltip
npm install gsap framer-motion
npm install date-fns

# shadcn/ui components (install as needed)
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add input
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add separator
```

### 3. Project Structure

```
instagram-clone/
├── src/
│   ├── components/
│   │   ├── ui/              ← shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── avatar.tsx
│   │   │   └── ...
│   │   ├── instagram/       ← Custom Instagram components
│   │   │   ├── feed-item.tsx
│   │   │   ├── profile.tsx
│   │   │   ├── stories.tsx
│   │   │   ├── navigation.tsx
│   │   │   └── notifications.tsx
│   │   └── features/        ← Feature-specific components
│   │       ├── messaging/
│   │       ├── search/
│   │       └── create-post/
│   ├── lib/
│   │   ├── utils.ts         ← Utility functions
│   │   └── data.ts          ← Mock data
│   ├── hooks/               ← Custom hooks
│   │   ├── use-toast.ts
│   │   └── use-scroll.ts
│   ├── types/               ← TypeScript types
│   │   └── index.ts
│   └── App.tsx
├── public/
│   └── images/
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 4. Why `/components/ui` is Important

The `/components/ui` folder is crucial because:
1. **Shadcn/ui convention** - All CLI-installed components go here
2. **Separation of concerns** - Separates primitive components from business logic
3. **Reusability** - UI components can be used across the app
4. **Type safety** - TypeScript definitions are consistent
5. **Easy updates** - CLI can update components without conflicts

### 5. Tailwind Configuration

Update `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        instagram: {
          primary: '#0095f6',
          secondary: '#262626',
          border: '#363636',
          hover: '#1a1a1a',
        },
      },
      fontFamily: {
        billabong: ['Billabong', 'cursive'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### 6. TypeScript Configuration

Ensure `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 7. Import Aliases

Update `vite.config.ts`:

```ts
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

## Next Steps

After setup:
1. Copy all Instagram components to `src/components/instagram/`
2. Add mock data to `src/lib/data.ts`
3. Add TypeScript types to `src/types/index.ts`
4. Run `npm run dev`

## Additional Features Added

- ✅ Direct Messaging
- ✅ Create Post Modal
- ✅ Advanced Search
- ✅ Explore Page
- ✅ Reels (Short Videos)
- ✅ Live Streaming Badge
- ✅ Shopping Tags
- ✅ Activity Feed
- ✅ Multiple Account Support
