import { useState } from "react";
import { useAptContext, useAuthContext } from "../../hooks/useContexts";

const UpdateApt = ({apt}) => {
    const {dispatch} = useAptContext();
    const {user} = useAuthContext();

    const [formData, setFormData] = useState({
        bedrooms: '',
        bathrooms: '',
        type: 'Sell',
        price: '',
        available: '',
        description: '',
        images: []
    });

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
    
        setFormData((prevData) => ({
          ...prevData,
          [name]: files || value,
        }));
      };

    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setEmptyFields([]);

        const {images} = formData;
        const data = new FormData();
        Array.from(images).forEach((image) => data.append('images', image))
        for(let key in formData){
            if(key === 'images'){
                continue;
            }
            data.append(key, formData[key]);
        }

        try {
            const response = await fetch(`/api/apartments/${apt._id}`, {
                method: 'PATCH',
                body: data,
                headers: {
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
                    dispatch({type: 'SET_APARTMENTS', payload: json});
                    setError(null);
                    setFormData({
                        bedrooms: '',
                        bathrooms: '',
                        type: 'Sell',
                        price: '',
                        available: '',
                        description: '',
                        images: []
                    });
                    setEmptyFields([]);
                }
            } 
        } catch (error) {
            setError('An unexpected error occurred during the upload.');
            setEmptyFields([]);
        }
        
    }

    const handleReset = () => {
        setError(null);
        setFormData({
            bedrooms: '',
            bathrooms: '',
            type: 'Sell',
            price: '',
            available: '',
            description: '',
            images: []
        });
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
                name="bedrooms"
                onChange={handleInputChange}
                value={formData.bedrooms}
                className={emptyFields.includes('bedrooms') ? 'error' : ''}
                min={0}
            />

            <label>Bath rooms:</label>
            <input
                type="number"
                name="bathrooms"
                onChange={handleInputChange}
                value={formData.bathrooms}
                className={emptyFields.includes('bathrooms') ? 'error' : ''}
                min={1}
            />

            <label>Type: </label>
            <select
                name="type"
                onChange={handleInputChange}
                value={formData.type}
            >
                <option value="Sell">Sell</option>
                <option value="Rent">Rent</option>
            </select>

            <label>Price:</label>
            <input
                type="number"
                name="price"
                onChange={handleInputChange}
                value={formData.price}
                className={emptyFields.includes('price') ? 'error' : ''}
                min={1}
            />

            <label>Available:</label>
            <input
                type="number"
                name="available"
                onChange={handleInputChange}
                value={formData.available}
                className={emptyFields.includes('available') ? 'error' : ''}
                min={1}
            />

            <label>Description(optional):</label>
            <textarea
                name="description"
                onChange={handleInputChange}
                value={formData.description}
            />

            <label>Images(5 images only with size limit of 2MB for each)</label>
            <input
                type="file"
                accept=".png, .jpg, .jpeg"
                multiple
                name="images"
                onChange={handleInputChange}
            />

            <input className="submit" type="submit" value="Update Apartment"/>
            <input className="cancel" type="reset" value="Cancel"/>
            {error && <div className="error">{error}</div>}
        </form>
     );
}
 
export default UpdateApt;