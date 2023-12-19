import { useState } from "react";
import { useRequestContext, useAuthContext } from "../../../hooks/useContexts";

export default function RespondRequest(){
    const {dispatch} = useRequestContext();
    const {user} = useAuthContext();

    const [formData, setFormData] = useState({
        reply_message: '',
        status: 'accepted',
        id: ''
    });

    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.id === ''){
            setError('Please enter the Request ID');
            return;
        }

        const data = JSON.stringify({...formData});

        try {
            const response = await fetch(`/api/requests/realestate_requests/${formData.id}`, {
                method: 'PATCH',
                body: data,
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            const res = await response.json();
    
            if(!response.ok){
                setError(res.error);
            }
            if(response.ok){
                setError(null);
                setFormData({
                    reply_message: '',
                    status: 'accepted',
                    id: ''
                });
    
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
        } catch (error) {
            setError(error);
        }
    }

    const handleReset = (e) => {
        e.preventDefault();
        setError(null);
        setFormData({
            reply_message: '',
            status: 'accepted',
            id: ''
        })
    }

    return ( 
        <form className="other-forms" onSubmit={handleSubmit} onReset={handleReset}>
            <h3>Respond Request</h3>

            <label>Request ID:</label>
            <input
                type="text"
                name="id"
                onChange={handleInputChange}
                value={formData.id}
            />

            <label>Reply Message:</label>
            <textarea
                name="reply_message"
                onChange={handleInputChange}
                value={formData.reply_message}
            />

            <label>Status: </label>
            <select
                name="status"
                onChange={handleInputChange}
                value={formData.status}
            >
                <option value="accepted">accepted</option>
                <option value="rejected">rejected</option>
            </select><br /><br />

            <input className="submit" type="submit" value="Submit"/>
            <input className="cancel" type="reset" value="Cancel"/>
            {error && <div className="error">{error}</div>}
        </form>
     );
}