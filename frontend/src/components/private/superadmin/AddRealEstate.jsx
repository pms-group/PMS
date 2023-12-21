import { useState } from "react";
import {  useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthContext, useRealEstateContext } from "../../../hooks/useContexts";

export default function AddRealEstate(){
    const {dispatch} = useRealEstateContext();
    const {user} = useAuthContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        contact: '',
        username: '',
        password: '',
        confirmPWD: ''
    });

    const [isLoading, setIsLoading] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setIsLoading(true);
        setEmptyFields([]);

        if(formData.password !== formData.confirmPWD){
            toast.error('Passwords did not match. Please insert correctly')
            setIsLoading(false);
            setEmptyFields(['password']);
            return;
        }

        const updatedData = {...formData};
        delete updatedData.confirmPWD;
        const data = JSON.stringify({...updatedData});

        try {
            const response = await fetch('/api/user/admin_signup', {
                method: 'POST',
                body: data,
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json();
    
            if(!response.ok){
                toast.error(json.error);
                setIsLoading(false);
                setEmptyFields(json.emptyFields)
            }
            if(response.ok){
                toast.success('Added a realestate successfully')
                setIsLoading(false);
                setEmptyFields([]);
                setFormData({
                    fullname: '',
                    email: '',
                    contact: '',
                    username: '',
                    password: '',
                    confirmPWD: ''
                });
                dispatch({type: 'CREATE_REALESTATE', payload: json});
                navigate('/');
            }
        } catch (err) {
            setIsLoading(false);
            toast.error(err.message);
            setEmptyFields([]);
        }
    }

    const handleReset = () => {
        setEmptyFields([]);
        setFormData({
            fullname: '',
            email: '',
            contact: '',
            username: '',
            password: '',
            confirmPWD: ''
        });
    }

    return ( 
        <form className="other-forms" onSubmit={handleSubmit} onReset={handleReset}>
            <h3>Register RealEstate</h3>

            <label>RealEstate Name: </label>
            <input
                type="text"
                name="fullname"
                onChange={handleInputChange}
                value={formData.fullname}
                className={emptyFields.includes('fullname') ? 'error' : ''}
            />

            <label>RealEstate Email: </label>
            <input
                type="email"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
                className={emptyFields.includes('email') ? 'error' : ''}
            />

            <label>RealEstate Phone Number: </label>
            <input
                type="tel"
                name="contact"
                onChange={handleInputChange}
                value={formData.contact}
                className={emptyFields.includes('contact') ? 'error' : ''}
            />

            <label>Admin Username: </label>
            <input
                type="text"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
                className={emptyFields.includes('username') ? 'error' : ''}
            />

            <label>Admin Password: </label>
            <input
                type="password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
                className={emptyFields.includes('password') ? 'error' : ''}
            />

            <label>Confirm Password: </label>
            <input
                type="password"
                name="confirmPWD"
                onChange={handleInputChange}
                value={formData.confirmPWD}
                className={emptyFields.includes('password') ? 'error' : ''}
            />

            <input className="submit" type="submit" value="Register" disabled={isLoading} />
            <input className="cancel" type="reset" value="Cancel" disabled={isLoading}/>
        </form>        
     );
}