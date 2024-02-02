import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify'
import { useAuthContext, useDataContext } from "../hooks/useContexts";

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

// components
import AptDetails from "../components/public/AptInfo";

export default function RealEstateDetail(){
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const {realestateInfo, realestateApts, realestateAptsTotalPages: totalPages, realestateAptsParams, setRealEstateAptsParams, dispatch} = useDataContext();
    const {user} = useAuthContext();
    const { id } = useParams();

    const [sortField, setSortField] = useState(realestateAptsParams.sortField);
    const [sortOrder, setSortOrder] = useState(realestateAptsParams.sortOrder);

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
        const sortBy = searchParams.get('sort_by') || 'createdAt';
        const order = searchParams.get('order') || 'desc';
        if(page !== realestateAptsParams.currentPage ||
            sortBy !== realestateAptsParams.sortField ||
            order !== realestateAptsParams.sortOrder){
                setRealEstateAptsParams({
                    currentPage: page !== realestateAptsParams.currentPage ? page : realestateAptsParams.currentPage,
                    sortField: sortBy !== realestateAptsParams.sortField ? sortBy : realestateAptsParams.sortField,
                    sortOrder: order !== realestateAptsParams.sortOrder ? order : realestateAptsParams.sortOrder,
                })
            }
    }, [realestateAptsParams.currentPage, realestateAptsParams.sortField, realestateAptsParams.sortOrder, searchParams, setRealEstateAptsParams]);

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
            <label key={i} className={i === realestateAptsParams.currentPage ? 'active' : ''}>
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

            <h2>Apartments Within this RealEstate</h2>
            <div className="realestate-apts">
                {(realestateApts?.length > 0) ? realestateApts.map( apt => (
                    <div onClick={() => handleClick(apt._id)} key={apt._id} className='links'>
                        <AptDetails key={apt._id} apt={apt}/>
                    </div>
                )) : <h3>No apartment listed by this realestate</h3> }

            </div>

            {totalPages > 1 && <div className="pagination">
                <label className="arrows"><button onClick={() => realestateAptsParams.currentPage > 1 && handlePageClick(realestateAptsParams.currentPage - 1)}>
                    &lt;
                </button></label>
                {renderPageNumbers()}
                <label className="arrows"><button onClick={() => realestateAptsParams.currentPage < totalPages && handlePageClick(realestateAptsParams.currentPage + 1)}>
                    &gt;
                </button></label>
            </div>}
        </div>
     );
}