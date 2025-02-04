import React from 'react';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Search extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user:props.user,
            siteTitle:props.siteTitle,
        }
    }
    render() {
        return (
            <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                <div className="input-group">
                    <input type="text" className="form-control border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2"/>
                    <div className="input-group-append">
                        <button className="btn btn-primary" type="button">
                            {/* <FontAwesomeIcon icon="search"/> */}
                            <i className="fas fa-search fa-sm"></i>
                        </button>
                    </div>
                </div>
            </form>
        );
    }

}

export default Search;