import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export default function Signup(){
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

    const navigate = useNavigate();

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setIsLoading(true);

        if(formData.password !== formData.confirmPWD){
            toast.error('Passwords did not match. Please insert correctly');
            setIsLoading(false);
            setEmptyFields(['password']);
            return;
        }

        const updatedData = {...formData};
        delete updatedData.confirmPWD;
        const data = JSON.stringify({...updatedData});

        try {
            const response = await fetch('/api/user/client_signup', {
                method: 'POST',
                body: data,
                headers: {'Content-Type': 'application/json'}
            })
            const json = await response.json();
    
            if(!response.ok){
                setIsLoading(false);
                toast.error(json.error);
                setEmptyFields(json.emptyFields)
            }
            if(response.ok){
                toast.success('Signed up successfully. Now Log in');
                setIsLoading(false);
                setEmptyFields([])
                navigate('/login');
            }
        } catch (err) {
            setIsLoading(false);
            toast.error(err.message);
            setEmptyFields([]);
        }
    }

    const handleReset = () => {
        navigate(-1);
    }

    return ( 
        <form className="signup" onSubmit={handleSubmit} onReset={handleReset}>
            <h3>Sign up</h3>

            <label>Full Name: </label>
            <input
                type="text"
                name="fullname"
                onChange={handleInputChange}
                value={formData.fullname}
                className={emptyFields.includes('fullname') ? 'error' : ''}
            />

            <label>Email: </label>
            <input
                type="email"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
                className={emptyFields.includes('email') ? 'error' : ''}
            />

            <label>Username: </label>
            <input
                type="text"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
                className={emptyFields.includes('username') ? 'error' : ''}
            />

            <label>Password: </label>
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

            <input className="submit" type="submit" value="Sign Up" disabled={isLoading} />
            <input className="cancel" type="reset" value="Cancel" disabled={isLoading}/>
        </form>
     );
}