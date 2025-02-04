import React from 'react';
import {
    Nav,Accordion,Button
} from 'react-bootstrap'


import logo from '../logo.svg';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class UserMenu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user:props.user,
            siteTitle:props.siteTitle,
        }
    }
    render() {
        return (
            <Nav as="ul" className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar"> 
                <a className="sidebar-brand d-flex align-items-center justify-content-left" href="/">
                    <div className="sidebar-brand-icon ">
                        <img className="" src={'/BEMA Logo1.png'} style={{width:'100%'}}  alt="blank"/>
                    </div>
                    <div className="sidebar-brand-text mx-3">{this.state.siteTitle}</div>
                </a>
                <hr className="sidebar-divider my-0"/>
                <li className="nav-item active">
                    <a className="nav-link" href="/">
                        <i className="fas fa-tachometer-alt fa-fw mr-2"></i>
                        <span>Dashboard</span>
                    </a>
                </li>
                <li className="nav-item active">
                    <a className="nav-link" href="/rfq">
                        <i className="fas fa-search fa-fw mr-2"></i>
                        <span>RFQ Search</span>
                    </a>
                </li>
                <hr className="sidebar-divider"/>
                {
                    this.state.user.permissions?
                    (
                        <div>
                        {
                            (
                                this.state.user.permissions.includes('EMPLOYEE_RFQ_ADMIN') ||
                                this.state.user.permissions.includes('EMPLOYEE_QUOTATION_OPTIONS_ADMIN') ||
                                this.state.user.permissions.includes('EMPLOYEE_REQUIREMENT_ADMIN') ||
                                this.state.user.permissions.includes('EMPLOYEE_PRODUCT_TYPE_ADMIN') ||
                                this.state.user.permissions.includes('EMPLOYEE_BOM_OPTIONS_ADMIN') ||
                                this.state.user.permissions.includes('EMPLOYEE_PO_OPTIONS_ADMIN') ||
                                this.state.user.permissions.includes('EMPLOYEE_ADMIN')
                            )
                            ?
                            <li className="nav-item" defaultactivekey="0">
                                <Accordion>
                                    <Accordion.Toggle as={Button} className="nav-link" variant="link" eventKey="0">
                                        <i className="fas fa-cog fa-fw mr-2"></i>
                                        {/* <FontAwesomeIcon icon="cog" className="fa-fw fas mr-2"/> */}
                                        <span>Environment Settings</span>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="0">
                                        <div className="bg-white py-2 collapse-inner  rounded">
                                            <h6 className="collapse-header">Configuration Items:</h6>
                                            {this.state.user.permissions.includes('EMPLOYEE_BOM_OPTIONS_ADMIN')?
                                                <a className="collapse-item" href="/environmentSettings/bomDefinition">Bom Definition</a>
                                                :''
                                            }
                                            {this.state.user.permissions.includes('EMPLOYEE_BOM_OPTIONS_ADMIN')?
                                                <a className="collapse-item" href="/environmentSettings/bomOutput">Bom Output</a>
                                                :''
                                            }
                                            {this.state.user.permissions.includes('EMPLOYEE_PRODUCT_TYPE_ADMIN')?
                                                <a className="collapse-item" href="/environmentSettings/productTypes">Product Types</a>
                                                :''
                                            }
                                            {this.state.user.permissions.includes('EMPLOYEE_REQUIREMENT_ADMIN')?
                                                <a className="collapse-item" href="/environmentSettings/Requirements">Requirements</a>
                                                :''
                                            }
                                            {this.state.user.permissions.includes('EMPLOYEE_RFQ_OPTIONS_ADMIN')?
                                                <a className="collapse-item" href="/environmentSettings/RFQ">RFQ</a>
                                                :''
                                            }
                                            {this.state.user.permissions.includes('EMPLOYEE_QUOTATION_OPTIONS_ADMIN')?
                                                <a className="collapse-item" href="/environmentSettings/Quotation">Quotation</a>
                                                :''
                                            }
                                            {this.state.user.permissions.includes('EMPLOYEE_PO_OPTIONS_ADMIN')?
                                                <a className="collapse-item" href="/environmentSettings/PurchasesOrder">Purchase Order</a>
                                                :''
                                            }
                                            {this.state.user.permissions.includes('EMPLOYEE_ADMIN')?
                                                <a className="collapse-item" href="/environmentSettings/server">Server</a>
                                                :''
                                            }
                                        </div>
                                    </Accordion.Collapse>
                                </Accordion>
                            </li>
                            :''}
                            {this.state.user.permissions.includes('ORGANIZATION_ADMIN')
                            ?
                            <li className="nav-item">
                                <a className="nav-link" href={"/organization/" + this.state.user.organizationdetails.name}>
                                    <i className="fas fa-building fa-fw mr-2"></i>
                                    {/* <FontAwesomeIcon icon="building" className="fa-fw fas mr-2"/> */}
                                    <span>Manage Organization</span>
                                </a>
                            </li>
                            :''
                        }
                        {
                            (this.state.user.permissions.includes('EMPLOYEE_CUSTOMER_ADMIN') || this.state.user.permissions.includes('EMPLOYEE_CUSTOMER_VIEW'))
                            ?
                            <li className="nav-item">
                                <a className="nav-link" href="/customers">
                                    <i className="fas fa-sitemap fa-fw mr-2"></i>
                                    {/* <FontAwesomeIcon icon="sitemap" className="fa-fw fas mr-2"/> */}
                                    <span>Manage Customers</span>
                                </a>
                            </li>
                            :''
                        }
                        {
                            this.state.user.permissions.includes('EMPLOYEE_VIEWER') || this.state.user.permissions.includes('ORGANIZATION_ADMIN')
                            ?
                            <li className="nav-item">
                                <a className="nav-link" href="/utilities/bomparser">
                                    <i className="fas fa-file-excel fa-fw mr-2"></i>
                                    {/* <FontAwesomeIcon icon="file-excel" className="fa-fw fas mr-2"/> */}
                                    <span>BOM Parser</span>
                                </a>
                            </li>
                            :''
                        }
                        {
                            this.state.user.permissions.includes('EMPLOYEE_PROJECT_ADMIN') || this.state.user.permissions.includes('ORGANIZATION_ADMIN')
                            ?
                            <li className="nav-item">
                                <a className="nav-link" href="/projects">
                                    <i className="fas fa-file-excel fa-fw mr-2"></i>
                                    {/* <FontAwesomeIcon icon="file-excel" className="fa-fw fas mr-2"/> */}
                                    <span>Projects</span>
                                </a>
                            </li>
                            :''
                        }
                        </div>
                    )
                    :''
                }
                
                
            </Nav>
        );
    }

}

export default UserMenu;