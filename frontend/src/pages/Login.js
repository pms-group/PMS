import { useState } from "react";
import { useAuthContext } from "../hooks/useContexts";
import { Link } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();
    const [emptyFields, setEmptyFields] = useState([]);

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/user/login', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type' : 'application/json'}
        });
        
        const json = await response.json();
        if(!response.ok){
            setIsLoading(false);
            setError(json.error);
            setEmptyFields(json.emptyFields);
        }
        if(response.ok){
            // save the user to local storage
            localStorage.setItem('user', JSON.stringify(json));

            setEmptyFields([]);

            // update the auth context
            dispatch({type: 'LOGIN', payload: json});

            // update loading state
            setIsLoading(false);


        }
        
    }


    return ( 
        <form className="login" onSubmit={handleSubmit}>
            <h3>Log in</h3>

            <label>Username: </label>
            <input
                type="text"
                onChange={evt => setUsername(evt.target.value)}
                value={username}
                className={emptyFields.includes('username') ? 'error' : ''}
            />

            <label>Password: </label>
            <input
                type="password"
                onChange={evt => setPassword(evt.target.value)}
                value={password}
                className={emptyFields.includes('password') ? 'error' : ''}
            />

            <input className="submit" type="submit" value="Log in" disabled={isLoading} />
            <Link to="/" disabled={isLoading}><input className="cancel" type="reset" value="Cancel"/></Link>
            {error && <div className="error">{error}</div>}
        </form>
     );
}
 
export default Login;