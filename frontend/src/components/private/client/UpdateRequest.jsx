import { useState } from "react";
import { useRequestContext, useAuthContext } from "../../../hooks/useContexts";

export default function UpdateRequest(){
    const {dispatch} = useRequestContext();
    const {user} = useAuthContext();

    const [formData, setFormData] = useState({
        message: '',
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

        const updatedData = {...formData};
        delete updatedData.id;
        const data = JSON.stringify({...updatedData});

        try {
            const response = await fetch(`/api/requests/client_requests/${formData.id}`, {
                method: 'PATCH',
                body: data,
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
                setFormData({
                    message: '',
                    id: ''
                });
    
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
        } catch (error) {
            setError(error);
        }
    }

    const handleReset = (e) => {
        e.preventDefault();
        setError(null);
        setFormData({
            message: '',
            id: ''
        })
    }

    return ( 
        <form className="other-forms" onSubmit={handleSubmit} onReset={handleReset}>
            <h3>Update Request</h3>

            <label>Request ID:</label>
            <input
                type="text"
                name="id"
                onChange={handleInputChange}
                value={formData.id}
            />

            <label>Message:</label>
            <textarea
                name="message"
                onChange={handleInputChange}
                value={formData.message}
            />

            <input className="submit" type="submit" value="Update"/>
            <input className="cancel" type="reset" value="Cancel"/>
            {error && <div className="error">{error}</div>}
        </form>
     );
}