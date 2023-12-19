import { useNavigate } from 'react-router-dom';

// contexts
import { useAuthContext, useAptContext } from '../hooks/useContexts';

// components
import AptInfo from '../components/public/AptInfo'
import AddApt from '../components/private/admin/AddApt';
import AddRealEstate from '../components/private/superadmin/AddRealEstate';


export default function Apts(){
    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/apartment_details/${id}`);
    };


    const {apts} = useAptContext();
    const {user} = useAuthContext();

    return ( 
        <div className={(user && (user.privilege === 'admin' || user.privilege === 'superadmin')) ? 'home': 'home1'}>

            <div className="apartments">
                <h2>Apartments</h2>
                {apts && apts.map( apt => (
                    <div onClick={() => handleClick(apt._id)} key={apt._id} className="links">
                        <AptInfo key={apt._id} apt={apt}/>
                    </div>
                ))}
            </div>

            {user && user.privilege === 'admin' ? <AddApt /> : null }
            {user && user.privilege === 'superadmin' ? <AddRealEstate /> : null }
        </div>
     );
}