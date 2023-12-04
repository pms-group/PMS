const AdminDetails = ({ admin }) => {
    return ( 
        <div className="admin-details">
            <h4>{admin.fullname}</h4>
            <p>Email: <strong>{admin.email}</strong></p>
            <p>Contact: <strong>{admin.contact}</strong></p>
        </div>
     );
}
 
export default AdminDetails;