import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>An e-commerce website is an platform that facilitate buying and selling of products or services over the internet serves as a virtual marketplace where businesses and individual showcase their products, interact and customers, and conduct transactions without the need for a physical presence. E-commerce websites have gained immense popularity due to their convenience accessibility, and the global reach they offer. </p>
        <p>
        E-commerce websites serve as platforms for showcasing a diverse array of products or services, each meticulously presented with detailed descriptions, vivid imagery, pricing information, and any available variations, such as sizes or colors. Every product or service on these platforms occupies its dedicated space, carefully curated to offer pertinent information to potential buyers.
        </p>
      </div>
    </div>
  )
}

export default DescriptionBox
