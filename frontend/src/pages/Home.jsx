import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// contexts
import { useAuthContext, useDataContext } from "../hooks/useContexts";

// components
import RealEstateInfo from '../components/public/RealEstateInfo';
import AddApt from '../components/private/admin/AddApt';
import AddRealEstate from '../components/private/superadmin/AddRealEstate';

export default function Home(){
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const {realestates} = useDataContext();
    const {user, realestatesCurrentPage: currentPage, realestatesTotalPage: totalPage, dispatch: pageDispatch} = useAuthContext();

    useEffect(() => {
        pageDispatch({type: 'SET_REALESTATES_CURRENTPAGE', payload: Number(searchParams.get('page')) || 1});
    }, [pageDispatch, searchParams])

    const handleClick = (id) => {
        navigate(`/realestate_details/${id}`);
    };

    const handlePageClick = (page) => {
        pageDispatch({type: 'SET_REALESTATES_CURRENTPAGE', payload: page});
        setSearchParams({page});
    }

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPage; i++) {
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
            <div className="realestates">
                <h2>Real Estates</h2>
                {realestates.map(realestate => (
                    <div onClick={() => handleClick(realestate._id)} key={realestate._id} className="links">
                        <RealEstateInfo key={realestate._id} realestate={realestate}/>
                    </div>
                ))}
            </div>

            {user?.privilege === 'admin' && <AddApt />}
            {user?.privilege === 'superadmin' && <AddRealEstate />}

            {totalPage > 1 && <div className="pagination">
                <label className="arrows"><button onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}>
                    &lt;
                </button></label>
                {renderPageNumbers()}
                <label className="arrows"><button onClick={() => currentPage < totalPage && handlePageClick(currentPage + 1)}>
                    &gt;
                </button></label>
            </div>}
        </div>

     );
}