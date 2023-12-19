import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {  useAuthContext } from "../../hooks/useContexts";

export default function UpdateProfile(){
    const {user, dispatch} = useAuthContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullname: user.fullname,
        email: user.email,
        username: user.username,
        contact: user.contact,
        address: user.address,
        description: user.description,
        gender: user.gender,
        removePic: false,
        changePWD: false,
        oldPWD: '',
        newPWD: '',
        confirmPWD: '',
        image: null
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const inputValue = type === 'file' ? e.target.files[0] : value;    
        setFormData({ ...formData, [name]: inputValue });
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setIsLoading(true);
        setError(null);
        setEmptyFields([]);
        
        if(formData.changePWD.toString('true') && (formData.newPWD !== formData.confirmPWD)){
            setError('Passwords did not match. Please insert correctly');
            setIsLoading(false);
            setEmptyFields(emptyFields.push('password'));
            return;
        }

        const data = new FormData();
        for(let key in formData){
            if((key === 'image' && formData.removePic.toString() === 'true') || key === 'confirmPWD'){
                continue
            }
            data.append(key, formData[key]);
        }

        try {
            const response = await fetch('/api/user/update_profile', {
                method: 'PATCH',
                body: data,
                headers: {
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
                setIsLoading(false);
                setEmptyFields([]);
                dispatch({type: 'LOGOUT'});
                navigate('/login');
            }
        } catch (error) {
            setIsLoading(false);
            setError(error);
            setEmptyFields([]);
        }
    }

    const handleReset = (e) => {
        e.preventDefault();
        setFormData({
            fullname: user.fullname,
            email: user.email,
            username: user.username,
            contact: user.contact,
            address: user.address,
            description: user.description,
            gender: user.gender,
            removePic: false,
            changePWD: false,
            oldPWD: '',
            newPWD: '',
            confirmPWD: '',
            image: null
        })
        setError(null);
        setEmptyFields([]);
    }

    return ( 
        <form className="other-forms" onSubmit={handleSubmit} onReset={handleReset}>
            <h3>Update Profile</h3>

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

            <label>Contact: </label>
            <input
                type="tel"
                name="contact"
                onChange={handleInputChange}
                value={formData.contact}
                className={emptyFields.includes('contact') ? 'error' : ''}
            />

            <label>Gender: </label>
            <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
            >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Not Sure">Not Sure</option>
            </select>

            <label>Address(Oprtonal): </label>
            <input
                type="text"
                name="address"
                onChange={handleInputChange}
                value={formData.address}
                className={emptyFields.includes('address') ? 'error' : ''}
            />

            <label>Bio(Oprtonal): </label>
            <textarea
                name="description"
                onChange={handleInputChange}
                value={formData.description}
            />

            <label>Remove Profile picture? </label>
            <select
                name="removePic"
                onChange={handleInputChange}
                value={formData.removePic}
            >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
            </select>

            <label>Change Profile Picture():</label>
            <input
                type="file"
                accept=".png, .jpg, .jpeg"
                name="image"
                disabled={formData.removePic.toString() === 'true'}
                onChange={handleInputChange}
            />

            <label>Change Password? </label>
            <select
                name="changePWD"
                onChange={handleInputChange}
                value={formData.changePWD}
            >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
            </select>

            {formData.changePWD.toString() === 'true' && <div>
                <label>Old Password: </label>
                <input
                    type="password"
                    name="oldPWD"
                    onChange={handleInputChange}
                    value={formData.oldPWD}
                    className={emptyFields.includes('oldPWD') ? 'error' : ''}
                />

                <label>New Password: </label>
                <input
                    type="password"
                    name="newPWD"
                    onChange={handleInputChange}
                    value={formData.newPWD}
                    className={emptyFields.includes('newPWD') ? 'error' : ''}
                />

                <label>Confirm Password: </label>
                <input
                    type="password"
                    name="confirmPWD"
                    onChange={handleInputChange}
                    value={formData.confirmPWD}
                    className={emptyFields.includes('newPWD') ? 'error' : ''}
                />
            </div>}

            <input className="submit" type="submit" value="Update" disabled={isLoading} />
            <input className="cancel" type="reset" value="Cancel" disabled={isLoading}/>
            {error && <div className="error">{error}</div>}
        </form>
     );
}