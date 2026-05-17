import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import UnlockHistoryPage from "./pages/UnlockHistoryPage";
import PrivateRoute from "./pages/PrivateRoute";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<LoginPage defaultMode="register" />} />
                <Route path="/dashboard" element={
                    <PrivateRoute><Dashboard /></PrivateRoute>
                } />
                <Route path="/history" element={
                    <PrivateRoute><UnlockHistoryPage /></PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;