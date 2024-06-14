import React from 'react'
import SignUpForm from './SignUpForm'

const SignUp = () => {
    return (
        <div className="auth-container bg-white">
            <div className="mb-8">
                <h3 style={{ color: '#832729' }} className="mb-1">
                    Vendor Registration
                </h3>
                <p>Please fill KYC details to became a vendor!</p>
            </div>
            <SignUpForm disableSubmit={false} />
        </div>
    )
}

export default SignUp
