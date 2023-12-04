import { useEffect } from "react";

import { useNavigate } from 'react-router-dom';


// contexts
import { useAuthContext, useAptContext } from '../hooks/useContexts';

// components
import AptDetails from '../components/AptDetails'
import AddApt from '../components/admin/AddApt';
import AddRealEstate from '../components/superadmin/AddRealEstate';


const Home = () => {
    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/apartment_details/${id}`);
    };


    const {apts, dispatch} = useAptContext();
    const {user} = useAuthContext();
    useEffect(() => {
        const fetchApartments = async () => {
            const response = await fetch('/api/apartments');
            const json = await response.json();
            if(response.ok){
                dispatch({type: 'SET_APARTMENTS', payload: json});
            }
        };

        fetchApartments();
    }, [dispatch])

    return ( 
        <div className={(user && (user.privilege === 'admin' || user.privilege === 'superadmin')) ? 'home': 'home1'}>

            <div className="apartments">
                <h2>Apartments</h2>
                {apts && apts.map( apt => (
                    <div onClick={() => handleClick(apt._id)} key={apt._id} className="links">
                        <AptDetails key={apt._id} apt={apt}/>
                    </div>
                ))}
            </div>

            {user && user.privilege === 'admin' ? <AddApt /> : null }
            {user && user.privilege === 'superadmin' ? <AddRealEstate /> : null }
        </div>
     );
}
 
export default Home;