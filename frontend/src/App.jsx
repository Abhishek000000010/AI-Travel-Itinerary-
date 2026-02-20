import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FormPage from './pages/FormPage';
import DashboardPage from './pages/DashboardPage';
import Sidebar from './components/Sidebar';

function App() {
    return (
        <Router>
            <div className="flex min-h-screen bg-[#F8FAFC]">
                <Sidebar />
                <main className="flex-1 ml-64 min-h-screen relative">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/plan" element={<FormPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/my-trips" element={<DashboardPage />} />
                        <Route path="/favorites" element={<DashboardPage />} />
                        <Route path="/settings" element={<DashboardPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
