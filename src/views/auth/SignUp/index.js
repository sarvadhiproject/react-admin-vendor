import React from 'react'
import SignUpForm from './SignUpForm'

const SignUp = () => {
    return (
        <div className="auth-container bg-white">
            <div className="mb-8">
                <h3 className="mb-1">Vendor Registration</h3>
                <p>Please create an account to became a vendor!</p>
            </div>
            <SignUpForm disableSubmit={false} />
        </div>
    )
}

export default SignUp
