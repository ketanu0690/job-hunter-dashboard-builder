# Welcome to your Lovable project

## Project info

**Firebase Studio**: https://console.firebase.google.com/project/job-hunter-314524/overview

**URL**: https://lovable.dev/projects/f9a14ab2-5d6c-4bc5-a13d-c3cb1898d0b7

## Project Structure

This project consists of **three main services**:

### 1. `job-ui`

The frontend application built using:

- Vite
- TypeScript
- React
- Tailwind CSS

### 2. `job-worker`

A backend service built with **.NET** for handling background jobs, automation tasks, and integration workflows.

### 3. `job-core-services`

A Node.js-based backend service that powers core business logic, API services, and interacts with external platforms such as LinkedIn and Firebase.

---

## How can I edit this code?

There are several ways of editing your application:

### **Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f9a14ab2-5d6c-4bc5-a13d-c3cb1898d0b7) and start prompting. Changes made via Lovable will be committed automatically to this repo.

### **Use your preferred IDE**

If you want to work locally using your own IDE:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server (for job-ui).
npm run dev
```

### **Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon).
- Make your changes and commit.

### **Use GitHub Codespaces**

- Click "Code" > "Codespaces" > "New codespace"
- Edit directly and commit

---

## Running the Project

### 🖥️ Frontend: `job-ui`

```sh
cd job-ui
npm install
npm run dev
```

- The frontend will be available at [http://localhost:3000](http://localhost:3000)
- The app connects directly to your hosted Supabase instance (see your `.env` for keys)

### ⚙️ Backend: `job-core-services`

```sh
cd job-core-services
npm install
npm start # or check package.json for the right start script
```

### 🔄 Worker Service: `job-worker`

Make sure you have the .NET SDK installed.

```sh
cd job-worker
# If using CLI
dotnet restore
dotnet run
```

---

## How can I deploy this project?

Use Lovable.dev:

- Go to the project in [Lovable](https://lovable.dev/projects/f9a14ab2-5d6c-4bc5-a13d-c3cb1898d0b7)
- Click Share > Publish

---

## Can I connect a custom domain?

Yes! Navigate to:

- Project > Settings > Domains > Connect Domain

Docs: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---

## Additional Notes

- This project integrates with **Supabase** for authentication and database management (hosted, not local).
- Includes UI components, forms, and LinkedIn automation features.

To set up the project completely, make sure to:

- Configure environment variables for your hosted Supabase instance
- Review `README.md` or `/docs` for architectural and API details
- Explore Firebase and Supabase configurations as applicable

---

## Firebase Deployment Details

- Project Console: https://console.firebase.google.com/project/job-tracker-c0657/overview
- Hosting URL: https://job-tracker-c0657.web.app
