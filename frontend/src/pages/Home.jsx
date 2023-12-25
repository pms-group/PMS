import { useNavigate } from 'react-router-dom';

// contexts
import { useAuthContext, useDataContext } from "../hooks/useContexts";

// components
import RealEstateInfo from '../components/public/RealEstateInfo';
import AddApt from '../components/private/admin/AddApt';
import AddRealEstate from '../components/private/superadmin/AddRealEstate';

export default function Home(){
    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/realestate_details/${id}`);
    };

    const {realestates} = useDataContext();
    const {user} = useAuthContext();
    
    return ( 
        <div className={(user?.privilege === 'admin' || user?.privilege === 'superadmin') ? 'home': 'home1'}>
            <div className="realestates">
                <h2>Real Estates</h2>
                {realestates.map(realestate => (
                    <div onClick={() => handleClick(realestate._id)} key={realestate._id} className="links">
                        <RealEstateInfo key={realestate._id} realestate={realestate}/>
                    </div>
                ))}
            </div>

            {user?.privilege === 'admin' && <AddApt />}
            {user?.privilege === 'superadmin' && <AddRealEstate />}
        </div>

     );
}