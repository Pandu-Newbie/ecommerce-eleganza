import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
    const [allproducts, setAllProducts] = useState([]);

    const fetctInfo = async ()=>{
      await fetch('http://localhost:4000/allproducts')
      .then((res)=>res.json())
      .then((data)=>{setAllProducts(data)});
    }
    
    useEffect(()=>{
      fetctInfo();
    },[])

    const remove_product = async (id)=>{
      await fetch('http://localhost:4000/removeproduct',{
        method:'POST',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json',
        },
        body:JSON.stringify({id:id})
      })
      await fetctInfo();
    }

  return (
    <div className='list-product'>
      <h1>Product List</h1>
      <div className='listproduct-format-main'>
        <p>Product</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproduct">
        <hr/>
        {allproducts.map((product,index)=>{
          return <div key={index} className="listproduct-format-main listproduct-format">
              <img src={product.image} alt="" className="listproduct-product-icon" />
              <p>{product.name}</p>
              <p>Rp{product.old_price}</p>
              <p>Rp{product.new_price}</p>
              <p>{product.category}</p>
              <img onClick={()=>{remove_product(product.id)}} src={cross_icon} alt="" className="listproduct-remove-icon" />
          </div>
        })}
      </div>
    </div>
  )
}

export default ListProduct