import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfileThunk } from '../store/slices/authSlice'
import { authService } from '../services/auth.service'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  
  const [profileData, setProfileData] = useState({ first_name: '', last_name: '' })
  const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '' })
  const [profileStatus, setProfileStatus] = useState({ type: '', msg: '' })
  const [passwordStatus, setPasswordStatus] = useState({ type: '', msg: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchProfileThunk())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      setProfileData({ first_name: user.first_name, last_name: user.last_name })
    }
  }, [user])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileStatus({ type: '', msg: '' })
    setLoading(true)
    try {
      await authService.updateProfile(profileData)
      setProfileStatus({ type: 'success', msg: 'Profile updated successfully!' })
      dispatch(fetchProfileThunk())
    } catch (err) {
      setProfileStatus({ type: 'error', msg: err?.response?.data?.error || 'Failed to update profile' })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordStatus({ type: '', msg: '' })
    setLoading(true)
    try {
      // Need to hit /api/v1/users/me/password
      // I will add this to auth.service
      await authService.changePassword(passwordData.old_password, passwordData.new_password)
      setPasswordStatus({ type: 'success', msg: 'Password changed successfully!' })
      setPasswordData({ old_password: '', new_password: '' })
    } catch (err) {
      setPasswordStatus({ type: 'error', msg: err?.response?.data?.error || 'Failed to change password' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem' }}>My Profile</h1>
      
      <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Personal Information</h3>
        
        {profileStatus.msg && (
          <div className={`alert alert-${profileStatus.type}`} style={{ marginBottom: '1.5rem' }}>
            {profileStatus.msg}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input 
                className="form-input" 
                value={profileData.first_name} 
                onChange={(e) => setProfileData(p => ({ ...p, first_name: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input 
                className="form-input" 
                value={profileData.last_name} 
                onChange={(e) => setProfileData(p => ({ ...p, last_name: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email Address (Read-Only)</label>
            <input className="form-input" value={user?.email || ''} readOnly style={{ opacity: 0.6 }} />
          </div>
          <div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Change Password</h3>
        
        {passwordStatus.msg && (
          <div className={`alert alert-${passwordStatus.type}`} style={{ marginBottom: '1.5rem' }}>
            {passwordStatus.msg}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input 
              type="password"
              className="form-input" 
              value={passwordData.old_password} 
              onChange={(e) => setPasswordData(p => ({ ...p, old_password: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input 
              type="password"
              className="form-input" 
              value={passwordData.new_password} 
              onChange={(e) => setPasswordData(p => ({ ...p, new_password: e.target.value }))}
              required
              minLength={8}
            />
          </div>
          <div>
            <button type="submit" className="btn btn-danger" disabled={loading}>
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
