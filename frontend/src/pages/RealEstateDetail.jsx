import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify'
import { useAuthContext, useDataContext } from "../hooks/useContexts";

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

// components
import AptDetails from "../components/public/AptInfo";

export default function RealEstateDetail(){

    const {user} = useAuthContext();
    const {dispatch} = useDataContext();
    const { id } = useParams();
    const [realestate, setRealestate] = useState(null);
    const [realestateApts, setRealestateApts] = useState([]);

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchRealEstate = async () => {
            const response = await fetch(`/api/user/view_realestates?id=${id}`);
            const json = await response.json();
            if(response.ok){
                setRealestate(json);
            }
        };

        const fetchRealEstateApts = async () => {
            const response = await fetch(`/api/apartments/realestate_apartments?page=${currentPage}&id=${realestate?._id}`);
            const json = await response.json();
            if(response.ok){
                setTotalPages(Number(response.headers.get('X-Total-Pages')));
                if(currentPage > Number(response.headers.get('X-Total-Pages'))){
                    const response = await fetch(`/api/apartments/realestate_apartments?id=${realestate?._id}`);
                    const json = await response.json();
                    setCurrentPage(1);
                    setSearchParams({page: 1});
                    setRealestateApts(json);
                    return
                }
                setRealestateApts(json);
            }
        };

        fetchRealEstate();
        realestate?._id && fetchRealEstateApts();
    }, [currentPage, id, realestate?._id, setSearchParams])

    const handleDelete = async () => {
        const response = await fetch(`/api/user/remove_realEstate/${realestate._id}`, {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${user.token}`}
        });
        const json = await response.json();

        if(!response.ok){
            toast.error(json.error);
        }
        if(response.ok){
            toast.success('Removed a realestate successfully');
            dispatch({type: 'DELETE_REALESTATE', payload: json})
            navigate('/');
        }
    }

    const handleClick = (id) => {
        navigate(`/apartment_details/${id}`);
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
        setSearchParams({page});
    }

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
          pages.push(
            <label key={i} className={i === currentPage ? 'active' : ''}>
              <button onClick={() => handlePageClick(i)}>{i}</button>
            </label>
          );
        }
        return pages;
      };

    return ( 
        <div className="realestatedetail-page">
            <h2>RealEstate Info</h2>
            {realestate && <div className="realestate-details">
                <h4>{realestate.fullname}</h4>
                <p>Email: <strong>{realestate.email}</strong></p>
                <p>Contact: <strong>{realestate.contact}</strong></p>

                {(user?.privilege === 'superadmin') && 
                    <div>
                        <p>Created At: <strong>{formatDistanceToNow(new Date(realestate.createdAt), {addSuffix: true})}</strong></p><br />
                        <button onClick={handleDelete}>Remove RealEstate</button>
                    </div> 
                }
            </div>}

            <h2>Apartments Within this RealEstate</h2>
            <div className="realestate-apts">
                {(realestateApts?.length > 0) ? realestateApts.map( apt => (
                    <div onClick={() => handleClick(apt._id)} key={apt._id} className='links'>
                        <AptDetails key={apt._id} apt={apt}/>
                    </div>
                )) : <h3>No apartment listed by this realestate</h3> }

            </div>

            {totalPages > 1 && <div className="pagination">
                <label className="arrows"><button onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}>
                    &lt;
                </button></label>
                {renderPageNumbers()}
                <label className="arrows"><button onClick={() => currentPage < totalPages && handlePageClick(currentPage + 1)}>
                    &gt;
                </button></label>
            </div>}
        </div>
     );
}