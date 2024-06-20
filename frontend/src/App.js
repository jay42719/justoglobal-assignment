import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from 'react-router-dom';

const Login = () => {
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                history('/time');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input type="text" placeholder="Username" value={userName} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} style={{marginLeft: '15px'}}onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin} style={{marginLeft: '15px'}}>Login</button>
        </div>
    );
};

const RequestLink = () => {
    const [userName, setUsername] = useState('');
    const [link, setLink] = useState('');

    const handleRequestLink = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/user/request-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName })
            });
            const data = await response.json();
            setLink(data.link);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h2>Request One-Time Link</h2>
            <input type="text" placeholder="Username" value={userName} onChange={(e) => setUsername(e.target.value)} />
            <button onClick={handleRequestLink}>Request Link</button>
            {link && <p>One-Time Link: <a href={link}>{link}</a></p>}
        </div>
    );
};

const Time = () => {
    const [time, setTime] = useState('');

    const handleGetTime = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/user/time', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setTime(data.time);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h2>Current Server Time</h2>
            <button onClick={handleGetTime}>Get Time</button>
            {time && <p>{time}</p>}
        </div>
    );
};

const App = () => (
    
    <Router>
        <nav>
            <Link to="/login">Login</Link>
            <Link to="/request-link" style={{marginLeft: '15px'}}>Request Link</Link>
        </nav>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/request-link" element={<RequestLink />} />
            <Route path="/time" element={<Time />} />
        </Routes>
    </Router>
);

export default App;
