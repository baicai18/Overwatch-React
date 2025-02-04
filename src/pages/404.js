import React from 'react'

const NotFound = () =>{
    return (
        <div class="container-fluid">
            <div class="text-center">
            <div class="error mx-auto" data-text="404">404</div>
            <p class="lead text-gray-800 mb-5">Page Not Found</p>
            <p class="text-gray-500 mb-0">Oops! Did you take a wrong turn?</p>
            <a href="/">&larr; Back Home</a>
            </div>

        </div>
    )
}

export default NotFound;