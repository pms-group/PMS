export default function AptInfo({ apt }){
    return ( 
        <div className="apt-details">
            {apt.imageUrls.length > 0 ? <img src={`http://localhost:5000/${apt.imageUrls[0]}`} alt="" /> : null}
            <h4>{apt.realestate_name}'s Apartment</h4>
            <p><strong>{apt.bedrooms}</strong> bedrooms</p>
            <p><strong>{apt.bathrooms}</strong> bathrooms</p>
            <p>For <strong>{apt.type}</strong>{apt.type === 'both' && <strong> Sale and Rent</strong>}</p>
            <p><strong>{apt.available}</strong> apartment/s available</p>
            <p>Price: <strong>{apt.price}</strong></p>
        </div>
     );
}