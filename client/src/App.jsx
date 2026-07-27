import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './utils/ProtectedRoute';

// Pages
import Home from './pages/Home';
import InsurancePage from './pages/InsurancePage';
import MutualFundsPage from './pages/MutualFundsPage';
import SipPlansPage from './pages/SipPlansPage';
import LumpsumPlansPage from './pages/LumpsumPlansPage';
import SipCalculatorPage from './pages/SipCalculatorPage';
import LumpsumCalculatorPage from './pages/LumpsumCalculatorPage';
import ContactPage from './pages/ContactPage';
import ClientDashboard from './pages/ClientDashboard';

// Auth
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

// Manager
import DashboardLayout from './components/layout/DashboardLayout';
import ManagerHome from './pages/manager/ManagerHome';
import InsuranceManagement from './pages/manager/InsuranceManagement';
import MutualFundManagement from './pages/manager/MutualFundManagement';
import SipPlanManagement from './pages/manager/SipPlanManagement';
import LumpsumPlanManagement from './pages/manager/LumpsumPlanManagement';
import CustomerManagement from './pages/manager/CustomerManagement';
import AppointmentManagement from './pages/manager/AppointmentManagement';
import MessageManagement from './pages/manager/MessageManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a2942',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#d4af37', secondary: '#0a1628' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#0a1628' } },
          }}
        />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/insurance" element={<ProtectedRoute><InsurancePage /></ProtectedRoute>} />
          <Route path="/mutual-funds" element={<ProtectedRoute><MutualFundsPage /></ProtectedRoute>} />
          <Route path="/sip-plans" element={<ProtectedRoute><SipPlansPage /></ProtectedRoute>} />
          <Route path="/lumpsum-plans" element={<ProtectedRoute><LumpsumPlansPage /></ProtectedRoute>} />
          <Route path="/sip-calculator" element={<SipCalculatorPage />} />
          <Route path="/lumpsum-calculator" element={<LumpsumCalculatorPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth */}
          <Route path="/login" element={<PublicOnlyRoute><LoginForm /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><RegisterForm /></PublicOnlyRoute>} />

          {/* Client Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute role="client"><ClientDashboard /></ProtectedRoute>} />

          {/* Manager Dashboard */}
          <Route path="/manager" element={<ProtectedRoute role="manager"><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<ManagerHome />} />
            <Route path="insurance" element={<InsuranceManagement />} />
            <Route path="mutual-funds" element={<MutualFundManagement />} />
            <Route path="sip-plans" element={<SipPlanManagement />} />
            <Route path="lumpsum-plans" element={<LumpsumPlanManagement />} />
            <Route path="customers" element={<CustomerManagement />} />
            <Route path="appointments" element={<AppointmentManagement />} />
            <Route path="messages" element={<MessageManagement />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
