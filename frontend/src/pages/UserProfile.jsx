// contexts
import { useAuthContext } from '../hooks/useContexts';

// components
import UpdateProfile from '../components/private/UpdateProfile';

export default function UserProfile(){
    const {user} = useAuthContext();

    return ( 
        <div className="profile-page">
            {user && <div className="profile">
                <h2>My Profile</h2>
                <p>Full Name: <strong>{user.fullname}</strong></p>
                <p>Email: <strong>{user.email}</strong></p>
                <p>Username: <strong>{user.username}</strong></p>
                <p>Contact: <strong>{user.contact}</strong></p>
                <p>Privilege: <strong>{user.privilege}</strong></p>
                <p>Address: <strong>{user.address}</strong></p>
                <p>Gender: <strong>{user.gender}</strong></p>
                <p>Bio: <strong>{user.description}</strong></p>
            </div>}

            {user && <UpdateProfile />}


        </div>
     );
}