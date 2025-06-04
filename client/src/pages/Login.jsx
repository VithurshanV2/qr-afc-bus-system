import React, { useState } from 'react';
import { assets } from '../assets/assets';

const Login = () => {

    const [state, setState] = useState('Sign Up');

    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0
        bg-gradient-to-br from-yellow-200 to-orange-400'>
            <div className='bg-[#1f1f1f] p-10 rounded-lg shadow-lg w-full sm:w-96 text-yellow-300 text-sm'>
                <h2 className='text-3xl text-white text-center font-semibold mb-3'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
                <p className='text-sm text-center mb-6'>{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>

                <form>
                    {state === 'Sign Up' && (
                        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#3a3a3a]'>
                            <img src={assets.user_icon} alt="user icon" />
                            <input className='bg-transparent outline-none' type="text" placeholder='Full Name' required />
                        </div>)}
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#3a3a3a]'>
                        <img src={assets.mail_icon} alt="mail icon" />
                        <input className='bg-transparent outline-none' type="email" placeholder='Email ID' required />
                    </div>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#3a3a3a]'>
                        <img src={assets.lock_icon} alt="lock icon" />
                        <input className='bg-transparent outline-none' type="password" placeholder='Password' required />
                    </div>
                    <p className='mb-4 text-yellow-400 cursor-pointer'>Forgot password?</p>

                    <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 
                    text-white font-medium'>{state}</button>
                </form>
                {state === 'Sign Up' ?
                    (<p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{' '}
                        <span className='text-orange-300 cursor-pointer underline'>Login here</span>
                    </p>)
                    :
                    (<p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{' '}
                        <span className='text-orange-300 cursor-pointer underline'>Sign up</span>
                    </p>)}
            </div>
        </div>
    );
};

export default Login;
