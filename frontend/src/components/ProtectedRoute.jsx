import React from 'react'
import { Navigate } from 'react-router-dom'
import { getRoleFromToken } from '../utils/jwt'


export default function ProtectedRoute({ roleRequired, children }) {
const role = getRoleFromToken()
if (!role) return <Navigate to="/" replace />
if (role !== roleRequired) return <Navigate to="/" replace />
return children
}