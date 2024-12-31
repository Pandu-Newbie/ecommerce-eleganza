import React, { useContext } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);

  const handleCheckout = async () => {
    try {
      const orderId = `order-${Date.now()}`; // Generate unique order id
      const grossAmount = getTotalCartAmount();
      const customerDetails = {
        first_name: 'Pandu',
        last_name: 'Mahasiswa',
        email: 'pandu@example.com',
        phone: '08123456789'
      };

      const response = await fetch('http://localhost:4000/create-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token')
        },
        body: JSON.stringify({ orderId, grossAmount, customerDetails })
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to Midtrans payment page
        window.location.href = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${data.transactionToken}`;
      } else {
        alert('Failed to create transaction');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Error during checkout');
    }
  };

  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="cartitems-format cartitems-format-main">
                <img src={e.image} alt='' className='carticon-product-icon' />
                <p>{e.name}</p>
                <p>Rp{e.new_price}</p>
                <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                <p>Rp{e.new_price * cartItems[e.id]}</p>
                <img className='cartitems-remove-icon' src={remove_icon} onClick={() => { removeFromCart(e.id) }} alt='' />
              </div>
              <hr />
            </div>
          );
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
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>Rp{getTotalCartAmount()}</h3>
            </div>
          </div>
          <button onClick={handleCheckout}>CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>Masukkan Kode Promo</p>
          <div className="cartitems-promobox">
            <input type='text' placeholder='promo code' />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItems;
