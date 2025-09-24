# AI Workflow Hub

This project is a powerful, autonomous AI workflow application built with Next.js and Firebase. It allows users to upload documents, receive concise summaries, and extract actionable insights, all powered by Google's Gemini API. The application features a secure user dashboard where stakeholders can manage their summarization history, view details, and visualize insight relevance through interactive charts.

## How It Works

1.  **Authentication:** Users can sign up and log in securely using Firebase Authentication (Email & Password).
2.  **New Workflow:** Once authenticated, users can navigate to the "New Workflow" page to upload a document and provide a title.
3.  **AI Processing:** The application uses Genkit and the Gemini API to process the document. The AI first generates a concise summary.
4.  **Insight Generation:** Using the generated summary, the AI then extracts key insights and assigns a relevance score to each one.
5.  **Dashboard & History:** All results are saved to Firestore and are immediately available on the user's dashboard. Users can view a history of all their workflows, edit the details of past summaries, or delete them. The application also provides a bar chart to visualize the relevance of the insights.

## Tech Stack

This project is built with a modern, robust, and scalable tech stack:

-   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
-   **AI & Generative Flows:** [Genkit](https://firebase.google.com/docs/genkit)
-   **Generative AI Model:** [Gemini API](https://ai.google.dev/)
-   **Backend & Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth)
-   **Database:** [Cloud Firestore](https://firebase.google.com/docs/firestore)
-   **Charting:** [Recharts](https://recharts.org/)
-   **Forms:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

This project was bootstrapped in **Firebase Studio**.