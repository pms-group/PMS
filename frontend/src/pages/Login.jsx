import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useContexts";

export default function Login(){
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setIsLoading(true);
        setError(null);

        const updatedData = {...formData};
        const data = JSON.stringify({...updatedData});

        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                body: data,
                headers: {'Content-Type': 'application/json'}
            });
            
            const json = await response.json();
            if(!response.ok){
                setIsLoading(false);
                setError(json.error);
                setEmptyFields(json.emptyFields);
            }
            if(response.ok){
                setEmptyFields([]);
    
                // save the user to local storage
                localStorage.setItem('user', JSON.stringify(json));
    
                // update the auth context
                dispatch({type: 'LOGIN', payload: json});
    
                // update loading state
                setIsLoading(false);

                navigate(-1);

            }
        } catch (error) {
            setIsLoading(false);
            setError(error);
            setEmptyFields([]);
        }
    }

    const handleReset = () => {
        navigate(-1);
    }

    return ( 
        <form className="login" onSubmit={handleSubmit} onReset={handleReset}>
            <h3>Log in</h3>

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

            <input className="submit" type="submit" value="Log in" disabled={isLoading} />
            <input className="cancel" type="reset" value="Cancel" disabled={isLoading}/>
            {error && <div className="error">{error}</div>}
        </form>
     );
}