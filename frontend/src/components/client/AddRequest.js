import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRequestContext, useAuthContext } from "../../hooks/useContexts";

const AddRequest = ({apt}) => {
    const {dispatch} = useRequestContext();
    const {user} = useAuthContext();
    const navigate = useNavigate();

    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!user){
            navigate('/login');
            return;
        }

        const request = { message };
        const response = await fetch(`/api/requests/client_requests/${apt._id}`, {
            method: 'POST',
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
            dispatch({type: 'CREATE_REQUEST', payload: res});
            navigate('/requests');
        }
    }

    const handleReset = () => {
        setError(null);
        setMessage('');
    }


    return ( 
        <form className="other-forms" onSubmit={handleSubmit} onReset={handleReset}>
            <h3>Add Request</h3>

            <label>Apartment ID:</label>
            <input
                type="text"
                value={apt._id}
                disabled
            />

            <label>Message:</label>
            <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
            />

            <input className="submit" type="submit" value="Add"/>
            <input className="cancel" type="reset" value="Cancel"/>
            {error && <div className="error">{error}</div>}
        </form>
     );
}
 
export default AddRequest;