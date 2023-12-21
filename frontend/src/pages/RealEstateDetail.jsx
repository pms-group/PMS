import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify'
import { useAuthContext, useAptContext, useRealEstateContext } from "../hooks/useContexts";

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

// components
import AptDetails from "../components/public/AptInfo";

export default function RealEstateDetail(){

    const {user} = useAuthContext();
    const {apts} = useAptContext();
    const {realestates, dispatch} = useRealEstateContext();
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [realestate, setRealestate] = useState(null);
    const [realestateApts, setRealestateApts] = useState([]);


    useEffect(() => {
        setRealestate(realestates?.find(realestate => {
            return realestate._id === id;
        }));

        setRealestateApts(apts?.filter(apt => {
            if(apt.realestate_id === id){
            }
            return apt.realestate_id === id;
        }))
    }, [id, realestates, apts])

    const handleDelete = async () => {
        const response = await fetch(`/api/user/remove_realEstate/${realestate._id}`, {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${user.token}`}
        });
        const json = await response.json();

        if(!response.ok){
            toast.error(json.error);
        }
        if(response.ok){
            toast.success('Removed a realestate successfully');
            dispatch({type: 'DELETE_REALESTATE', payload: json})
            navigate('/');
        }
    }

    const handleClick = (id) => {
        navigate(`/apartment_details/${id}`);
    };

    return ( 
        <div className="realestatedetail-page">
            <h2>RealEstate Info</h2>
            {realestate && <div className="realestate-details">
                <h4>{realestate.fullname}</h4>
                <p>Email: <strong>{realestate.email}</strong></p>
                <p>Contact: <strong>{realestate.contact}</strong></p>

                {(user?.privilege === 'superadmin') ? 
                    <div>
                        <p>Created At: <strong>{formatDistanceToNow(new Date(realestate.createdAt), {addSuffix: true})}</strong></p><br />
                        <button onClick={handleDelete}>Remove RealEstate</button>
                    </div> 
                : null}
            </div>}

            <h2>Apartments Within this RealEstate</h2>
            <div className="realestate-apts">
                {(realestateApts?.length > 0) ? realestateApts.map( apt => (
                    <div onClick={() => handleClick(apt._id)} key={apt._id} className='links'>
                        <AptDetails key={apt._id} apt={apt}/>
                    </div>
                )) : <h3>No apartment listed by this realestate</h3> }

            </div>
        </div>
     );
}