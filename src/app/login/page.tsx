'use client';

import { useRef ,useState } from 'react';
import "../../../public/css/login.css"
import Link from 'next/link';
import Image from 'next/image';
import Button from "@/components/ui/Button";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const LoginPage = () => {
    const [phone, setPhone] = useState<string | undefined>();
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
                {/* <button className="px-4 py-2 btn-magnetic font-medium rounded focus:outline-none text-white w-full animation" type="submit" style={{ "--i": 3, "--j": 24 } as React.CSSProperties}>Login</button> */}
                <Button className="w-full animation" name="Sign in"  style={{ "--i": 3, "--j": 24 } as React.CSSProperties}/>
                <div className="logreg-link animation" style={{ "--i": 4, "--j": 25 } as React.CSSProperties}>
                    <Link href="#" className="text-green-500">Forgot Your Password?</Link>
                    <p>Dont have an account?  
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
                 
                <div className={`phone-input-box animation ${phone ? 'has-value' : ''}`} style={{ "--i": 19, "--j": 2 } as React.CSSProperties}>
                    <PhoneInput
                        international
                        defaultCountry="PH"
                        value={phone}
                        onChange={setPhone}
                        className="PhoneInput"
                    />
                    <label>Phone Number</label>
                </div>
                <div className="input-box animation" style={{ "--i": 20, "--j": 3 } as React.CSSProperties}>
                    <input type="password" required />
                    <label>Password</label>
                    <i className='bx bxs-lock-alt' ></i>
                </div>
                <div className=" form-check animation mb-2" style={{ "--i": 20, "--j": 3 } as React.CSSProperties}>
                    <input type="checkbox" required checked/>  I agree to the <Link className='text-green-500' href="#"> Terms and Conditions</Link>
                </div>
                {/* <button className="px-4 py-2 btn-magnetic font-medium rounded focus:outline-none text-white w-full animation" style={{ "--i": 21, "--j": 4 } as React.CSSProperties} type="submit" >Sign up</button> */}
                <Button className="w-full animation" name="Sign up"  style={{ "--i": 21, "--j": 4 } as React.CSSProperties}/>
                <div className="logreg-link animation" style={{ "--i": 22, "--j": 5 } as React.CSSProperties}>
                    <p>Already have an account?
                    <Link href="javascript:void(0)" onClick={handleLoginClick} className="login-link"> Sign in</Link></p>
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