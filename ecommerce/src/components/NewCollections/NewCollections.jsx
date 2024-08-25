import React, { useEffect, useState } from 'react'
import './NewCollections.css'
// import new_collection from '../Assets/new_collections'
import Item from '../Item/Item'

const NewCollections = () => {

  const [newCollection, setNewCollection] = useState([]);

  useEffect(() => {
    fetch("https://shopifylast-production.up.railway.app/newcollections")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setNewCollection(data))
      .catch((error) => console.error('Fetch error:', error));
  }, []);

  return (
    <div className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr/>
      <div className="collections">
        {Array.isArray(newCollection) && newCollection.map((item, i) => {
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
        })}
      </div>
    </div>
  )
}

export default NewCollections
