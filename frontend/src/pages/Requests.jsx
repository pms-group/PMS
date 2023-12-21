import { useState } from "react";
import { useAuthContext, useRequestContext } from "../hooks/useContexts";

// components
import RequestInfo from '../components/private/RequestInfo';
import UpdateRequest from '../components/private/client/UpdateRequest';
import RespondRequest from '../components/private/admin/RespondRequest';


export default function Requests(){
    const {requests} = useRequestContext();
    const {user} = useAuthContext();
    const [id, setId] = useState('');

    return ( 
        <div className={user && ((user.privilege === 'admin' || user.privilege === 'user') ? 'request-page': 'request-page1')}>
            <div className="requests">
                <h2>Requests</h2>
                {requests?.length === 0 &&  <h3>No Requests Available</h3>}    
                {requests?.map(request => (
                    <div onClick={() => setId(request._id)} key={request._id} className="links">
                        <RequestInfo key={request._id} request={request} />
                    </div>
                ))}
                
            </div>
            
            {requests?.length > 0 && user.privilege === 'admin' && <RespondRequest request_id={id}/>}
            {requests?.length > 0 && user.privilege === 'user' && <UpdateRequest request_id={id}/>}                
        </div>
     );
}