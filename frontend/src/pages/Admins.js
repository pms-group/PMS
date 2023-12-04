import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';


// contexts
import { useAdminContext } from "../hooks/useContexts";

// components
import AdminDetails from '../components/AdminDetails';

const Admins = () => {
    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/admin_details/${id}`);
    };

    const {admins, dispatch} = useAdminContext();
    useEffect(() => {
        const fetchAdmins = async () => {
            const response = await fetch('/api/user/view_admins');
            const json = await response.json();
            if(response.ok){
                dispatch({type: 'SET_ADMINS', payload: json});
            }
        };
        fetchAdmins();
    }, [dispatch]);
    


    return ( 
        <div className="realestates-page">
            <h2>Real Estates</h2>
            {admins && admins.map(admin => (
                <div onClick={() => handleClick(admin._id)} key={admin._id} className="links">
                    <AdminDetails key={admin._id} admin={admin}/>
                </div>
            ))}
        </div>
     );
}
 
export default Admins;