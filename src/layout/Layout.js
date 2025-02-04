import React from 'react';
import {
    NavDropdown
} from 'react-bootstrap'
import {Redirect} from 'react-router-dom';

import empty from '../img/empty.png';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import UserMenu from './UserMenu';
import Search from './Search';
import Notifications from './Notifications';
import Messages from './Messages';

import SDK from '../sdk/SDK';
// import {Users} from '../sdk/SDK';

class Layout extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            child: props.child,
            menu: false,
            loading:'initial',
            siteTitle: 'BPS',
            user:{},
            redirect:null
        }
        this.toggleMenu = this.toggleMenu.bind(this);

        this.userMenu = React.createRef();
        //this.pullMyData = this.pullMyData.bind(this);
    }

    componentDidMount(){
        this.getInfo();

        // Users.getMyInfo()
        // .then(data=>{
        //     if(data){
        //         this.setState({
        //             loading:'done',
        //             user:data
        //         });
        //         this.refs.userMenu.setState({
        //             user:data
        //         });
        //     }else{
        //         this.setState({
        //             redirect:'/login'
        //         })
        //     }
            
        // })
        // .catch(err=>{
        //     console.log(err);
        //     this.setState({
        //         redirect:'/login'
        //     })
        // })


        //this.pullMyData();
    }
    getInfo = async()=>{
        try{
            let data = await SDK.Users.getMyInfo();
            if(data){
                this.setState({
                    loading:'done',
                    user:data
                });
                this.userMenu.current.setState({
                    user:data
                });
            }else{
                this.setState({
                    redirect:'/login'
                })
            }
        }catch(err){
            console.error(err);
            this.setState({
                redirect:'/login'
            })
        }
    }

    toggleMenu(){
        this.setState({ menu: !this.state.menu })
      }
    render() {
        if(this.state.redirect){
            return <Redirect to={this.state.redirect}/>
        }else{
            return (
                <div>
                    <div id="wrapper">
                        <UserMenu key={this.state.user.permissions} ref={this.userMenu} user={this.state.user} siteTitle={this.state.siteTitle}/>
                        <div id="content-wrapper" className="d-flex flex-column">
        
                            <div id="content">
        
                                <nav className="navbar navbar-expand navbar-light topbar mb-4 static-top shadow bg-background">
        
                                    <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                                        <i className="fa fa-bars"></i>
                                    </button>
                                    <Search user={this.state.user} siteTitle={this.state.siteTitle}/>
        
                                    <ul className="navbar-nav ml-auto">
        
                                        <li className="nav-item dropdown no-arrow d-sm-none">
                                            <a className="nav-link dropdown-toggle" href="/" id="searchDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fas fa-search fa-fw"></i>
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in" aria-labelledby="searchDropdown">
                                                <form className="form-inline mr-auto w-100 navbar-search">
                                                <div className="input-group">
                                                    <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2"/>
                                                    <div className="input-group-append">
                                                    <button className="btn btn-primary" type="button">
                                                        <i className="fas fa-search fa-sm"></i>
                                                    </button>
                                                    </div>
                                                </div>
                                                </form>
                                            </div>
                                        </li>
                                        
                                        <Notifications key={this.state.user.notifications} ref="notifications" user={this.state.user} siteTitle={this.state.siteTitle}/>
                                        <Messages key={this.state.user.messages} ref="messages" user={this.state.user} siteTitle={this.state.siteTitle}/>
        
                                        <div className="topbar-divider d-none d-sm-block"></div>
        
                                        <NavDropdown className="no-arrow" title={
                                            <div>
                                                <span className="mr-2 d-none d-lg-inline text-gray-600 small" id="userinfo_name">{(this.state.user.first_name||'') + ' ' + (this.state.user.last_name||'')}</span>
                                                <img id="profile_pic" className="img-profile rounded-circle" src={empty} alt="profile"/>
                                            </div>
                                            } 
                                            aria-labelledby="userDropdown">
                                            
                                            <NavDropdown.Item href="/user/settings">
                                                <i class="fas fa-cogs fa-fw mr-2 text-gray-400"/>
                                                {/* <FontAwesomeIcon icon="cogs" className="fa-fw mr-2 text-gray-400"/> */}
                                                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                                Settings
                                            </NavDropdown.Item>
                                            <div className="dropdown-divider"/>
                                            <NavDropdown.Item href="/logout">
                                                <i class="fas fa-sign-out-alt fa-fw mr-2 text-gray-400"/>
                                                {/* <FontAwesomeIcon icon="sign-out-alt" className="fa-fw mr-2 text-gray-400"/> */}
                                                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                                Logout
                                            </NavDropdown.Item>
                                        </NavDropdown>
        
                                    </ul>
        
                                </nav>
                                <div className="content">
                                    {<this.state.child {...this.props} />}
                                </div>
        
                                <footer className="sticky-footer bg-white bg-background">
                                    <div className="container my-auto">
                                        <div className="copyright text-center my-auto">
                                            <span>Copyright &copy; Bema Electronics {new Date().getFullYear()}</span>
                                        </div>
                                    </div>
                                </footer>
        
                            </div>
                        </div>
                    </div>
                    <a className="scroll-to-top rounded" href="#page-top">
                        <i className="fas fa-angle-up"></i>
                    </a>
                    <div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                            <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">�</span>
                            </button>
                            </div>
                            <div className="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                            <div className="modal-footer">
                            <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                            <a className="btn btn-primary" href="#{url}/logout">Logout</a>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                
            );
        }
        }
      
        

}

export default Layout;