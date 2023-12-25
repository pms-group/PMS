import { toast } from 'react-toastify'
import { useAuthContext, useDataContext } from "../../hooks/useContexts";

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

export default function RequestDetails({ request }){
    const {dispatch} = useDataContext();
    const {user} = useAuthContext();

    const handleDelete = async () => {
        const response = await fetch(`/api/requests/client_requests/${request._id}`, { 
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${user.token}`}
        });
        const json = await response.json();

        if(!response.ok){
            toast.error(json.error);
        }
        if(response.ok){
            toast.success('Deleted a request successfully');
            dispatch({type: 'DELETE_REQUEST', payload: json})
        }
    }

    return ( 
        <div className="request-details">
            <h3>A Request to: {request.realestate_name}</h3>
            <p>From: {request.client_name}</p>
            <p>Request ID: {request._id}</p>
            <p>Apartment ID: {request.apartment_id}</p>
            <p>Message: {request.message}</p>
            <p className="status">Status: {request.status}</p>
            {request.reply_message && <p className="status">Response: {request.reply_message}</p>}
            {request.updatedAt ? <p>{formatDistanceToNow(new Date(request.updatedAt), {addSuffix: true})}</p> : <p>just now</p>}
            {(user.privilege === 'user' && request.status === 'pending') ? <button onClick={handleDelete}>delete request</button> : null}
        </div>
     );
}