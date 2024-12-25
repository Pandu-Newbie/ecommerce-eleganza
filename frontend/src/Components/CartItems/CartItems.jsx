import React, { useContext } from 'react'
import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext'
import remove_icon from '../Assets/cart_cross_icon.png'

const CartItems = () => {
  const {getTotalCartAmount, all_product, cartItems, removeFromCart} = useContext(ShopContext);
  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Product</p>
        <p>Tittle</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr/>
      {all_product.map((e)=>{
        if(cartItems[e.id]>0)
        {
          return <div>
          <div className="cartitems-format cartitems-format-main">
            <img src={e.image} alt='' className='carticon-product-icon'/>
            <p>{e.name}</p>
            <p>Rp{e.new_price}</p>
            <button className='cartitems-quantity'>{cartItems[e.id]}</button>
            <p>Rp{e.new_price*cartItems[e.id]}</p>
            <img className='cartitems-remove-icon'  src={remove_icon}  onClick={()=>{removeFromCart(e.id)}} alt=''/>
          </div>
          <hr/> 
        </div>
        }
        return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Total</h1>
          <div>
            <div className="cartitems-total-item">
              <p>SubTotal</p>
              <p>Rp{getTotalCartAmount()}</p>
            </div>
            <hr/>
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr/>
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>Rp{getTotalCartAmount()}</h3>
            </div>
          </div>
          <button>CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>Masukkan Kode Promo</p>
          <div className="cartitems-promobox">
            <input type='text' placeholder='promo code'/>
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItems