# GLYDER - Modern E-commerce Platform

GLYDER is a high-performance, scalable e-commerce platform built with the latest web technologies. This project is designed for modern urban mobility brands, starting with premium electric scooters.

## 🚀 Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database & Auth:** [Supabase](https://supabase.com/) (Integration placeholders)
- **Payments:** [Stripe](https://stripe.com/) (Integration placeholders)

## 📁 Folder Structure

The project follows a scalable and organized folder structure:

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: UI components organized by feature and commonality.
  - `common`: Global components like Navbar and Footer.
  - `ui`: Base shadcn/ui components.
  - `home`, `shop`, etc.: Feature-specific components.
- `src/lib`: Utility functions and third-party SDK initializations (Supabase, Stripe).
- `src/hooks`: Custom React hooks for shared logic.
- `src/types`: TypeScript definitions and interfaces.
- `src/store`: State management (e.g., Cart state).
- `src/services`: API calling logic and data fetching.
- `src/constants`: Static values and configuration.

## 🛠️ Getting Started (For Beginners)

Follow these exact steps to run the project on your local machine:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18.0 or higher recommended).

### 2. Install Dependencies
Open your terminal in the project folder and run:
```bash
npm install
```

### 3. Set Up Environment Variables
Copy the example environment file to create your own:
```bash
cp .env.example .env.local
```
*(Note: You can fill in the values later when you set up Supabase and Stripe)*

### 4. Run the Development Server
Start the local server by running:
```bash
npm run dev
```

### 5. View the App
Open your browser and go to:
[http://localhost:3000](http://localhost:3000)

## 🏗️ Phase 1 Progress
- [x] Clean scalable folder structure
- [x] Basic layout (Navbar, Footer)
- [x] Shared UI components (shadcn/ui)
- [x] Placeholder pages (Home, Shop, Product, Cart, etc.)
- [x] Supabase & Stripe integration placeholders
- [x] Comprehensive README

## 📄 License
This project is private and for educational purposes.
