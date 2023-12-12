import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";


const Signup = () => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmassword] = useState('');

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    const navigate = useNavigate();

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        setIsLoading(true);
        setError(null);

        if(password !== confirmpassword){
            setError('Passwords did not match. Please insert correctly');
            setIsLoading(false);
            setEmptyFields([]);
            return;
        }

        const response = await fetch('/api/user/client_signup', {
            method: 'POST',
            body: JSON.stringify({fullname, email, username, password}),
            headers: {'Content-Type' : 'application/json'}
        })
        const json = await response.json();

        if(!response.ok){
            setIsLoading(false);
            setError(json.error);
            setEmptyFields(json.emptyFields)
        }
        if(response.ok){
            setIsLoading(false);
            setEmptyFields([])
            navigate('/login');
        }
    }

    return ( 
        <form className="signup" onSubmit={handleSubmit}>
            <h3>Sign up</h3>

            <label>Full Name: </label>
            <input
                type="text"
                onChange={evt => setFullname(evt.target.value)}
                value={fullname}
                className={emptyFields.includes('fullname') ? 'error' : ''}
            />

            <label>Email: </label>
            <input
                type="text"
                onChange={evt => setEmail(evt.target.value)}
                value={email}
                className={emptyFields.includes('email') ? 'error' : ''}
            />

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

            <label>Confirm Password: </label>
            <input
                type="password"
                onChange={evt => setConfirmassword(evt.target.value)}
                value={confirmpassword}
                className={emptyFields.includes('confirm_password') ? 'error' : ''}
            />

            <input className="submit" type="submit" value="Sign Up" disabled={isLoading} />
            <Link to="/" disabled={isLoading}><input className="cancel" type="reset" value="Cancel"/></Link>
            {error && <div className="error">{error}</div>}
        </form>
     );
}
 
export default Signup;