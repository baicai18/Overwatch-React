import React from 'react'

const ConfirmationRegister = () =>{
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-xl-6 col-lg-6 col-md-9">
                    <div className="card o-hidden border-0 shadow-lg my-5">
                        <div className="card-body p-0">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="p-5">
                                        <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">Confirmation Email Sent</h1>
                                        </div>
                                        <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">Please check your email for a link to confirm your account</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationRegister;