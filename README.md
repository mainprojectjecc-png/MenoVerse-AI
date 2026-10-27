 MenoVerse AI 🌸

 AI-Powered Women's Health Monitoring and Menopause Risk Prediction

MenoVerse AI is a web-based women's health monitoring platform designed to help users track menstrual health, record menopause-related symptoms, and explore AI-assisted menopause risk predictions.

The project integrates a React frontend, a FastAPI backend, and a Random Forest machine learning model to bring health tracking and risk classification together in one application.

 🎯 Objectives

- Develop a user-friendly women's health monitoring platform.
- Enable menstrual cycle and symptom tracking.
- Use machine learning to classify submitted health data into Low, Moderate, and High risk categories.
- Present health information and prediction results through a dashboard.
- Build a foundation for future personalized wellness features.

 ✨ Features

- **User Authentication:** Registration, login, and account management.
- **Health Profile:** Manage user profile information.
- **Menstrual Cycle Tracking:** Record menstrual cycle details.
- **Symptom Tracking:** Record symptoms such as hot flashes, night sweats, sleep disturbances, fatigue, anxiety, and headaches.
- **AI Risk Prediction:** Generate risk classifications using a Random Forest model.
- **Health Dashboard:** View health information and prediction results.
- **Password Reset:** Support for account password recovery.
- **Modular Design:** Separate frontend, backend, dataset, and machine learning components.

🧠 Machine Learning

MenoVerse AI uses a Random Forest classification model trained on a menopause-related dataset.

The model uses health, symptom, lifestyle, and demographic features to predict one of three categories:

- Low Risk
- Moderate Risk
- High Risk

These categories represent experimental model predictions, not confirmed menopause stages or medical diagnoses. The model requires appropriate validation before any clinical use.

 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, JavaScript, HTML, CSS |
| Backend | Python, FastAPI |
| Machine Learning | Scikit-learn, Random Forest |
| Data Processing | Pandas |
| Model Management | Joblib |
| API Documentation | FastAPI Swagger UI |
| Version Control | Git and GitHub |

 📁 Project Structure

```text
MenoVerse-AI/
├── backend/       # Backend APIs and application logic
├── frontend/      # React frontend application
├── dataset/       # Project datasets
├── ml/            # ML training scripts and model files
├── postures/      # Exercise/posture-related resources
└── README.md      # Project documentation
```

 🚀 Getting Started

 Prerequisites

- Python
- Node.js and npm
- Git
- Visual Studio Code (recommended)

 1. Clone the Repository

```bash
git clone https://github.com/mainprojectjecc-png/MenoVerse-AI.git
cd MenoVerse-AI
```

 2. Run the Backend

Open a terminal in the project directory:

```bash
cd backend
```

Create and activate a virtual environment, then install the dependencies specified in the project's requirements file.

For Windows PowerShell:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

If the backend entry point is `main.py` and its FastAPI instance is named `app`, start it with:

```bash
uvicorn main:app --reload
```

API documentation is available at `http://127.0.0.1:8000/docs` when the backend is running on its default address and port.

 3. Run the Frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal.

Note: Follow the project's actual configuration and environment-variable requirements. Some commands may need adjustment depending on the installed dependencies and application entry points.

 🔮 Future Enhancements

Potential future developments include:

- Personalized wellness recommendations.
- Health history and risk trend visualization.
- AI-generated health reports.
- Voice-based symptom recording and analysis.
- Wearable device and IoT health monitoring.
- Digital Twin-based personalized health monitoring.
- Enhanced privacy and security controls.

These are proposed enhancements and should not be considered implemented unless they are available in the current codebase.

 🔒 Responsible Use and Privacy

MenoVerse AI is an academic software project and is not intended to replace professional medical advice, diagnosis, or treatment.

Never commit passwords, API keys, email app passwords, database credentials, or private health records to the repository.

 📌 Project Information

- Project Name: MenoVerse AI
- Domain: Artificial Intelligence, Machine Learning, and Women's Healthcare
- Project Type: Academic Software Development Project
- GitHub Repository: [MenoVerse-AI](https://github.com/mainprojectjecc-png/MenoVerse-AI)

 📄 Copyright and License

Copyright © 2026 MenoVerse AI. All rights reserved.

This repository is publicly available for viewing and educational reference. No permission is granted to copy, modify, redistribute, or use this code without authorization from the applicable copyright holder.
No open-source license has been provided for this project.
