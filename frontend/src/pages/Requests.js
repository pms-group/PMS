import { useEffect } from "react";
import { useAuthContext, useRequestContext } from "../hooks/useContexts";

// components
import RequestDetails from '../components/RequestDetails';
import UpdateRequest from '../components/client/UpdateRequest';
import RespondRequest from '../components/admin/RespondRequest';


const Requests = () => {
    const {requests, dispatch} = useRequestContext();
    const {user} = useAuthContext();
    useEffect(() => {
        const fetchRequests = async () => {
            const response = await fetch('/api/requests', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if(response.ok){
                (json.length > 0) ? dispatch({type: 'SET_REQUESTS', payload: json}) : dispatch({type: 'SET_REQUESTS', payload: null});
            }
        };

        const fetchClientRequests = async () => {
            const response = await fetch('/api/requests/client_requests', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if(response.ok){
                (json.length > 0) ? dispatch({type: 'SET_REQUESTS', payload: json}) : dispatch({type: 'SET_REQUESTS', payload: null});
            }
        };

        const fetchAdminRequests = async () => {
            const response = await fetch('/api/requests/realestate_requests', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if(response.ok){
                (json.length > 0) ? dispatch({type: 'SET_REQUESTS', payload: json}) : dispatch({type: 'SET_REQUESTS', payload: null});
            }
        };


        if(user.privilege === 'superadmin'){
            fetchRequests();
        } else if(user.privilege === 'admin'){
            fetchAdminRequests();
        } else if(user.privilege === 'user'){
            fetchClientRequests();
        }

    }, [dispatch, user]);


    return ( 
        <div className={ (user.privilege === 'admin' || user.privilege === 'user') ? 'request-page': 'request-page1'}>
            <div className="requests">
                <h2>Requests</h2>
                {!requests &&  <h3>No Requests Available</h3>}    
                {requests &&  requests.map(request => (
                    <RequestDetails key={request._id} request={request} />
                ))}
                
            </div>
            
            {requests && user.privilege === 'admin' ? <RespondRequest /> : null }
            {requests && user.privilege === 'user' ? <UpdateRequest /> : null }                
        </div>
     );
}
 
export default Requests;