import { useState } from "react";
import { useRequestContext, useAuthContext } from "../../hooks/useContexts";

const UpdateRequest = () => {
    const {dispatch} = useRequestContext();
    const {user} = useAuthContext();

    const [message, setMessage] = useState('');
    const [id, setId] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const request = { message };
        if (id === ''){
            setError('Please enter the Request ID');
        } else{
            const response = await fetch(`/api/requests/client_requests/${id}`, {
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
                setMessage('');
                setId('');
    
                const update = await fetch('/api/requests/client_requests', {
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
        setMessage('');
        setId('');
    }

    return ( 
        <form className="other-forms" onSubmit={handleSubmit} onReset={handleReset}>
            <h3>Update Request</h3>

            <label>Request ID:</label>
            <input
                type="text"
                onChange={e => setId(e.target.value)}
                value={id}
            />

            <label>Message:</label>
            <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
            />

            <input className="submit" type="submit" value="Update"/>
            <input className="cancel" type="reset" value="Cancel"/>
            {error && <div className="error">{error}</div>}
        </form>
     );
}
 
export default UpdateRequest;