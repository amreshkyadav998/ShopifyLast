import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';

const Item = (props) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Optional: Adds smooth scrolling effect
    });
  };

  return (
    <div className='item'>
      <Link to={`/product/${props.id}`}>
        <img
          onClick={() => scrollToTop()} // Call scrollToTop function when image is clicked
          src={props.image}
          alt=""
        />
      </Link>
      <p>{props.name}</p>
      <div className="item-prices">
        <div className="item-price-new">
            ${props.new_price}
        </div>
        <div className="item-price-old">
            ${props.old_price}
        </div>
      </div>
    </div>
  );
};

export default Item;
