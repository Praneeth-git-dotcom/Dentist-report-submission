import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Login from './pages/Login'
import TechnicianUpload from './pages/TechnicianUpload'
import DentistViewer from './pages/DentistViewer'
import ProtectedRoute from './components/ProtectedRoute'


export default function App(){
return (
<div className="container">
<Header />
<Routes>
<Route path="/" element={<Login />} />
<Route path="/technician" element={
<ProtectedRoute roleRequired="Technician">
<TechnicianUpload />
</ProtectedRoute>
} />
<Route path="/dentist" element={
<ProtectedRoute roleRequired="Dentist">
<DentistViewer />
</ProtectedRoute>
} />
</Routes>
</div>
)
}