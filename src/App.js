import React, { Component, Suspense, lazy } from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import {Options} from './sdk/SDK';
import Auth from './auth';



const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/LoginPage'));
const InitialSetup = lazy(() => import('./pages/InitialSetup'));
const ConfirmationReset = lazy(() => import('./pages/ConfirmationReset'));
const ConfirmationRegister = lazy(() => import('./pages/ConfirmationRegister'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Logout = lazy(() => import('./pages/Logout'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Layout = lazy(() => import('./layout/Layout'));
const NotFound = lazy(() => import('./pages/404'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const Settings = lazy(() => import('./apps/user/Settings'));
const Server = lazy(() => import('./apps/environmentSettings/Server'));
const ProductTypes = lazy(() => import('./apps/environmentSettings/ProductTypes'));
const Project = lazy(() => import('./apps/projects/Project'));
const Projects = lazy(() => import('./apps/projects/Projects'));
const PurchaseOrder = lazy(() => import('./apps/quotations/PurchaseOrder'));
const PurchaseOrderOptions = lazy(() => import('./apps/environmentSettings/PurchaseOrderOptions'));
const QuotationOptions = lazy(() => import('./apps/environmentSettings/QuotationOptions'));
const Quotation = lazy(() => import('./apps/quotations/Quotation'));
const RFQ = lazy(() => import('./apps/quotations/RFQ'));
const RFQOptions = lazy(() => import('./apps/environmentSettings/RFQOptions'));
const Requirements = lazy(() => import('./apps/environmentSettings/requirements/Requirements'));
const BomDefinition = lazy(() => import('./apps/environmentSettings/bom/BomDefinition'));
const BomOutput = lazy(() => import('./apps/environmentSettings/bom/BomOutput'));
const BomParser = lazy(() => import('./apps/bom/BomParser'));
const Organization = lazy(() => import('./apps/organization/Organization'));
const Customers = lazy(() => import('./apps/customers/Customers'));
const SearchRFQ = lazy(() => import('./apps/dashboards/employee/SearchRFQ'));
//import { library } from '@fortawesome/fontawesome-svg-core'
//import { faCheckSquare, faCoffee, faLaughWink, faTachometerAlt, faCog, faBuilding, faSitemap, faFileExcel, faSearch, faCogs, faSignOutAlt, faBell, faEnvelope, faExclamationTriangle, faFileAlt, faDonate } from '@fortawesome/free-solid-svg-icons'

//library.add(faCheckSquare, faCoffee, faLaughWink, faTachometerAlt, faCog, faBuilding,faSitemap, faFileExcel, faSearch, faCogs, faSignOutAlt, faBell, faEnvelope, faExclamationTriangle, faFileAlt, faDonate);

//Auth.checkLogin();
//library.add(fab, faCheckSquare, faCoffee)
class App extends Component{
  constructor(props){
    super(props);

    this.state= {
      gotSetup:0,
      initialSetup:false
    }
  }
  
  componentDidMount(){
    Options.getSetupStatus()
    .then(data=>{
      this.setState({
        initialSetup:data.initialSetup,
        gotSetup:1
      });
    })
    .catch(err=>{
      this.setState({
        gotSetup:-1
      })
    });

    this.checkAuthenticate(1);
  }

  checkAuthenticate = (trial)=>{
    if(!Auth.checkedAuthentication){
      console.log("Not authenicated: " + trial);
      setTimeout(()=>{this.checkAuthenticate(trial+1)}, 100);
    }else{
      console.log('checked authetication:' + Auth.checkedAuthentication);
      this.setState({ state: this.state });
    }
  }

  render(){
    switch(this.state.gotSetup){
      case -1:
        
      {console.log("-1")}
        return <Suspense fallback={<div>Loading...</div>}><ErrorPage/></Suspense>
      case 0:
        return null
        {console.log("null")}
      case 1:
        if(this.state.initialSetup){
          {console.log("ABC")}
          if(!Auth.checkedAuthentication){
            return '';
          }
          return (
            <Router>
              <Suspense fallback={<div>Loading...</div>}>
              <div>
                {/* A <Switch> looks through its children <Route>s and
                    renders the first one that matches the current URL. */}
                <Switch>
                  <Route path="/login" component={Login}>
                  </Route>
                  <Route path="/logout" component={Logout}>
                  </Route>
                  <Route path="/register" component={Register}>
                  </Route>
                  
                  <Route path="/ConfirmationReset">
                    <ConfirmationReset/>
                  </Route>
                  <Route path="/forgot-password" component={ForgotPassword}>
                  </Route>
                  <Route path="/verifyEmail/:confirmation" render={(props) =>(
                    <VerifyEmail {...props}/>
                  )} />
                  <Route exact path="/">
                    {Auth.isAuthenticated === true ? 
                      (
                        <div>
                          <Layout child={Home} ></Layout>
                        </div>
                      )
                      : (
                        <Redirect to="/login"/>)}
                    
                  </Route>
                  <Route exact path="/user/settings">
                    {Auth.isAuthenticated === true ? 
                      (
                        <div>
                          <Layout child={Settings} ></Layout>
                        </div>
                      )
                      : (
                        <Redirect to="/login"/>)}
                  </Route>
                  <Route exact path="/environmentSettings/server">
                    {Auth.isAuthenticated === true && Auth.userInfo.permissions.includes("EMPLOYEE_ADMIN") ? 
                      (
                        <div>
                          <Layout child={Server} ></Layout>
                        </div>
                      )
                      : (
                        <Redirect to="/login"/>)}
                    
                  </Route>
                  <Route exact path="/environmentSettings/productTypes">
                    {Auth.isAuthenticated === true && Auth.userInfo.permissions.includes("EMPLOYEE_ADMIN") ? 
                      (
                        <div>
                          <Layout child={ProductTypes} ></Layout>
                        </div>
                      )
                      : (
                        <Redirect to="/login"/>)}
                  </Route>
                  <Route exact path="/environmentSettings/requirements">
                    {Auth.isAuthenticated === true && Auth.userInfo.permissions.includes("EMPLOYEE_ADMIN") ? 
                      (
                        <div>
                          <Layout child={Requirements} ></Layout>
                        </div>
                      )
                      : (
                        <Redirect to="/login"/>)}
                  </Route>
                  <Route exact path="/environmentSettings/bomDefinition">
                    {Auth.isAuthenticated === true && Auth.userInfo.permissions.includes("EMPLOYEE_ADMIN") ? 
                      (
                        <div>
                          <Layout child={BomDefinition} ></Layout>
                        </div>
                      )
                      : (
                        <Redirect to="/login"/>)}
                  </Route>
                  <Route exact path="/environmentSettings/bomOutput">
                    {Auth.isAuthenticated === true && Auth.userInfo.permissions.includes("EMPLOYEE_ADMIN") ? 
                      (
                        <div>
                          <Layout child={BomOutput} ></Layout>
                        </div>
                      )
                      : (
                        <Redirect to="/login"/>)}
                  </Route>
                  <Route exact path="/environmentSettings/rfq">
                    {Auth.isAuthenticated === true && Auth.userInfo.permissions.includes("EMPLOYEE_ADMIN") ? 
                      (
                        <div>
                          <Layout child={RFQOptions} ></Layout>
                        </div>
                      )
                      : (
                        <Redirect to="/login"/>)}
                  </Route>
                  <Route exact path="/environmentSettings/quotation">
                    {Auth.isAuthenticated === true && Auth.userInfo.permissions.includes("EMPLOYEE_ADMIN") ? 
                      (
                        <div>
                          <Layout child={QuotationOptions} ></Layout>
                        </div>
                      )
                      : (
                        <Redirect to="/login"/>)}
                  </Route>
                  <Route exact path="/environmentSettings/PurchasesOrder">
                    {Auth.isAuthenticated === true && Auth.userInfo.permissions.includes("EMPLOYEE_ADMIN") ? 
                      (
                        <div>
                          <Layout child={PurchaseOrderOptions} ></Layout>
                        </div>
                      )
                      : (
                        <Redirect to="/login"/>)}
                  </Route>
                  <Route path="/organization/:organization_name"  render={(props) => (
                    Auth.isAuthenticated === true && 
                    (Auth.userInfo.permissions.includes("EMPLOYEE_ADMIN") || 
                    (Auth.userInfo.permissions.includes("ORGANIZATION_ADMIN") && Auth.userInfo.organizationdetails.name === props.match.params.organization_name)) ? 
                    (
                      <div>
                        <Layout child={Organization} {...props} ></Layout>
                      </div>
                    )
                    : (
                      <Redirect to="/login"/>)
                  )} />
                  {/* <Route exact  path="/customers" render={(props)=>{return <Layout {...props} body={(props)=>{return (<Suspense fallback={<div>Loading...</div>}><Customers {...props}/></Suspense>)} }/>}} /> */}
                  <Route path="/customers"  render={(props) => (
                    Auth.isAuthenticated === true && (Auth.userInfo.permissions.includes("ORGANIZATION_ADMIN") || Auth.userInfo.permissions.includes("EMPLOYEE_VIEWER")) ? 
                    (
                      <div>
                        <Layout child={Customers} {...props} ></Layout>
                      </div>
                    )
                    : (
                      <Redirect to="/login"/>)
                  )} />
                  <Route path="/utilities/bomparser"  render={(props) => (
                    Auth.isAuthenticated === true && (Auth.userInfo.permissions.includes("ORGANIZATION_ADMIN") || Auth.userInfo.permissions.includes("EMPLOYEE_VIEWER")) ? 
                    (
                      <div>
                        <Layout child={BomParser} {...props} ></Layout>
                      </div>
                    )
                    : (
                      <Redirect to="/login"/>)
                  )} />
                  <Route path="/project/:id"  render={(props) => (
                    Auth.isAuthenticated === true ?
                    (
                      <div>
                        <Layout child={Project} {...props} ></Layout>
                      </div>
                    )
                    : (
                      <Redirect to="/login"/>)
                  )} />
                  <Route path="/projects"  render={(props) => (
                    Auth.isAuthenticated === true ? 
                    (
                      <div>
                        <Layout child={Projects} {...props} ></Layout>
                      </div>
                    )
                    : (
                      <Redirect to="/login"/>)
                  )} />
                  <Route path="/rfq/:rfq_number"  render={(props) => (
                    Auth.isAuthenticated === true 
                    // && (Auth.userInfo.permissions.includes("EMPLOYEE_ADMIN")
                    ) ? 
                    (
                      <div>
                        <Layout child={RFQ} {...props} ></Layout>
                      </div>
                    )
                    : (
                      <Redirect to="/login"/>)
                  } />
                  <Route path="/rfq"  render={(props) => (
                    Auth.isAuthenticated === true 
                    // && (Auth.userInfo.permissions.includes("EMPLOYEE_ADMIN")
                    ) ? 
                    (
                      <div>
                        <Layout child={SearchRFQ} {...props} ></Layout>
                      </div>
                    )
                    : (
                      <Redirect to="/login"/>)
                  } />
                  <Route path="/quotation/:quotationNumber"  render={(props) => (
                    Auth.isAuthenticated === true && 
                    (Auth.userInfo.permissions.includes("EMPLOYEE_ADMIN") || Auth.userInfo.permissions.includes("EMPLOYEE_VIEWER")) ? 
                    (
                      <div>
                        <Layout child={Quotation} {...props} ></Layout>
                      </div>
                    )
                    : (
                      <Redirect to="/login"/>)
                  )} />
                  <Route path="/purchaseOrder/:purchaseOrderNumber"  render={(props) => (
                    Auth.isAuthenticated === true && 
                    (Auth.userInfo.permissions.includes("EMPLOYEE_ADMIN") || Auth.userInfo.permissions.includes("EMPLOYEE_VIEWER")) ? 
                    (
                      <div>
                        <Layout child={PurchaseOrder} {...props} ></Layout>
                      </div>
                    )
                    : (
                      <Redirect to="/login"/>)
                  )} />
                  <Route path="/InitialSetup">
                    <NotFound></NotFound>
                  </Route>
                  <Route>
                    <NotFound></NotFound>
                  </Route>
                </Switch>
              </div>
              </Suspense>
              
            </Router>
          )
        }else{
          {console.log("BCD")}
          return (
            <Router>
              <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                  <Route path="/InitialSetup">
                    <InitialSetup/>
                  </Route>
                  <Route path="/ConfirmationRegister">
                    <ConfirmationRegister/>
                  </Route>
                  <Route path="/verifyEmail/:confirmation" render={(props) =>(
                    <VerifyEmail {...props}/>
                  )} />
                  <Route>
                    <Redirect to="/InitialSetup"/>
                  </Route>
                </Switch>
              </Suspense>
            </Router>

          )
        }
      default:
        {console.log("FAIL")}
        return <Suspense fallback={<div>Loading...</div>}><ErrorPage/></Suspense>
    }
  }
}

export default App;
