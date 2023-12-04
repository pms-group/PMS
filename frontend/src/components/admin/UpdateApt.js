import { useState } from "react";
import { useAptContext, useAuthContext } from "../../hooks/useContexts";

const UpdateApt = ({apt}) => {
    const {dispatch} = useAptContext();
    const {user} = useAuthContext();

    const [bedrooms, setBedrooms] = useState(apt.bedrooms);
    const [bathrooms, setBathrooms] = useState(apt.bathrooms);
    const [type, setType] = useState(apt.type);
    const [price, setPrice] = useState(apt.price);
    const [available, setAvailable] = useState(apt.available);
    const [discription, setDiscription] = useState(apt.discription);

    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apartment = { bedrooms, bathrooms, type, price, available, discription};

        const response = await fetch(`/api/apartments/${apt._id}`, {
            method: 'PATCH',
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
            
            const update = await fetch('/api/apartments');
            const json = await update.json();

            if(update.ok){
                dispatch({type: 'SET_APARTMENTS', payload: json})
            }

            setError(null);
            setBathrooms(bathrooms);
            setBedrooms(bedrooms);
            setType(type);
            setPrice(price);
            setAvailable(available);
            setDiscription(discription);
            setEmptyFields([]);
        }
    }

    const handleReset = () => {
        setError(null);
        setBathrooms(apt.bathrooms);
        setBedrooms(apt.bedrooms);
        setType(apt.type);
        setPrice(apt.price);
        setAvailable(apt.available);
        setDiscription(apt.discription);
        setEmptyFields([]);
    }


    return ( 
        <form className="other-forms" onSubmit={handleSubmit} onReset={handleReset}>
            <h3>Update Apartment</h3>

            <label>Apartment ID:</label>
            <input
                type="text"
                value={apt._id}
                disabled
            />

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

            <input className="submit" type="submit" value="Update Apartment"/>
            <input className="cancel" type="reset" value="Cancel"/>
            {error && <div className="error">{error}</div>}
        </form>
     );
}
 
export default UpdateApt;