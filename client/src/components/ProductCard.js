import React from 'react';
import ReactStars from "react-rating-stars-component";
import { Link,useLocation } from 'react-router-dom';
const ProductCard = (props) => {
    const {grid,data} = props;
    let location = useLocation();
    return (
    <>
    {
        data?.map((item,index) => {
            return(
            <div 
                key={index}
                className={` ${
                location.pathname == "/product" ? `gr-${grid}`:"col-3"
                }`}
            >
            <Link
                to={`${
                location.pathname == "/"
                ? "/product/:id"
                : location.pathname == "/product/:id"
                ? "/product/:id"
                : ":id"
                }`}
                className="product-card position-relative"
            >
            <div className="wishlist-icon position-absolute">
                <button className="border-0 bg-transparent">
                <img src="/images/wish.svg"  alt="wishlist"/>
                </button>
            </div>
            <div className="product-image">
                <img src="/images/arganoil.JPG"
                    className="img-fluid d-block mx-auto"
                    width={160}
                    alt="product image"
                />
                <img src="/images/garnier_hydrabomb.jpg"
                    className="img-fluid  mx-auto"
                    width={160}
                    alt="product image"
                />
            </div>
            <div className="product-details">
                <h4 className="brand">{item?.brand}</h4>
                <h5 className="product-title">
                 {item?.title}
                </h5>
                <ReactStars
                    count={5}
                    size={24}
                    value={item?.totalrating.toString()}
                    edit={false}
                    activeColor="#ffd700"
                />
                <p className={`description ${grid === 12 ? "d-block":"d-none"}`}>
                {item?.description}
                </p>
                <p className="price">{item?.price}</p>
            </div>
            <div className="action-bar position-absolute">
               <div className="d-flex flex-column gap-15">
                <button className="border-0 bg-transparent">
                <img src="/images/prodcompare.svg" alt="compare"/>
                </button>
                <button className="border-0 bg-transparent">
                <img src="/images/view.svg" alt="view"/>
                </button>
                <button className="border-0 bg-transparent">
                <img src="/images/add-cart.svg" alt="add-cart"/>
                </button>
                </div>
            </div>
            </Link>
            </div>
            );
        })
    }
    </>
  );
};

export default ProductCard;