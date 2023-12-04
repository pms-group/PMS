import { useParams,useNavigate } from 'react-router-dom';
import { useAuthContext, useAptContext, useAdminContext } from "../hooks/useContexts";

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

// components
import AptDetails from "../components/AptDetails";

const AdminDetail = () => {
    const {user} = useAuthContext();
    const {apts} = useAptContext();
    const {admins} = useAdminContext();
    const { id } = useParams();
    let aptsCount = 0;
    const navigate = useNavigate();

    const admin = admins.find(admin => {
        return admin._id === id;
    });

    const adminApts = apts.filter(apt => {
        if(apt.realestate_id === id){
            aptsCount += apt.available;
        }
        return apt.realestate_id === id;
    });

    const handleDelete = async () => {
        const response1 = await fetch(`/api/requests/remove_admin/${admin._id}`, {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${user.token}`}
        });
        const json = await response1.json();

        if(!response1.ok){
            console.log(json.error);
        }
        if(response1.ok){
            navigate('/real_estates');
        }
    }

    const handleClick = (id) => {
        navigate(`/apartment_details/${id}`);
    };

    return ( 
        <div className="admindetail-page">
            <h2>RealEstate Info</h2>
            <div className="admin-details">
                <h4>{admin.fullname}</h4>
                <p>Email: <strong>{admin.email}</strong></p>
                <p>Contact: <strong>{admin.contact}</strong></p>
                <p>Total Apartments Posted: <strong>{aptsCount}</strong></p>

                {(user && user.privilege === 'superadmin') ? 
                    <div>
                        <p>Created At: <strong>{formatDistanceToNow(new Date(admin.createdAt), {addSuffix: true})}</strong></p><br />
                        <button onClick={handleDelete}>Remove RealEstate</button>
                    </div> 
                : null}
            </div>

            <h2>Apartments Within this RealEstate</h2>
            <div className="admin-apts">
                {adminApts && adminApts.map( apt => (
                    <div onClick={() => handleClick(apt._id)} key={apt._id} className='links'>
                        <AptDetails key={apt._id} apt={apt}/>
                    </div>
                ))}

            </div>
        </div>
     );
}
 
export default AdminDetail;