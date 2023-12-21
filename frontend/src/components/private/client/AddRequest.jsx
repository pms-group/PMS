import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import { useRequestContext, useAuthContext } from "../../../hooks/useContexts";

export default function AddRequest({apt}){
    const {dispatch} = useRequestContext();
    const {user} = useAuthContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        message: '',
        id: apt._id
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!user){
            toast.info('Login to add a request');
            navigate('/login');
            return;
        }

        const data = JSON.stringify({...formData});

        try {
            const response = await fetch(`/api/requests/client_requests/${formData.id}`, {
                method: 'POST',
                body: data,
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            const res = await response.json();
    
            if(!response.ok){
                toast.error(res.error);
            }
            if(response.ok){
                toast.success('Added a request successfully')
                setFormData({ ...formData, message: ''});
                dispatch({type: 'CREATE_REQUEST', payload: res});
                navigate('/requests');
            }
        } catch (err) {
            toast.error(err.message);
        }

    }

    const handleReset = (e) => {
        e.preventDefault();
        setFormData({ ...formData, message: ''})
    }


    return ( 
        <form className="other-forms" onSubmit={handleSubmit} onReset={handleReset}>
            <h3>Add Request</h3>

            <label>Apartment ID:</label>
            <input
                type="text"
                name="id"
                value={formData.id}
                disabled
            />

            <label>Message:</label>
            <textarea
                name="message"
                onChange={handleInputChange}
                value={formData.message}
            />

            <input className="submit" type="submit" value="Add"/>
            <input className="cancel" type="reset" value="Cancel"/>
        </form>
     );
}