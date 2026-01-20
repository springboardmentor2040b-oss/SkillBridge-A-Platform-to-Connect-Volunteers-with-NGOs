# SkillBridge

SkillBridge is a full-stack web application that connects volunteers with NGOs, enabling skill-based volunteering opportunities. The platform allows NGOs to post opportunities and volunteers to apply, with real-time messaging for seamless communication.

## Features

- **User Authentication**: Secure signup and login for volunteers and NGOs
- **Role-Based Access**: Different dashboards for volunteers and NGOs
- **Opportunity Management**: NGOs can create, edit, and manage volunteering opportunities
- **Application System**: Volunteers can browse and apply for opportunities
- **Real-Time Messaging**: Integrated chat system for communication between volunteers and NGOs
- **Notifications**: Real-time notifications for new messages and updates
- **Responsive Design**: Mobile-friendly interface built with React and Tailwind CSS

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** for database
- **JWT** for authentication
- **Socket.io** for real-time communication
- **bcrypt** for password hashing

### Frontend
- **React** with **Vite** for fast development
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Socket.io-client** for real-time features
- **Lucide React** and **React Icons** for icons

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the Backend directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=4001
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:4001`

### Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## Usage

1. **Signup**: Create an account as either a volunteer or NGO
2. **Login**: Access your dashboard
3. **For NGOs**:
   - Create volunteering opportunities
   - View and manage applications
   - Communicate with applicants via chat
4. **For Volunteers**:
   - Browse available opportunities
   - Apply for positions that match your skills
   - Chat with NGOs about opportunities

## API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login

### Opportunities
- `GET /api/opportunities` - Get all opportunities
- `POST /api/opportunities` - Create new opportunity (NGO only)
- `PUT /api/opportunities/:id` - Update opportunity (NGO only)
- `DELETE /api/opportunities/:id` - Delete opportunity (NGO only)

### Applications
- `GET /api/applications` - Get user applications
- `POST /api/applications` - Submit application
- `PUT /api/applications/:id` - Update application status

### Messages
- `GET /api/messages/:applicationId` - Get chat messages
- `POST /api/messages` - Send message

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Project Structure

```
skillbridge/
├── Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── socket.js
│   └── package.json
├── .gitignore
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

