import { useState } from "react";
import { useAptContext, useAuthContext } from "../../hooks/useContexts";

const AddApt = () => {
    const {dispatch} = useAptContext();
    const {user} = useAuthContext();

    const [bedrooms, setBedrooms] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [type, setType] = useState('Sell');
    const [price, setPrice] = useState('');
    const [available, setAvailable] = useState('');
    const [discription, setDiscription] = useState('');

    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const apartment = { bedrooms, bathrooms, type, price, available, discription};

        const response = await fetch('/api/apartments', {
            method: 'POST',
            body: JSON.stringify(apartment),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();

        if(!response.ok){
            setError(json.error);
            setEmptyFields(json.emptyFields);
        }
        if(response.ok){
            setError(null);
            setBathrooms('');
            setBedrooms('');
            setType('Sell');
            setPrice('');
            setAvailable('');
            setDiscription('');
            setEmptyFields([]);
            dispatch({type: 'CREATE_APARTMENT', payload: json})
        }
    }

    const handleReset = () => {
        setError(null);
        setBathrooms('');
        setBedrooms('');
        setType('Sell');
        setPrice('');
        setAvailable('');
        setDiscription('');
        setEmptyFields([]);
    }

    return ( 
        <form className="other-forms" onSubmit={handleSubmit} onReset={handleReset}>
            <h3>Add a new Apartment</h3>

            <label>Bed rooms:</label>
            <input
                type="number"
                onChange={e => setBedrooms(e.target.value)}
                value={bedrooms}
                className={emptyFields.includes('bedrooms') ? 'error' : ''}
                min={0}
            />

            <label>Bath rooms:</label>
            <input
                type="number"
                onChange={e => setBathrooms(e.target.value)}
                value={bathrooms}
                className={emptyFields.includes('bathrooms') ? 'error' : ''}
                min={1}
            />

            <label>Type: </label>
            <select
                value={type}
                onChange={e => setType(e.target.value)}
            >
                <option value="Sell">Sell</option>
                <option value="Rent">Rent</option>
            </select>

            <label>Price:</label>
            <input
                type="number"
                onChange={e => setPrice(e.target.value)}
                value={price}
                className={emptyFields.includes('price') ? 'error' : ''}
                min={1}
            />

            <label>Available:</label>
            <input
                type="number"
                onChange={e => setAvailable(e.target.value)}
                value={available}
                className={emptyFields.includes('available') ? 'error' : ''}
                min={1}
            />

            <label>Discription(optional):</label>
            <textarea
                value={discription}
                onChange={e => setDiscription(e.target.value)}
            />

            <input className="submit" type="submit" value="Add Apartment"/>
            <input className="cancel" type="reset" value="Cancel"/>
            {error && <div className="error">{error}</div>}
        </form>
     );
}
 
export default AddApt;