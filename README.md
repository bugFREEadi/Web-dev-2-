# 🆘 CrisisConnect: Disaster Response & Humanitarian Coordination

**CrisisConnect** is a professional-grade emergency management platform built to synchronize disaster relief operations between citizens and responders in real-time. It provides a mission-critical interface for tracking SOS requests, managing volunteer rosters, and coordinating logistics during critical incidents.

---

## ⚡ Key Capabilities

### 🚨 Real-Time SOS Command Center
- **Instant Reporting:** Minimalist interface for citizens to submit SOS alerts with location and priority.
- **Dynamic Triaging:** Automatic categorization (Critical, High, Medium, Low) for prioritized response.
- **Mission Lifecycle:** Real-time state management for tasks (Pending → Assigned → In-Progress → Resolved).

### 🤝 Humanitarian Coordination
- **Volunteer Management:** Track active responder status (Online/Offline) and specialized skill sets.
- **Resource Allocation:** CRUD interface for managing medical supplies, food distribution, and rescue equipment.
- **Live Sync:** Powered by Firebase/Firestore for sub-second updates across all connected devices.

### 🛡️ Secure Infrastructure
- **Unified Onboarding:** Google-integrated authentication with specialized role selection (Citizen vs. Volunteer).
- **Data Guardrails:** Strict permission layers ensuring data sovereignty for request owners and responders.

---

## 🛠️ Technical Implementation

| Component | Technology |
| :--- | :--- |
| **Framework** | React 19 (Vite) |
| **Real-time DB** | Firebase Firestore |
| **Auth** | Firebase Authentication |
| **Styling** | Custom Design System (Vanilla CSS + Lucide Icons) |
| **Animations** | Framer Motion |
| **Charts** | Recharts |

---

## 🚀 Deployment & Installation

### 1. Repository Setup
```bash
git clone https://github.com/bugFREEadi/Web-dev-2-.git
cd Web-dev-2-
```

### 2. Dependency Installation
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file with your Firebase project credentials:
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 🎨 Design Philosophy
The platform employs a high-contrast, mission-critical aesthetic designed for high visibility under stress. 
- **Typography:** Space Grotesk (Headers) for clarity & Inter (Body) for legibility.
- **Interaction:** Performance-optimized spring physics to ensure a responsive, premium feel during high-pressure usage.

---

## 📄 License
Project distributed under the MIT License.

**Built for a safer, more connected world.**

