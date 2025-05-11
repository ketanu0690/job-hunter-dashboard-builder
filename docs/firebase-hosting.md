# Firebase Hosting and Deployment

This document outlines the steps required to set up Firebase Hosting for your web application and deploy it.

## 1. Installing the Firebase CLI

To interact with Firebase from your terminal, you need to install the Firebase Command Line Interface (CLI). If you don't have Node.js and npm installed, you'll need to do that first.

Install the Firebase CLI globally using npm:
```
bash
npm install -g firebase-tools
```
## 2. Initializing Firebase

You need to initialize Firebase in your project to create the necessary configuration files. It is crucial to run this command from the **root directory of your project** (`job-hunter-dashboard-builder`), not the `job-ui` subdirectory.

Navigate to the project root in your terminal:
```
bash
cd job-hunter-dashboard-builder
```
Then, run the initialization command:
```
bash
firebase init
```
Follow the on-screen prompts:

*   When asked "Which Firebase features do you want to set up for this directory?", use the spacebar to select **"Hosting: Configure files for Firebase Hosting..."** and press Enter.
*   Select an existing Firebase project or create a new one.
*   Answer the subsequent questions regarding your hosting setup.

## 3. Building the Application

Before deploying, you need to build your web application for production. This optimizes your code and assets for performance.

Navigate to the `job-ui` directory:
```
bash
cd job-ui
```
Run the build command (as defined in your `job-ui/package.json`):
```
bash
npm run build
```
This command will typically create a `dist` folder inside the `job-ui` directory, containing your production-ready files.

## 4. Configuring firebase.json

The `firebase.json` file in your **project's root directory** (`job-hunter-dashboard-builder`) controls your Firebase deployment. You need to ensure it points to the correct directory containing your built application files.

Open the `firebase.json` file and ensure the `hosting` section is configured as follows:
```
json
{
  "hosting": {
    "public": "job-ui/dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```
*   `"public": "job-ui/dist"`: This tells Firebase to deploy the contents of the `dist` folder located inside the `job-ui` directory.
*   `"ignore"`: This lists files and folders to exclude from the deployment.
*   `"rewrites"`: This configures single-page application routing by directing all requests to `index.html`.

## 5. Deploying to Firebase

Once your application is built and `firebase.json` is configured correctly in your project's root directory, you can deploy your web app to Firebase Hosting.

Navigate back to the **root directory of your project**:
```
bash
cd ..
```
Run the deployment command:
```
bash
firebase deploy --only hosting
```
The Firebase CLI will upload your files and provide you with the URL where your application is hosted once the deployment is complete.