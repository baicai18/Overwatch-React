import React from 'react';
import LoadingImage from '../img/loading_white.svg';
function Loading(){
    return (
        <div className="loading-page">
            <div className="loading-message"><img src={LoadingImage} alt={"loading"}/></div>
        </div>
    )
}

export default Loading