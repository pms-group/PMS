import { useState } from "react";
import { useAuthContext } from "../../hooks/useContexts";

const AddRealEstate = () => {

    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [contact , setContact] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const {user} = useAuthContext();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);


    const handleSubmit = async (evt) => {
        evt.preventDefault();

        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/user/admin_signup', {
            method: 'POST',
            body: JSON.stringify({fullname, email, contact, username, password}),
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json();

        if(!response.ok){
            setIsLoading(false);
            setError(json.error);
            setEmptyFields(json.emptyFields)
        }
        if(response.ok){
            // update loading state
            setError(null);
            setIsLoading(false);
            setEmptyFields([]);
            setFullname('');
            setEmail('');
            setContact('');
            setUsername('');
            setPassword('');
        }
    }

    const handleReset = () => {
        setError(null);
        setEmptyFields([]);
        setFullname('');
        setEmail('');
        setContact('');
        setUsername('');
        setPassword('');
    }

    return ( 
        <form className="other-forms" onSubmit={handleSubmit} onReset={handleReset}>
            <h3>Register RealEstate</h3>

            <label>RealEstate Name: </label>
            <input
                type="text"
                onChange={evt => setFullname(evt.target.value)}
                value={fullname}
                className={emptyFields.includes('fullname') ? 'error' : ''}
            />

            <label>RealEstate Email: </label>
            <input
                type="text"
                onChange={evt => setEmail(evt.target.value)}
                value={email}
                className={emptyFields.includes('email') ? 'error' : ''}
            />

            <label>RealEstate Phone Number: </label>
            <input
                type="tel"
                onChange={evt => setContact(evt.target.value)}
                value={contact}
                className={emptyFields.includes('contact') ? 'error' : ''}
            />

            <label>Admin Username: </label>
            <input
                type="text"
                onChange={evt => setUsername(evt.target.value)}
                value={username}
                className={emptyFields.includes('username') ? 'error' : ''}
            />

            <label>Admin Password: </label>
            <input
                type="password"
                onChange={evt => setPassword(evt.target.value)}
                value={password}
                className={emptyFields.includes('password') ? 'error' : ''}
            />

            <input className="submit" type="submit" value="Register" disabled={isLoading} />
            <input className="cancel" type="reset" value="Cancel" disabled={isLoading}/>
            {error && <div className="error">{error}</div>}
        </form>



        
     );
}
 
export default AddRealEstate;