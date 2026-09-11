# Taizer Ads - Sri Lanka Classifieds Platform (ශ්‍රී ලංකා දැන්වීම් ජාලය)

A modern, high-performance Classified Advertisements Web Platform built with **React**, **Vite**, **Tailwind CSS**, **Node.js/Express**, and **MongoDB Atlas**.

---

## 🌟 Key Features

- **Dynamic Public Ad Feed**: Real-time classified ads with rich category filters, search, badges (VIP, Urgent, Super Top), and pagination.
- **Mobile-First Experience**: App-like mobile navigation, Live Story Avatars, drawer menus, and category cards.
- **SMS OTP Verification**: Integrated phone-based authentication with SMS gateway (Notify.lk) and instant test-code fallback.
- **User Dashboard**: Post ads with image uploads, manage personal ads, credit balance wallet, and ad renewal requests.
- **CEO Super Admin Portal (`/ceo`)**:
  - Secure single email & single password authentication.
  - Ad management (Approve, Reject, Expire, Flag Scam/Fake, Delete).
  - User and Credits management (Top-up deposits and deductions).
  - Full site configuration (Banners, Pricing, Bank Details, Notice Banners, Verified Agents, Blog).
  - Ad complaint resolution center.
- **MongoDB Atlas Cloud Database**: Full persistence for Ads, Users, Stories, Complaints, and Site Configuration.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **MongoDB Atlas** database cluster (or local MongoDB)

### 2. Environment Setup
Create a `.env` file in the project root based on `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.ouxm37c.mongodb.net/taizer_ads?retryWrites=true&w=majority
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Servers
Starts both the Express API backend (Port 5000) and the Vite frontend (Port 3000) concurrently:
```bash
npm run dev
```

- Public Website: `http://localhost:3000`
- Super Admin Login: `http://localhost:3000/ceo`
- API Health Check: `http://localhost:5000/api/health`

### 5. Production Build
```bash
npm run build
```

---

## 🛡️ Security Note
The `.env` file containing database credentials is excluded via `.gitignore` and should never be committed to source control.
