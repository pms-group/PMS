import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify'
import { useAuthContext, useDataContext } from "../hooks/useContexts";

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

// components
import AddRequest from '../components/private/client/AddRequest';
import UpdateApt from "../components/private/admin/UpdateApt";

export default function AptDetail(){
    const {user} = useAuthContext();
    const {dispatch} = useDataContext();
    const { id } = useParams();
    const navigate = useNavigate();

    const [apt, setApt] = useState(null);
    const [owner, setOwner] = useState(false);

    useEffect(() => {
        const fetchApt = async () => {
            const response = await fetch(`/api/apartments?id=${id}`);
            const json = await response.json();
            if(response.ok){
                setApt(json);
            }
        };

        fetchApt();
        setOwner(user?._id === apt?.realestate_id ? true : false)
    }, [id, apt?.realestate_id, user?._id]);

    const handleDelete = async () => {
        const response = await fetch(`/api/apartments/${id}`, {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${user.token}`}
        });
        const json = await response.json();

        if(!response.ok){
            toast.error(json.error);
        }
        if(response.ok){
            toast.success('Deleted an apartment successfully');
            dispatch({type: 'DELETE_APARTMENT', payload: json})
            navigate('/apartments');
        }
    }

    const handleAptChange = (updatedApt) => {
        setApt(updatedApt);
    }

    return ( 
        <div className={(!owner && (user && (user?.privilege !== 'client'))) ? 'aptdetail-page1': 'aptdetail-page'}>
            <div>
                <h2>Apartment Details</h2>
                {apt && <div className="apt-details">
                    <h4>{apt.realestate_name}'s Apartment</h4>
                    <p><strong>{apt.bedrooms}</strong> bedrooms</p>
                    <p><strong>{apt.bathrooms}</strong> bathrooms</p>
                    <p>For <strong>{apt.type}</strong>{apt.type === 'both' && <strong> Sale and Rent</strong>}</p>
                    <p><strong>{apt.available}</strong> apartment/s available</p>
                    <p>Price: <strong>{apt.price}</strong></p>
                    <p>Description: <strong>{apt.description}</strong></p>
                    <p>Created At: <strong>{formatDistanceToNow(new Date(apt.createdAt), {addSuffix: true})}</strong></p>
                    {owner &&
                        <button onClick={handleDelete}>Remove Apartment</button>
                    }<br />
                    {apt.imageUrls.length > 0 && apt.imageUrls.map(image => (
                        <img className="detail" src={`http://localhost:5000/${image}`} alt="" key={image}/>
                    ))}
                </div>}
            </div>
            
            {apt && (!user || (user?.privilege === 'client')) && <AddRequest apt={apt} />}
            {apt && owner && <UpdateApt apt={apt} onAptChange={handleAptChange}/>}
        </div>
     );
}