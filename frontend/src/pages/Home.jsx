import { useState, useEffect } from 'react';
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
    const [searchKeyword, setSearchKeyword] = useState('');

    const {realestates, realestatesCurrentPage: currentPage, realestatesTotalPages: totalPages, realestatesSearchKey: searchKey, setCurrentPage, setSearchKey} = useDataContext();
    const {user} = useAuthContext();

    useEffect(() => {
        const page = parseInt(searchParams.get('page')) || 1;
        const key = searchParams.get('key') || '';
        key !== searchKey && setSearchKey(key);
        page !== currentPage && setCurrentPage('REALESTATES', page);
    }, [currentPage, searchKey, searchParams, setCurrentPage, setSearchKey, setSearchParams, totalPages]);

    useEffect(() => {
        if(totalPages < 0){
            setSearchParams({page: 1});
        }
    }, [setSearchParams, totalPages]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && searchKeyword !== '') {
            setSearchParams({key: searchKeyword});
            setSearchKey(searchKeyword);
        }
      };

    const handleClick = (id) => {
        navigate(`/realestate_details/${id}`);
    };

    const handlePageClick = (page) => {
        const prevParams = Object.fromEntries(searchParams);
        setSearchParams({...prevParams, page});
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
            <div className="realestates">
                <h2>Real Estates</h2>
                <input type="text" placeholder='Search realestates' onKeyPress={handleKeyPress} onChange={(e) => setSearchKeyword(e.target.value)} />
                {realestates.map(realestate => (
                    <div onClick={() => handleClick(realestate._id)} key={realestate._id} className="links">
                        <RealEstateInfo key={realestate._id} realestate={realestate}/>
                    </div>
                ))}
            </div>

            {user?.privilege === 'admin' && <AddApt />}
            {user?.privilege === 'superadmin' && <AddRealEstate />}

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