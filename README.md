This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Polling Web App with QR Code Sharing

## Project Overview

This is a web application that allows users to create polls and share them via unique links and QR codes for others to vote on. The application focuses on providing a seamless experience for poll creation, sharing, and participation.

## Technology Stack

The project is built using the following technologies:

- **Language**: TypeScript
- **Main Framework**: Next.js (App Router)
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Primarily Server Components for server state; `useState` or `useReducer` for local component state in Client Components.
- **API Communication**: Next.js Server Actions for mutations (creating polls, voting); data fetching in Server Components using the Supabase client.
- **QR Code Generation**: `qrcode.react` (or similar library for QR code generation).

## Setup Steps

To get the project up and running locally, follow these steps:

1.  **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd polling_webapp
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Set up Supabase**:

    a.  Create a new project on [Supabase](https://supabase.com/).
    b.  Obtain your Supabase URL and Anon Key from your project settings (API section).
    c.  Set up your database schema. You'll need tables for `users`, `polls`, and `poll_options`. Here's a basic schema:

        ```sql
        -- users table (Supabase Auth handles this largely, but you might extend it)
        -- polls table
        create table polls (
          id uuid primary key default uuid_generate_v4(),
          question text not null,
          user_id uuid references auth.users(id) on delete cascade,
          created_at timestamp with time zone default now()
        );

        -- poll_options table
        create table poll_options (
          id uuid primary key default uuid_generate_v4(),
          poll_id uuid references polls(id) on delete cascade,
          option_text text not null,
          votes integer default 0
        );
        ```

    d.  Create a `.env.local` file in the root of your project and add your Supabase credentials:

        ```
        NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
        NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
        ```

4.  **Run the development server**:

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Examples

### Creating Polls

1.  Navigate to the `/auth/sign-up` page to create a new account or `/auth/sign-in` if you already have one.
2.  Once logged in, go to the dashboard (or `/polls/create`).
3.  Fill in the poll question and add at least two options.
4.  Click "Create Poll".

### Voting

1.  After creating a poll, you will be redirected to the dashboard. Click on a poll to view its details.
2.  Select your preferred option.
3.  Click "Vote".

## How to Run and Test the App Locally

### Running the App

Follow the "Setup Steps" above, specifically step 4, to run the application in development mode.

### Testing the App

To run the unit tests, use the following command:

```bash
npm test
# or
yarn test
# or
pnpm test
# or
bun test
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
