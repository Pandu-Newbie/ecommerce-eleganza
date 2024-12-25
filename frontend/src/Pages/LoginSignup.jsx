import React from 'react';
import './CSS/LoginSignup.css';

export const LoginSignup = () => {
  return (
    <div className="login-signup">
      <div className="login-signup-container">
        <h1>Masuk</h1>
        <p className="login-signup-subtext">
          Belum punya akun Eleganza? <span className="login-signup-register">Daftar</span>
        </p>

        <button className="google-login">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google Logo"
          />
          Google
        </button>

        <div className="divider">
          <span></span>
          <p>atau</p>
          <span></span>
        </div>

        <div className="login-signup-fields">
          <input type="text" placeholder="Nomor HP atau Alamat Email" />
          <input type="password" placeholder="Masukkan Password Anda" />
        </div>

        <p className="forgot-password">Lupa password?</p>

        <button className="login-button">LOGIN</button>

        <p className="terms">
          Dengan melanjutkan, saya menyetujui{' '}
          <span className="highlight">Syarat & Ketentuan</span> serta{' '}
          <span className="highlight">Kebijakan Privasi Eleganza</span>.
        </p>
      </div>
    </div>
  );
};

export default LoginSignup
