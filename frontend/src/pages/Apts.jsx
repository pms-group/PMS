import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

// contexts
import { useAuthContext, useDataContext } from '../hooks/useContexts';

// components
import AptInfo from '../components/public/AptInfo'
import AddApt from '../components/private/admin/AddApt';
import AddRealEstate from '../components/private/superadmin/AddRealEstate';


export default function Apts(){
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const {apts, dispatch} = useDataContext();
    const {user} = useAuthContext();
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchApartments = async () => {
            const response = await fetch(`/api/apartments?page=${currentPage}`);
            const json = await response.json();
            if(response.ok){
                setTotalPages(Number(response.headers.get('X-Total-Pages')));
                if(currentPage > Number(response.headers.get('X-Total-Pages'))){
                    const response = await fetch(`/api/apartments`);
                    const json = await response.json();
                    setCurrentPage(1);
                    setSearchParams({page: 1});
                    dispatch({type: 'SET_APARTMENTS', payload: json});
                    return
                }
                dispatch({type: 'SET_APARTMENTS', payload: json});
            }
        };

        fetchApartments();
    }, [currentPage, dispatch, setSearchParams]);

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
        <div className={(user?.privilege === 'admin' || user?.privilege === 'superadmin') ? 'home': 'home1'}>

            <div className="apartments">
                <h2>Apartments</h2>
                {apts.map( apt => (
                    <div onClick={() => handleClick(apt._id)} key={apt._id} className="links">
                        <AptInfo key={apt._id} apt={apt}/>
                    </div>
                ))}
                
            </div>

            {user?.privilege === 'admin' && <AddApt />}
            {user?.privilege === 'superadmin' && <AddRealEstate />}

            {totalPages > 1 &&<div className="pagination">
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