export function getRoleFromToken() {
const t = localStorage.getItem('token')
if (!t) return null
try {
const base64Url = t.split('.')[1]
if (!base64Url) return null
const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
}).join(''))
const payload = JSON.parse(jsonPayload)
return payload.role || null
} catch (e) {
return null
}
}