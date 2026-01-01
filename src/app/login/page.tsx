'use client';

import { useRef } from 'react';
import "../../../public/css/login.css"
import Link from 'next/link';
import Image from 'next/image';

const LoginPage = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleRegisterClick = () => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.add('active');
    }
  };

  const handleLoginClick = () => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.remove('active');
    }
  };
 

  return (
    <div ref={wrapperRef} className="wrapper">
        <span className="bg-animate"></span>
        <span className="bg-animate2"></span>

        <div className="form-box login">
            <h2 className="animation" style={{ "--i": 0, "--j": 21 } as React.CSSProperties}>Login</h2>
            <form action="#">
                <div className="input-box animation" style={{ "--i": 1, "--j": 22 } as React.CSSProperties}>
                    <input type="text" required />
                    <label>Username</label>
                    <i className='bx bxs-user'></i>
                </div>
                <div className="input-box animation" style={{ "--i": 2, "--j": 23 } as React.CSSProperties}>
                    <input type="password" required />
                    <label>Password</label>
                    <i className='bx bxs-lock-alt' ></i>
                </div>
                <button className="btn animation" type="submit" style={{ "--i": 3, "--j": 24 } as React.CSSProperties}>Login</button>
                <div className="logreg-link animation" style={{ "--i": 4, "--j": 25 } as React.CSSProperties}>
                    <Link href="#" className="text-blue-500">Forgot Your Password?</Link>
                    <p>Don't have an account?  
                    <Link href="javascript:void(0)" onClick={handleRegisterClick} className="register-link"> Sign up</Link></p>
                </div>
            </form>
        </div>
        <div className="info-text login">
            <Image
                src="/logo/footer.svg"
                alt="Cocotel Logo"
                width={200}
                height={54}
                className="object-contain animation"
                loading="lazy"
                style={{ "--i": 0, "--j": 22 } as React.CSSProperties}
            />
            <h2 className="animation " style={{ "--i": 1, "--j": 21 } as React.CSSProperties}>Welcome back!</h2>
        </div>

        <div className="form-box register ">
            <h2 className="animation" style={{ "--i": 17, "--j": 0 } as React.CSSProperties}>Sign up</h2>
            <form action="#">
                <div className="input-box animation" style={{ "--i": 18, "--j": 1 } as React.CSSProperties} >
                    <input type="text" required />
                    <label>Username</label>
                    <i className='bx bxs-user'></i>
                </div>
                <div className="input-box animation" style={{ "--i": 19, "--j": 2 } as React.CSSProperties}>
                    <input type="text" required />
                    <label>Email</label>
                    <i className='bx bxs-envelope' ></i>
                </div>
                 <div
                    className="select-box animation"
                    style={{ "--i": 19, "--j": 2 } as React.CSSProperties}
                    >
                    <select required>
                        <option value="+91">India (+91)</option>
                        <option value="+1">USA (+1)</option>
                        <option value="+44">UK (+44)</option>
                        <option value="+61">Australia (+61)</option>
                    </select>
                    <label>Country Code</label>
                    </div>
                <div className="input-box animation" style={{ "--i": 19, "--j": 2 } as React.CSSProperties}>
                    <input type="number" required />
                    <label>Phone</label>
                    <i className='bx bxs-envelope' ></i>
                </div>
                <div className="input-box animation" style={{ "--i": 20, "--j": 3 } as React.CSSProperties}>
                    <input type="password" required />
                    <label>Password</label>
                    <i className='bx bxs-lock-alt' ></i>
                </div>
                <div className=" form-check animation mb-2" style={{ "--i": 20, "--j": 3 } as React.CSSProperties}>
                    <input type="checkbox" required checked/>  I agree to the <Link className='text-blue-500' href="#"> Terms and Conditions</Link>
                </div>
                <button className="btn animation" style={{ "--i": 21, "--j": 4 } as React.CSSProperties} type="submit" >Sign up</button>
                <div className="logreg-link animation" style={{ "--i": 22, "--j": 5 } as React.CSSProperties}>
                    <p>Already have an account?
                    <Link href="javascript:void(0)" onClick={handleLoginClick} className="login-link"> Login</Link></p>
                </div>
            </form>
        </div>

        <div className="info-text register">
            <Image
                src="/logo/footer.svg"
                alt="Cocotel Logo"
                width={200}
                height={54}
                className="object-contain animation"
                loading="lazy"
                style={{ "--i": 17, "--j": 0 } as React.CSSProperties}
            />
            <h2 className="animation" style={{ "--i": 17, "--j": 0 } as React.CSSProperties}>Welcome!</h2>
        </div>
    </div>

  );
};

export default LoginPage;