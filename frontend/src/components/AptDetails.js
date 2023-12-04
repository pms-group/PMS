const AptDetails = ({ apt }) => {
    return ( 
        <div className="apt-details">
            <h4>{apt.realestate_name}</h4>
            <p><strong>{apt.bedrooms}</strong> bedrooms</p>
            <p><strong>{apt.bathrooms}</strong> bathrooms</p>
            <p>For <strong>{apt.type}</strong>{apt.type === 'both' && <strong> Sale and Rent</strong>}</p>
            <p><strong>{apt.available}</strong> apartment/s available</p>
            <p>Price: <strong>{apt.price}</strong></p>
            </div>
     );
}
 
export default AptDetails;