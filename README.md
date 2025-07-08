# HealthConnect

HealthConnect is a full-stack web application designed to streamline hospital management and patient appointment booking. It features real-time updates, secure authentication, automated appointment reminders, and a modern, responsive frontend.

## Features

- **Hospital Management:** Admins can manage hospital details, facilities, and bed availability.
- **Appointment Booking:** Users can search for hospitals and book appointments online.
- **Real-Time Updates:** Uses Socket.IO for real-time updates on hospital data and appointments.
- **Appointment Reminders:** Automated email reminders are sent to users a day before their appointment using cron jobs and SendGrid.
- **Authentication:** Secure login and role-based access for users and admins.
- **Modern UI:** Built with React and Tailwind CSS for a responsive and user-friendly experience.

## Project Structure

```
HealthConnect/
├── Backend/
│   ├── app.js                # Main Express server with Socket.IO
│   ├── controllers/          # Route controllers (admin, appointment, hospital, user)
│   ├── data/                 # Static data (e.g., hospital.json)
│   ├── middlewares/          # Auth and JWT middleware
│   ├── models/               # Mongoose models
│   ├── routes/               # Express routes
│   ├── scripts/              # Utility scripts (e.g., seedHospitals.js)
│   ├── util/                 # Database connection
│   └── views/                # (Reserved for server-side views)
├── Frontend/
│   ├── src/
│   │   ├── components/       # React components (UI, admin, hospital, etc.)
│   │   ├── context/          # React context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility libraries (e.g., axios)
│   │   ├── pages/            # Page components (Index, Results, HospitalProfile, etc.)
│   │   ├── services/         # API and socket services
│   │   └── utils/            # Helper functions
│   ├── public/               # Static assets
│   ├── index.html            # Main HTML file
│   └── ...                   # Config files (Vite, Tailwind, ESLint, etc.)
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or cloud)

### Backend Setup
1. Navigate to the `Backend` directory:
   ```sh
   cd Backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   SENDGRID_API_KEY=your_sendgrid_api_key
   ```
4. (Optional) Seed hospital data:
   ```sh
   node scripts/seedHospitals.js
   ```
5. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to the `Frontend` directory:
   ```sh
   cd Frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm run dev
   ```

## Usage
- Access the frontend at `http://localhost:5173` (default Vite port).
- The backend runs on the port specified in your `.env` (default: 5000).
- Use the application to search for hospitals, book appointments, and manage hospital data as an admin.
- **Live Demo:** [https://healthconnect-frontend.onrender.com](https://healthconnect-frontend.onrender.com)

## Technologies Used
- **Backend:** Node.js, Express, MongoDB, Mongoose, Socket.IO, Passport.js
- **Frontend:** React, Vite, Tailwind CSS, Axios

## License
This project is licensed under the MIT License.
