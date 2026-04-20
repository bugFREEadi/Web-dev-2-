# 🚀 CrisisConnect: Real-Time Disaster Coordination Platform

**CrisisConnect** is a high-fidelity, production-grade emergency response platform designed to bridge the gap between disaster victims (Citizens) and active responders (Volunteers). Built with a minimalist, high-contrast aesthetic and powered by a real-time serverless architecture, it provides a mission-critical command center for modern crisis management.

---

## ⚡ Core Features

### 🆘 SOS Response Workflow
- **One-Click Reporting:** Rapid SOS submission for citizens in distress.
- **Mission Acceptance:** Volunteers can browse pending requests and "Accept Mission" with a single click.
- **Real-Time Synergy:** Bidirectional status updates (Pending → Assigned → In Progress → Resolved) visible to both the owner and the responder.
- **Priority Logic:** Automatic color-coded prioritization (Critical, High, Medium, Low) for efficient resource allocation.

### 👥 Volunteer Coordination
- **Availability Toggles:** Responders can go "Online/Offline" to manage their duty status.
- **Skill Mapping:** Categorization of volunteers by expertise (Medical, Rescue, Logistics, etc.).
- **O(1) Performance:** Optimized data structures for instant responder lookups across the platform.

### 🛡️ Secure Operations
- **Social Onboarding:** Seamless Google Sign-In with a dedicated role-selection flow for new users.
- **Permission Guardrails:** Strict data sovereignty ensuring only request owners can edit details or nudge responders.
- **Firebase Auth:** Multi-factor ready authentication and secure user profile management.

### 📊 Tactical Dashboard
- **Live Analytics:** Real-time impact charts showing disaster trends and resolution rates.
- **Resource Management:** Full inventory CRUD for tracking medical supplies, food, and equipment.
- **Activity Feed:** A chronological feed of recent emergencies for immediate situational awareness.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite |
| **Styling** | Custom Vanilla CSS (Modern Minimalist System) |
| **Animations** | Framer Motion |
| **Backend** | Google Firebase (Firestore, Auth) |
| **Icons** | Lucide React |
| **Charts** | Recharts |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Google Firebase account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bugFREEadi/CrisisConnect.git
   cd CrisisConnect
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env.local` file in the root and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```

---

## 🎨 Design Philosophy

CrisisConnect follows the **"Linear Aesthetic"**—high contrast, monochromatic base with vibrant accent colors for critical interactions.
- **Typography:** Space Grotesk (Headers) & Inter (Body)
- **Palette:** `#000000` (Background), `#FF5CCD` (Accents), `#FF6E00` (Critical CTA)
- **Interaction:** Subtle micro-animations and spring-based transitions for a premium, responsive feel.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

**Built with ❤️ for a safer world.**
