import { useState } from "react";
import { useRequestContext, useAuthContext } from "../../hooks/useContexts";

const RespondRequest = () => {
    const {dispatch} = useRequestContext();
    const {user} = useAuthContext();

    const [reply_message, setReply_message] = useState('');
    const [status, setStatus] = useState('accepted');
    const [id, setId] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const request = { reply_message, status };
        if (id === ''){
            setError('Please enter the Request ID');
        } else{
            const response = await fetch(`/api/requests/realestate_requests/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(request),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const res = await response.json();
    
            if(!response.ok){
                setError(res.error);
            }
            if(response.ok){
                setError(null);
                setReply_message('');
                setStatus('accepted');
                setId('');
    
                const update = await fetch('/api/requests/realestate_requests', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const json = await update.json();
    
                if(update.ok){
                    dispatch({type: 'SET_REQUESTS', payload: json})
                }
            }
        }
    }

    const handleReset = () => {
        setError(null);
        setReply_message('');
        setStatus('accepted');
        setId('');
    }


    return ( 
        <form className="other-forms" onSubmit={handleSubmit} onReset={handleReset}>
            <h3>Respond Request</h3>

            <label>Request ID:</label>
            <input
                type="text"
                onChange={e => setId(e.target.value)}
                value={id}
            />

            <label>Reply Message:</label>
            <textarea
                value={reply_message}
                onChange={e => setReply_message(e.target.value)}
            />

            <label>Status: </label>
            <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="accepted">accepted</option>
                <option value="rejected">rejected</option>
            </select><br /><br />

            <input className="submit" type="submit" value="Submit"/>
            <input className="cancel" type="reset" value="Cancel"/>
            {error && <div className="error">{error}</div>}
        </form>
     );
}
 
export default RespondRequest;