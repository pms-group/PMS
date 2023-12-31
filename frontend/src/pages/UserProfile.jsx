import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
// contexts
import { useAuthContext } from '../hooks/useContexts';

// components
import UpdateProfile from '../components/private/UpdateProfile';
import AptDetails from "../components/public/AptInfo";

export default function UserProfile(){
    const {user} = useAuthContext();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [realestateApts, setRealestateApts] = useState([]);

    useEffect(() => {
        const fetchRealEstateApts = async () => {
            const response = await fetch(`/api/apartments/realestate_apartments?page=${currentPage}&id=${user?._id}`);
            const json = await response.json();
            if(response.ok){
                setTotalPages(response.headers.get('X-Total-Pages'));
                setRealestateApts(json);
            }
        };

       user?.privilege === 'admin' && fetchRealEstateApts();
    }, [currentPage, user?._id, user?.privilege]);

    const handleClick = (id) => {
        navigate(`/apartment_details/${id}`);
    };

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
          pages.push(
            <label key={i} className={i === currentPage ? 'active' : ''}>
              <button onClick={() => setCurrentPage(i)}>{i}</button>
            </label>
          );
        }
        return pages;
      };

    return ( 
        <div className="profile-page">
            {user && <div className="profile">
                <h2>My Profile</h2>
                <p>Full Name: <strong>{user.fullname}</strong></p>
                <p>Email: <strong>{user.email}</strong></p>
                <p>Username: <strong>{user.username}</strong></p>
                <p>Contact: <strong>{user.contact}</strong></p>
                <p>Privilege: <strong>{user.privilege}</strong></p>
                <p>Address: <strong>{user.address}</strong></p>
                <p>Gender: <strong>{user.gender}</strong></p>
                <p>Bio: <strong>{user.description}</strong></p>
            </div>}

            {user && <UpdateProfile />}

            {user.privilege === 'admin' && <div>
                <h2>My Apartments</h2>
                <div className="realestate-apts">
                    {(realestateApts?.length > 0) ? realestateApts.map( apt => (
                        <div onClick={() => handleClick(apt._id)} key={apt._id} className='links'>
                            <AptDetails key={apt._id} apt={apt}/>
                        </div>
                    )) : <h3>You have not listed any apartment</h3> }
                </div>
            </div>}

            {totalPages > 1 && <div className="pagination">
                <label className="arrows"><button onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
                    &lt;
                </button></label>
                {renderPageNumbers()}
                <label className="arrows"><button onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>
                    &gt;
                </button></label>
            </div>}

        </div>
     );
}