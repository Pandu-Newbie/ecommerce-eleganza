import React from 'react'
import '../Popular/Popular'
import './Item.css'

const Item = (props) => {
  return (
    <div className='item'>
      <img src={props.image} alt=''/>
      <p>{props.name}</p>
      <div className='item-prices'>
        <div className='item-price-new'>
          Rp{props.new_price}
        </div>
        <div className='item-price-old'>
            Rp{props.old_price}
        </div>
      </div>
    </div>
  )
}

export default Item