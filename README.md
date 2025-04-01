# LNBits Invoice Generator

A Next.js application for generating Lightning Network payment invoices using LNBits.

## Features

- Generate Lightning Network payment invoices
- Customizable payment amounts
- Support for payment memos and descriptions
- Modern, responsive UI
- Real-time invoice generation

## Prerequisites

- Node.js 18.x or later
- MySQL database
- LNBits instance (optional)

## Environment Setup

1. Create a `.env.local` file in your project root:

```bash
cp .env.example .env.local
```

2. Update the following required variables in `.env.local`:

- `DATABASE_URL`: Your MySQL database connection string
- `NEXT_PUBLIC_BASE_BACKEND_API_URL`: Your backend API URL
- `NEXT_PUBLIC_IDENTIFICATION_ID`: Your unique identification ID

3. Optional LNBits configuration:

- `LNBITS_API_KEY`: Your LNBits API key
- `WALLET_ID`: Your LNBits wallet ID
- `BASE_API_URL`: Your LNBits API base URL

## Getting Started

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `src/components/`: React components
- `src/api-services/`: API service configurations
- `src/app/`: Next.js app router pages and layouts
- `src/components/ui/`: UI components and styles

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [LNBits Documentation](https://docs.lnbits.org/)
- [Lightning Network](https://lightning.network/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
