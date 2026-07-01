import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Dashboard
import DashboardPage from './pages/dashboard/DashboardPage';

// Employees
import EmployeesPage from './pages/employees/EmployeesPage';
import EmployeeDetailPage from './pages/employees/EmployeeDetailPage';
import EmployeeFormPage from './pages/employees/EmployeeFormPage';

// Departments
import DepartmentsPage from './pages/departments/DepartmentsPage';
import DepartmentDetailPage from './pages/departments/DepartmentDetailPage';
import DepartmentFormPage from './pages/departments/DepartmentFormPage';

// Projects
import ProjectsPage from './pages/projects/ProjectsPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import ProjectFormPage from './pages/projects/ProjectFormPage';

// Assignments
import AssignmentsPage from './pages/assignments/AssignmentsPage';
import AssignmentFormPage from './pages/assignments/AssignmentFormPage';

// Dependents
import DependentsPage from './pages/dependents/DependentsPage';
import DependentFormPage from './pages/dependents/DependentFormPage';

// Reports
import ReportsPage from './pages/reports/ReportsPage';

// Profile
import ProfilePage from './pages/profile/ProfilePage';

// Admin
import UsersPage from './pages/admin/UsersPage';
import IntegrityPage from './pages/admin/IntegrityPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

          {/* Employees */}
          <Route path="/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />
          <Route path="/employees/new" element={<ProtectedRoute requireAdmin><EmployeeFormPage /></ProtectedRoute>} />
          <Route path="/employees/:id" element={<ProtectedRoute><EmployeeDetailPage /></ProtectedRoute>} />
          <Route path="/employees/:id/edit" element={<ProtectedRoute requireAdmin><EmployeeFormPage /></ProtectedRoute>} />

          {/* Departments */}
          <Route path="/departments" element={<ProtectedRoute><DepartmentsPage /></ProtectedRoute>} />
          <Route path="/departments/new" element={<ProtectedRoute requireAdmin><DepartmentFormPage /></ProtectedRoute>} />
          <Route path="/departments/:id" element={<ProtectedRoute><DepartmentDetailPage /></ProtectedRoute>} />
          <Route path="/departments/:id/edit" element={<ProtectedRoute requireAdmin><DepartmentFormPage /></ProtectedRoute>} />

          {/* Projects */}
          <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
          <Route path="/projects/new" element={<ProtectedRoute requireAdmin><ProjectFormPage /></ProtectedRoute>} />
          <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
          <Route path="/projects/:id/edit" element={<ProtectedRoute requireAdmin><ProjectFormPage /></ProtectedRoute>} />

          {/* Assignments */}
          <Route path="/assignments" element={<ProtectedRoute><AssignmentsPage /></ProtectedRoute>} />
          <Route path="/assignments/new" element={<ProtectedRoute requireAdmin><AssignmentFormPage /></ProtectedRoute>} />
          <Route path="/assignments/:id/edit" element={<ProtectedRoute requireAdmin><AssignmentFormPage /></ProtectedRoute>} />

          {/* Dependents */}
          <Route path="/dependents" element={<ProtectedRoute><DependentsPage /></ProtectedRoute>} />
          <Route path="/dependents/new" element={<ProtectedRoute requireAdmin><DependentFormPage /></ProtectedRoute>} />
          <Route path="/dependents/:id/edit" element={<ProtectedRoute requireAdmin><DependentFormPage /></ProtectedRoute>} />

          {/* Reports */}
          <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />

          {/* Profile */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/users" element={<ProtectedRoute requireAdmin><UsersPage /></ProtectedRoute>} />
          <Route path="/admin/integrity" element={<ProtectedRoute requireAdmin><IntegrityPage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
