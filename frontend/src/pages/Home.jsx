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

    const {realestates, realestatesTotalPages: totalPages, realestatesParams, setRealEstatesParams} = useDataContext();
    const {user} = useAuthContext();

    const [searchKeyword, setSearchKeyword] = useState(realestatesParams.searchKey);
    const [sortField, setSortField] = useState(realestatesParams.sortField);
    const [sortOrder, setSortOrder] = useState(realestatesParams.sortOrder);

    useEffect(() => {
        const page = parseInt(searchParams.get('page')) || 1;
        const key = searchParams.get('key') || '';
        const sortBy = searchParams.get('sort_by') || 'createdAt';
        const order = searchParams.get('order') || 'desc';
        if(page !== realestatesParams.currentPage ||
            key !== realestatesParams.searchKey ||
            sortBy !== realestatesParams.sortField ||
            order !== realestatesParams.sortOrder){
                setRealEstatesParams({
                    currentPage: page !== realestatesParams.currentPage ? page : realestatesParams.currentPage,
                    searchKey: key !== realestatesParams.searchKey ? key : realestatesParams.searchKey,
                    sortField: sortBy !== realestatesParams.sortField ? sortBy : realestatesParams.sortField,
                    sortOrder: order !== realestatesParams.sortOrder ? order : realestatesParams.sortOrder,
                });
            }
    }, [realestatesParams.currentPage, realestatesParams.searchKey, realestatesParams.sortField, realestatesParams.sortOrder, searchParams, setRealEstatesParams]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && searchKeyword !== '') {
            setSearchParams({key: searchKeyword});
        }
      };

    const handleClick = (id) => {
        navigate(`/realestate_details/${id}`);
    };

    const handlePageClick = (page) => {
        const prevParams = Object.fromEntries(searchParams);
        setSearchParams({...prevParams, page});
    }

    const handleDropDownChange = (e) => {
        const { name, value } = e.target;
        const prevParams = Object.fromEntries(searchParams);
        if(name === 'sort_by'){
            setSortField(value);
            setSortOrder('asc');
            setSearchParams({...prevParams, [name]: value, order: 'asc'});
        } else{
            setSortOrder(value);
            setSearchParams({...prevParams, [name]: value});
        }
    }

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
          pages.push(
            <label key={i} className={i === realestatesParams.currentPage ? 'active' : ''}>
              <button onClick={() => handlePageClick(i)}>{i}</button>
            </label>
          );
        }
        return pages;
      };
    
    return ( 
        <div className={(user?.privilege === 'admin' || user?.privilege === 'superadmin') ? 'home': 'home1'}>

            <div>
                <span>Sort by:</span>
                <select name='sort_by' value={sortField} onChange={handleDropDownChange}>
                    <option value="fullname">Name</option>
                    <option value="createdAt">Created Date</option>
                </select>
                <select name='order' value={sortOrder} onChange={handleDropDownChange}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>

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
                <label className="arrows"><button onClick={() => realestatesParams.currentPage > 1 && handlePageClick(realestatesParams.currentPage - 1)}>
                    &lt;
                </button></label>
                {renderPageNumbers()}
                <label className="arrows"><button onClick={() => realestatesParams.currentPage < totalPages && handlePageClick(realestatesParams.currentPage + 1)}>
                    &gt;
                </button></label>
            </div>}
        </div>

     );
}