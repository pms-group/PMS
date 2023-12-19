export default function RealEstateInfo({ realestate }){
    return ( 
        <div className="realestate-details">
            <h4>{realestate.fullname}</h4>
            <p>Email: <strong>{realestate.email}</strong></p>
            <p>Contact: <strong>{realestate.contact}</strong></p>
        </div>
     );
}