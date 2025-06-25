import React, { useState } from 'react'
import { LoginForm } from './loginForm';
import { UserDashboard } from './UserDashboard';

export const UserAccessControl = () => {

const [user, setUser] = useState(null);

  return (
    <div>
        {!user ?(<LoginForm onLogin={setUser}/>) : (<UserDashboard user ={user}/>)}
    </div>
  );
}

