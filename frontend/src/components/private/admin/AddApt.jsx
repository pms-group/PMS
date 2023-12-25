import { useState } from "react";
import { toast } from 'react-toastify'
import { useDataContext, useAuthContext } from "../../../hooks/useContexts";

export default function AddApt(){
    const {dispatch} = useDataContext();
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

    const [emptyFields, setEmptyFields] = useState([]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: files || value,
        }));
      };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
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
            const response = await fetch('/api/apartments', {
                method: 'POST',
                body: data,
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();
    
            if(!response.ok){
                toast.error(json.error);
                setEmptyFields(json.emptyFields);
            }
            if(response.ok){
                toast.success('Added an apartment successfully');
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
                dispatch({type: 'CREATE_APARTMENT', payload: json});
            }
        } catch (err) {
            toast.error(err.message);
            setEmptyFields([]);
        }
        
    }

    const handleReset = (e) => {
        e.preventDefault()
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
            <h3>Add a new Apartment</h3>

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
                min={0}
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

            <input className="submit" type="submit" value="Add Apartment"/>
            <input className="cancel" type="reset" value="Cancel"/>
        </form>
     );
}