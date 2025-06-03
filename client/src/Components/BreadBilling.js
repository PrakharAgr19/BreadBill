import React from 'react'
import { Link } from 'react-router-dom';
import Logo from '../Images/logo.png'

function BreadBilling({ theme }) {
    return (
        <div className="d-flex justify-content-center mt-3">
            <div className={`card bg-${theme.color} text-${theme.text} col-md-4`}>
                <div>
                    <img src={Logo} className="card-img-top" alt="BreadBill Logo" />
                </div>
                <div className="card-body">
                    <p className='fs-5'>
                        Welcome to <strong>BreadBill</strong> your all-in-one billing solution for bakeries and bread shops!
                        <br /><br />
                        This platform helps you manage your daily transactions, track inventory, and streamline billing with ease.
                        <br /><br />
                        Let’s get started and simplify your billing process.
                    </p>
                    <div className="d-flex justify-content-center mt-3">
                        <Link to='/home' className={`btn btn-${(theme.text === 'white' ? 'light' : 'dark')} px-4 py-2`}>
                            Continue
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BreadBilling
