<div align="center">
  <div>
    <img alt="Static Badge" src="https://img.shields.io/badge/React-4c84f3?style=for-the-badge&logo=react&logoColor=white">
    <img src="https://img.shields.io/badge/-Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img src="https://img.shields.io/badge/-NodeJS-black?style=for-the-badge&logoColor=white&logo=node.js&color=3178C6" alt="JavaScript" />
    <img src="https://img.shields.io/badge/-MongoDB-black?style=for-the-badge&logoColor=white&logo=mongodb&color=3178C6" alt="JavaScript" />
    <img src="https://img.shields.io/badge/-ExpressJS-black?style=for-the-badge&logoColor=white&logo=express&color=3178C6" alt="JavaScript" />
  </div>

  <h3 align="center">VoiceNote Manager</h3>

</div>

## 📋 Table of Contents

1. ✨ [Introduction](#✨-introduction)
2. 🤸 [Quick Start](#🤸-quick-start)
3. 🎥 [Demo Video](#🎥-demo-video)
4. ⚙️ [Tech Stack](#⚙️-tech-stack)
5. 🤖 [AI Technology](#🤖-ai-technology)
6. 🗂️ [Database Schema](#🗂️-database-schema)
7. 🔋 [Features](#🔋-features)

## ✨ Introduction

It is an VoiceNote Manager Web APP in which user can record voice note and transcribe it into text and then it can be saved in the database. User can edit the generated transcription and also user can generate an short AI Summary for that Voice Note.

If you have any questions or suggestions, please feel free to contact me.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?logo=linkedin&style=flat-square)](https://www.linkedin.com/in/mohit-gusain-9b687a257/) 
[![Email](https://img.shields.io/badge/Email-Send%20Mail-red?logo=gmail&style=flat-square)](mailto:mohitgusain8671@gmail.com) 

## 🤸 Quick Start

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas account)
- [Gemini API Key](https://aistudio.google.com/)

**Cloning the Repository**

```bash
git clone https://github.com/mohitgusain8671/VoiceNote.git
cd VoiceNote
```
**Running Frontend**

- **Installation**

    Install the project dependencies using npm:

    ```bash
    npm install
    ```

- **Configuration**

    Create a `.env` file in the root directory and add the following environment variables:

    ```bash
    VITE_SERVER_URL= 'server/backend-url'
    ```

- **Running the Project**

    ```bash
    npm run dev
    ```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the project.

**Running Backend**

- **Installation**

    Install the project dependencies using npm:

    ```bash
    npm install
    ```

- **Configuration**

    Create a `.env` file in the root directory and add the following environment variables:

    ```bash
    PORT= 'port-number' 
    NODE_ENV='devlopment'
    DB_URI= 'mongodb+srv://username:password@cluster0.8qjz0.mongodb.net/?retryWrites=true&w=majority'
    JWT_SECRET= 'jwt-secret'
    GEMINI_API_KEY= 'gemini-api-key'
    SERVER_URL='server-url'
    ORIGIN='frontend-base-url'
    EMAIL_USER='your-email'
    EMAIL_PASS='app-password'
    ```

- **Start the Server**

    ```bash
    npm run dev
    ```
    or 
    ```bash
    node index.js
    ```

Server will starts at the mentioned PORT Number

## 🎥 Demo Video

- [▶ Watch the video](https://drive.google.com/file/d/14dS7DdiPpFc86BTu3zMC6lfwtZQTHYRh/view?usp=sharing)
- or copy the below URL
    `https://drive.google.com/file/d/14dS7DdiPpFc86BTu3zMC6lfwtZQTHYRh/view?usp=sharing`

## ⚙️ Tech Stack

- **[React](https://react.dev/)** is a popular open‑source JavaScript library for building user interfaces using reusable components and a virtual DOM, enabling efficient, dynamic single-page and native apps.

- **[Tailwind CSS](https://tailwindcss.com/)** is a utility-first CSS framework that allows developers to design custom user interfaces by applying low-level utility classes directly in HTML, streamlining the design process.

- **[Node JS](https://nodejs.org/docs/latest/api/)** is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows developers to run JavaScript code outside of a web browser and provides a set of core modules for server‑side development.

- **[Express JS](https://expressjs.com/)** is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It is built on top of Node.js and provides a set of features for web and mobile applications.

- **[Vite](https://vite.dev/)** is a fast build tool and dev server using native ES modules for instant startup, hot‑module replacement, and Rollup‑powered production builds—perfect for modern web development.

- **[Zustand](https://github.com/pmndrs/zustand)** is a minimal, hook-based state management library for React. It lets you manage global state with zero boilerplate, no context providers, and excellent performance through selective state subscriptions.

## 🤖 AI Technology

- **[Gemini AI](https://aistudio.google.com/)** is a powerful AI model that can generate text, translate languages, and answer questions based on the input provided. It is trained on a large dataset and can be fine-tuned for specific tasks.

## 🗂️ Database Schema

- **This Project uses MongoDB for storing data**
- **Audio Files are stored locally inside the `backend/uploads/audio` folder**

<div align='center'>
    <img src="Schema.png" alt="Schema"/>
</div>

## 🔋 Features

👉 **Authentication**: User can Register and Login to the application. proper authentication has been implemented using JWT

👉 **Add New Voice Note**: Let users record audio transcribe it using google gemini and store it.

👉 **AI Summary Generator**: Provide an Small AI Generated Summary for the Voice Notes.

👉 **Edit and Delete Notes**: User can edit and delete the notes

👉 **User Dashboard**: User dashboard contains all the notes and also the small statistics about the notes.

👉 **Modern UI/UX**: Clean, responsive design built with Tailwind CSS for a sleek user experience.
