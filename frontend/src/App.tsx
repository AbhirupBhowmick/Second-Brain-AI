import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import Graph from './components/Graph';
import Chat from './components/Chat';
import Settings from './components/Settings';
import LandingPage from './components/landing/LandingPage';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Router>
          <div className="min-h-screen bg-[#09090b] text-white font-sans overflow-x-hidden">
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Public Auth Page */}
              <Route path="/login" element={<Auth />} />

              {/* Protected App Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notes" 
                element={
                  <ProtectedRoute>
                    <Editor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/map" 
                element={
                  <ProtectedRoute>
                    <Graph />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
