import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';

// contexts
import { useAuthContext, useDataContext } from '../hooks/useContexts';

// components
import AptInfo from '../components/public/AptInfo'
import AddApt from '../components/private/admin/AddApt';
import AddRealEstate from '../components/private/superadmin/AddRealEstate';


export default function Apts(){
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const {apts, aptsTotalPages: totalPages, aptsParams, setAptsParams} = useDataContext();
    const {user} = useAuthContext();

    const [sortField, setSortField] = useState(aptsParams.sortField);
    const [sortOrder, setSortOrder] = useState(aptsParams.sortOrder);

    useEffect(() => {
        const page = parseInt(searchParams.get('page')) || 1;
        const sortBy = searchParams.get('sort_by') || 'createdAt';
        const order = searchParams.get('order') || 'desc';
        if(page !== aptsParams.currentPage ||
            sortBy !== aptsParams.sortField ||
            order !== aptsParams.sortOrder){
                setAptsParams({
                    currentPage: page !== aptsParams.currentPage ? page : aptsParams.currentPage,
                    sortField: sortBy !== aptsParams.sortField ? sortBy : aptsParams.sortField,
                    sortOrder: order !== aptsParams.sortOrder ? order : aptsParams.sortOrder,
                })
            }
    }, [aptsParams.currentPage, aptsParams.sortField, aptsParams.sortOrder, searchParams, setAptsParams]);

    const handleClick = (id) => {
        navigate(`/apartment_details/${id}`);
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
            <label key={i} className={i === aptsParams.currentPage ? 'active' : ''}>
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
                    <option value="bedrooms">Bedrooms</option>
                    <option value="bathrooms">Bathrooms</option>
                    <option value="type">Type</option>
                    <option value="price">Price</option>
                    <option value="createdAt">Created Date</option>
                </select>
                <select name='order' value={sortOrder} onChange={handleDropDownChange}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>

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
                <label className="arrows"><button onClick={() => aptsParams.currentPage > 1 && handlePageClick(aptsParams.currentPage - 1)}>
                    &lt;
                </button></label>
                {renderPageNumbers()}
                <label className="arrows"><button onClick={() => aptsParams.currentPage < totalPages && handlePageClick(aptsParams.currentPage + 1)}>
                    &gt;
                </button></label>
            </div>}
        </div>
     );
}