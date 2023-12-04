import { useParams } from 'react-router-dom';
import { useAuthContext, useAptContext } from "../hooks/useContexts";

// components
import AptDetails from "../components/AptDetails";
import AddRequest from '../components/client/AddRequest';
import UpdateApt from "../components/admin/UpdateApt";

const AptDetail = () => {
    const {user} = useAuthContext();
    const {apts} = useAptContext();
    const { id } = useParams();
    const apt = apts.find(apt => {
        return apt._id === id;
    });

    return ( 
        <div className={(user && (user.privilege === 'superadmin')) ? 'aptdetail-page1': 'aptdetail-page'}>
            <div>
                <h2>Apartment Details</h2>
                <AptDetails key={apt._id} apt={apt}/>
            </div>
            
            {(!user || (user && user.privilege === 'user')) ? <AddRequest apt={apt} /> : null }
            {user && user.privilege === 'admin' ? <UpdateApt apt={apt} /> : null }
        </div>
     );
}
 
export default AptDetail;