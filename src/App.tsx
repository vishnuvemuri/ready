import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { VendorProvider } from './contexts/VendorContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import VenuesPage from './pages/VenuesPage';
import JewelryPage from './pages/JewelryPage';
import PhotographersPage from './pages/PhotographersPage';
import InvitationCardsPage from './pages/InvitationCardsPage';
import MakeupHairstylistPage from './pages/MakeupHairstylistPage';
import EventPlannersPage from './pages/EventPlannersPage';
import EventAnchorsPage from './pages/EventAnchorsPage';
import WeddingAttirePage from './pages/WeddingAttirePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <VendorProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/venues" element={
                <ProtectedRoute>
                  <VenuesPage />
                </ProtectedRoute>
              } />
              <Route path="/jewelry" element={
                <ProtectedRoute>
                  <JewelryPage />
                </ProtectedRoute>
              } />
              <Route path="/photographers" element={
                <ProtectedRoute>
                  <PhotographersPage />
                </ProtectedRoute>
              } />
              <Route path="/invitation-cards" element={
                <ProtectedRoute>
                  <InvitationCardsPage />
                </ProtectedRoute>
              } />
              <Route path="/makeup-hairstylist" element={
                <ProtectedRoute>
                  <MakeupHairstylistPage />
                </ProtectedRoute>
              } />
              <Route path="/event-planners" element={
                <ProtectedRoute>
                  <EventPlannersPage />
                </ProtectedRoute>
              } />
              <Route path="/event-anchors" element={
                <ProtectedRoute>
                  <EventAnchorsPage />
                </ProtectedRoute>
              } />
              <Route path="/wedding-attire" element={
                <ProtectedRoute>
                  <WeddingAttirePage />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </VendorProvider>
    </AuthProvider>
  );
}

export default App;