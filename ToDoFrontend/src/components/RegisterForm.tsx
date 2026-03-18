import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import './LoginForm.css';

export default function RegisterForm(){
    const { register } = useAuth()
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      const [error, setError] = useState<string | null>(null);
      const [loading, setLoading] = useState(false);

      async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
          }
        setLoading(true);
    
    
      try {
      
          await register(form.username,form.email,form.password);
          navigate("/tasks", { replace: true });
        } catch (e: any) {
          setError(e.message ?? "Register failed");
        } finally {
          setLoading(false);
        }
      }

      function handleChange(e:React.ChangeEvent<HTMLInputElement>){
        const {name,value}=e.target;
        
        setForm(prev=>({
            ...prev,
            [name]:value
        }))

      }
    
   return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
        <p className="auth-subtitle">Create your account to get started.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              id="username"
              className="form-input"
              name="username" 
              value={form.username} 
              onChange={handleChange} 
              type="text" 
              required 
              placeholder="Choose a username" 
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              className="form-input"
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              type="email" 
              required 
              placeholder="Enter your email" 
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              className="form-input"
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              type="password" 
              required 
              minLength={8} 
              placeholder="Create a password (min 8 characters)" 
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword"
              className="form-input"
              name="confirmPassword" 
              value={form.confirmPassword} 
              onChange={handleChange} 
              type="password"  
              required 
              minLength={8} 
              placeholder="Repeat your password" 
              autoComplete="new-password"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Log In</Link>
        </div>
      </div>
    </div>
   )

}



