---
sidebar_position: 3
---

# Starting the Front-End (Vue 3 + Vite)

This project is the front-end interface of **Ressonance**, built using **Vue 3**, **Vite**, **Pinia**, **Vue Router**, and **TailwindCSS**.  
You can run it locally in development mode or build it for production deployment.

---

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (version 18 or higher recommended)
- **npm** (comes with Node.js)

---

## Running the Project in Development Mode

This option is recommended while building or testing new features, as it provides hot module replacement and instant feedback.

### 1. Clone the Project

```bash
git clone https://github.com/ressonancia/spa ressonance-spa
cd ressonance-spa
```

### 2. Install Dependencies

This installs all required JavaScript packages, including Vue, Vite, Tailwind, and others.

```bash
npm install
```

### 3. Configure Environment Variables

This project uses environment variables (e.g., API base URL), so, let's create the .env file:

```bash
cp .env.example .env
```

## Building the Project for Production

When you're ready to deploy the SPA, generate optimized static assets by running:

```bash
npm run build
```

This creates a dist/ folder containing the production-ready files.

## Deploying the assets

This project includes a helper script named deploy.sh that automates production deployment via SSH.

### 1. Ensure the Script Is Executable

```bash
chmod +x deploy.sh
```

### 2. Run the Deployment Script

```bash
./deploy.sh
```

The script will:

* Build the project (npm run build)
* Connect via SSH using the configured key
* Upload all files in dist/ to your server at the path defined in the script: /var/www/html/ressonance-spa


### 3. Requirements for Deployment Script

* A remote Linux server with SSH access
* A configured SSH key (e.g., ~/.ssh/id_rsa_ressonance)
* Proper permissions on the destination folder
* Nginx (or another web server) pointing to the deployed folder