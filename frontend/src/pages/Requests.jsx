import { useAuthContext, useRequestContext } from "../hooks/useContexts";

// components
import RequestInfo from '../components/private/RequestInfo';
import UpdateRequest from '../components/private/client/UpdateRequest';
import RespondRequest from '../components/private/admin/RespondRequest';


export default function Requests(){
    const {requests} = useRequestContext();
    const {user} = useAuthContext();

    return ( 
        <div className={user && ((user.privilege === 'admin' || user.privilege === 'user') ? 'request-page': 'request-page1')}>
            <div className="requests">
                <h2>Requests</h2>
                {!requests &&  <h3>No Requests Available</h3>}    
                {requests &&  requests.map(request => (
                    <RequestInfo key={request._id} request={request} />
                ))}
                
            </div>
            
            {requests && user.privilege === 'admin' ? <RespondRequest /> : null }
            {requests && user.privilege === 'user' ? <UpdateRequest /> : null }                
        </div>
     );
}