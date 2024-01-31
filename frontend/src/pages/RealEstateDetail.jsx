import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {  useEffect } from 'react';
import { toast } from 'react-toastify'
import { useAuthContext, useDataContext } from "../hooks/useContexts";

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

// components
import AptDetails from "../components/public/AptInfo";

export default function RealEstateDetail(){
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const {realestateInfo, realestateApts, realestateAptsCurrentPage: currentPage, realestateAptsTotalPages: totalPages, setCurrentPage, dispatch} = useDataContext();
    const {user} = useAuthContext();
    const { id } = useParams();

    useEffect(() => {
        const fetchRealEstate = async () => {
            const response = await fetch(`/api/user/view_realestates?id=${id}`);
            const json = await response.json();
            if(response.ok){
                dispatch({type: 'SET_REALESTATEINFO', payload: json});
            }
            if(!response.ok){
                toast.error(json.error);
            }
        };

        fetchRealEstate();
    }, [dispatch, id]);

    useEffect(() => {
        const page = parseInt(searchParams.get('page')) || 1;
        page !== currentPage && setCurrentPage('REALESTATEAPTS', page);
    }, [currentPage, searchParams, setCurrentPage]);

    useEffect(() => {
        if(totalPages < 0){
            setSearchParams({page: 1});
        }
    }, [setSearchParams, totalPages]);

    const handleDelete = async () => {
        const response = await fetch(`/api/user/remove_realEstate/${realestateInfo._id}`, {
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
            {realestateInfo && <div className="realestate-details">
                <h4>{realestateInfo.fullname}</h4>
                <p>Email: <strong>{realestateInfo.email}</strong></p>
                <p>Contact: <strong>{realestateInfo.contact}</strong></p>

                {(user?.privilege === 'superadmin') && 
                    <div>
                        <p>Created At: <strong>{formatDistanceToNow(new Date(realestateInfo.createdAt), {addSuffix: true})}</strong></p><br />
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