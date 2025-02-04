import React from 'react';
import Auth from '../auth';
import DashRFQ from '../apps/dashboards/employee/DashRFQ';
import {Row, Col} from 'react-bootstrap';
class Home extends React.Component{

    componentDidMount(){
        if(Auth.userInfo){
            
        }
    }

    render = ()=>{
        return (
            <div className="container-fluid">
                <pre>
                    Welcome
                    {/* {JSON.stringify(Auth.userInfo,null,2)} */}
                </pre>
                <Row>
                    {
                        Auth.userInfo.account_type === 0?
                        <Col md="12">
                            <DashRFQ/>
                        </Col>
                        :''

                    }
                </Row>
            </div>
        );
    }
}

export default  Home;