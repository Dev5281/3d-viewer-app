# 3D Viewer App

A full-stack 3D model viewer application built with React, Three.js, and Express.js. Upload and view GLB/GLTF models with customizable settings.

## Features

- 🎨 Upload and view GLB/GLTF 3D models
- 🎨 Customizable background colors
- 🎨 Wireframe mode toggle
- 🎨 HDRI environment support
- 🎨 Interactive 3D controls (orbit, zoom, pan)
- 💾 Save and restore viewer settings
- 🚀 Modern, responsive UI

## Tech Stack

### Frontend
- React 18
- React Three Fiber
- Three.js
- @react-three/drei
- Vite
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Multer (file uploads)

## Project Structure

```
3d-viewer-app/
├── client/          # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── api/           # API client
│   │   └── ...
│   └── ...
├── server/          # Express backend API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── models/        # MongoDB models
│   │   └── ...
│   └── uploads/     # Uploaded model files
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 3d-viewer-app
```

2. Install client dependencies:
```bash
cd client
npm install
```

3. Install server dependencies:
```bash
cd ../server
npm install
```

### Configuration

1. Create a `.env` file in the `server` directory:
```env
MONGO_URI=mongodb://localhost:27017/3d-viewer-app
PORT=5000
```

2. Update the MongoDB URI if using MongoDB Atlas or a different connection string.

### Running the Application

1. Start the server:
```bash
cd server
npm start
```

2. Start the client (in a new terminal):
```bash
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Upload a Model**: Click "Choose File" and select a GLB or GLTF file
2. **Customize Settings**:
   - Change background color using the color picker
   - Toggle wireframe mode
   - Enable HDRI environment
3. **Interact with Model**:
   - Left-click and drag to orbit
   - Right-click and drag to pan
   - Scroll to zoom
4. **Save Settings**: Click "Save Settings" to persist your preferences

## API Endpoints

- `POST /api/upload` - Upload a 3D model file
- `GET /api/settings` - Get saved viewer settings
- `POST /api/settings` - Save viewer settings

## Deployment

This is a full-stack application that requires both frontend and backend to be deployed separately.

- **Frontend**: Deploy to Vercel (see `DEPLOYMENT.md`)
- **Backend**: Deploy to Railway, Render, or Heroku (see `DEPLOYMENT.md`)

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## License

MIT

## Author

Dev Singh

