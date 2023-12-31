import { useState } from "react";
import { toast } from 'react-toastify'
import { useDataContext, useAuthContext } from "../../../hooks/useContexts";

export default function RespondRequest({request_id}){
    const {dispatch} = useDataContext();
    const {user} = useAuthContext();

    const [formData, setFormData] = useState({
        reply_message: '',
        status: 'accepted',
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (request_id === ''){
            toast.error('Please select one request to update')
            return;
        }

        const data = JSON.stringify({...formData});

        try {
            const response = await fetch(`/api/requests/realestate_requests/${request_id}`, {
                method: 'PATCH',
                body: data,
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            const json = await response.json();
    
            if(!response.ok){
                toast.error(json.error);
            }
            if(response.ok){
                toast.success('Responded a request successfully');
                dispatch({type: 'UPDATE_REQUEST', payload: json})
                setFormData({
                    reply_message: '',
                    status: 'accepted',
                    id: ''
                });
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    const handleReset = (e) => {
        e.preventDefault();
        setFormData({
            reply_message: '',
            status: 'accepted',
            id: ''
        })
    }

    return ( 
        <form className="other-forms" onSubmit={handleSubmit} onReset={handleReset}>
            <h3>Respond Request</h3>

            <label>Request ID(Click the request):</label>
            <input
                type="text"
                name="id"
                disabled
                value={request_id}
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
        </form>
     );
}