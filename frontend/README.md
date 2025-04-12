# Welcome to your Lovable project

## Project info

**Firebase Studio**: https://console.firebase.google.com/project/job-hunter-314524/overview

**URL**: https://lovable.dev/projects/f9a14ab2-5d6c-4bc5-a13d-c3cb1898d0b7

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f9a14ab2-5d6c-4bc5-a13d-c3cb1898d0b7) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f9a14ab2-5d6c-4bc5-a13d-c3cb1898d0b7) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes it is!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

This project is a job hunter dashboard builder. It allows users to manage their job applications, potentially with features like importing jobs, automating applications on platforms like LinkedIn, and tracking their progress.

The frontend is built using:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

To run the frontend:

1.  Navigate to the `job-hunter-dashboard-builder` directory.
2.  Install dependencies: `npm i`
3.  Start the development server: `npm run dev`

The backend is built with Node.js and likely uses Express.js for handling API requests. It has features for LinkedIn automation, resume parsing, and saving configurations.

To run the backend:

1.  Navigate to the `job-hunter-dashboard-builder/backend` directory.
2.  Install dependencies: `npm i`
3.  Start the server:  You'll need to examine `job-hunter-dashboard-builder/backend/package.json` to find the exact command, but it's likely something like `npm start` or `node index.js`. You can also check the `scripts` section in the `package.json` file for a `start` command.

The project also integrates with Supabase for database management and includes components for UI elements, forms, and LinkedIn-specific features.

To deploy the project, you can use Lovable.dev by clicking on Share -> Publish.

The project has been updated to reflect its integration with Firebase Studio.

**To start the project:**

**Frontend:**

1.  Navigate to the `job-hunter-dashboard-builder` directory.
2.  Install dependencies: `npm i`
3.  Start the development server: `npm run dev`

**Backend:**

1.  Navigate to the `job-hunter-dashboard-builder/backend` directory.
2.  Install dependencies: `npm i`
3.  Start the server: Examine the `package.json` file in this directory. Look for a `scripts` section and find the command associated with `start`. It's likely `npm start` or `node index.js`. Use that command to start the backend.

**To set up the project**, you'll need to follow the instructions in this README, which include steps for running both the frontend and backend. The backend setup may involve configuring environment variables or other settings, so be sure to consult the project's documentation for specific details.
