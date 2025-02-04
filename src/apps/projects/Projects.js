import React from 'react';
import {Card, Modal, Button, Form, Col} from 'react-bootstrap';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import SDK from '../../sdk/SDK';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Auth from '../../auth';
import ReactGrid from '../tools/ReactGrid/ReactGrid';
import ConfirmDialog from '../tools/ConfirmDialog';


class Projects extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            projects:[],
            show:false,
            newProject:{
                itemnumber:'',
                revision:'',
                description:'',
            },
            validated:false,
            showInactive:false
        }
        this.projectTableRef = React.createRef();
        this.confirmDialog = React.createRef();
    }

    componentDidMount(){
        this.getProductTypes();
        this.refreshProjects();
        this.refreshOrganizations();

        if(Auth.userInfo.permissions.includes("EMPLOYEE_PROJECT_ADMIN")){
            this.setState({
                organization:Auth.userInfo.organization
            })
        }
    }

    getProductTypes = ()=>{
        SDK.ProductTypes.getProductTypes()
        .then((data)=>{
            this.setState({
                productTypes:data
            })
        })
    }
    refreshOrganizations = ()=>{
        SDK.Organizations.findOrganizations({q:`inactive_date=NULL`})
        .then((data)=>{
            this.setState({
                organizations:data
            })
        })
    }
    refreshProjects = ()=>{
        let match = {q:''};
        if(!this.state.showInactive){
            match.q += 'inactive_date = NULL'
        }
        SDK.Projects.findProjects(match)
        .then((data)=>{
            this.setState({
                projects:data
            })
        })
    }
    setActions = (cell, row)=>{
        return '<a className="btn btn-sm btn-secondary text-white" href="/project/' + row._id + '">OPEN</button>'
    }
    handleClose = () => {
        this.setShow(false);
        this.setState({
            organization:Auth.userInfo.organization
        })
    }
    handleShow = () => {
        this.setState({
            newProject:{
                organization:Auth.userInfo.organization,
                itemnumber:'',
                revision:'',
                description:''
            },
            validated:false
        })
        this.setShow(true);
    }
    setShow = (value)=> this.setState({show:value});

    newProjectFieldChanged = (e) =>{
        var newProject = this.state.newProject;
        var target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        newProject[e.currentTarget.name] = value;

        this.setState({
            newProject:newProject
        })
            
            
    }
    trySave = ()=>{
        let data = this.state.newProject
        if(this.state.organization){
            data.organization=this.state.organization
        }
        SDK.Projects.saveNewProject(data)
        .then(data=>{
            this.refreshProjects();
            this.setState({
                show:false
            })
        })
        .catch(err=>{
            alert(err);
        })

    }

    handleSubmit = (event)=>{
        const form = event.currentTarget;
        if (form.checkValidity() === false) {

        }else{
            this.trySave();
        }
        this.setState({
            validated:true
        })
        event.preventDefault();
        event.stopPropagation();
    }

    tryDeleteProjects = async()=>{
        let rows = this.projectTableRef.current.getSelectedRows();
        if(rows.length > 0){
            this.confirmDialog.current.showDialog('Confirm delete', 'Warning! Deleted project data cannot be restored! Are you sure you want to proceed?', this.deleteProjects);
        
        }
        
    }

    deleteProjects = async()=>{
        try{
            let rows = this.projectTableRef.current.getSelectedRows();
            for(let x = 0; x < rows.length; x++){
                try{
                    await SDK.Projects.deleteProject(rows[x].row._id);
                }catch(err){
                    console.error(err);
                    throw("Error deleting project: " + rows[x].row.itemnumber);
                }
            }
            
            this.refreshProjects();
        }catch(err){
            console.error(err);
            alert(err);
            this.refreshProjects();
        }
    }
    toggleShowInactive = ()=>{
        this.setState({
            showInactive: !this.state.showInactive
        },()=>{
            this.refreshProjects();
        })
    }

    render = ()=>{
        let data = this.state.projects?this.state.projects.map(x=>{
            let latestRevision = null;
            for(let y = 0; y < x.revisions.length; y++){
                if(x.revisions[y].latest === true){
                    latestRevision = x.revisions[y]
                }
            }
            return {
                _id:x._id,
                itemnumber:x.itemnumber,
                customer:x.organizationInfo.name,
                productType: x.productType.product_name,
                latestRevision:latestRevision?latestRevision.revision:'',
                description:latestRevision?latestRevision.description:'',
                create_date: latestRevision?latestRevision.create_date:x.create_date,
                inactive_date:x.inactive_date,
                actions: '',
            }

        }):[];
        let columns = [
            {key:'productType', name:'Product Type', resizable:false},
            {key:'customer', name:'Customer', resizable:false, 
            formatter:({value,row})=>{
                return <a href={'/organization/'+ value}>{value}</a>;
            },exportFormatter:({value,row})=>{
               return value; 
            }},
            {key:'itemnumber', name:'Assembly Number', resizable:false, formatter:({value,row})=>{
                return <a href={'/project/'+row._id}>{value}</a>
            },exportFormatter:({value,row})=>{
                return value; 
            }},
            {key:'latestRevision', name:'Latest Revision', resizable:false},
            {key:'description', name:'Description', resizable:false},
            {key:'create_date', name:'Creation Date', resizable:false},
            {key:'inactive_date', name:'Inactive Date', resizable:false},
        ]

        return (
            <div className="container-fluid">
                <h1 className="h3 mb-2 text-gray-800">Projects</h1>
                <p className="mb-4">
                    View all projets
                </p>
                <Card className="shadow mb-4">
                    <Card.Header className="card-header-border">
                    Projects
                        <div className="header-actions">
                            <a onClick={this.handleShow} title="New Project">
                                <i class="fas fa-plus"/>
                                {/* <FontAwesomeIcon icon="plus"/> */}
                            </a>
                        </div>
                    </Card.Header>
                    <div className="card-body">
                        {/* <ReactGrid
                                columns={cols}
                                rowGetter={i=> data?data[i]:{}}
                                rowsCount={this.state.projects?this.state.projects.length:0} 
                                
                        /> */}
                        
                        <ReactGrid
                            ref={this.projectTableRef}
                            resizeable={false}
                            columns={columns}
                            rowGetter={i=> data?data[i]:{}}
                            rowsCount={data?data.length:0} 
                            sortable={true}
                            buttons={[
                                <Col xs="auto" style={{display:"inline-block"}}><Form.Check label="Show Inactive" checked={this.state.showInactive} onClick={this.toggleShowInactive}></Form.Check></Col>
                            ]}
                            // onRowClick={this.handleRowClick}
                            
                            // buttons={[
                            //     <Button size="sm" variant="danger" onClick={()=>{this.tryDeleteProjects()}}><i class="fas fa-trash"></i></Button>
                            // ]}
                            
                        />
                    </div>
                </Card>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Project</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            {
                                Auth.userInfo.permissions.includes('EMPLOYEE_PROJECT_ADMIN') ?
                                <Form.Group>
                                    <Form.Label>
                                        Organization
                                    </Form.Label>
                                    <Form.Control as="select" name="organization" ref={this.organizationList} onChange={(e)=>{this.setState({organization:e.target.value})}} value={this.state.organization} required>
                                        <option></option>
                                        {
                                            this.state.organizations?
                                            this.state.organizations.map((x,index)=>{
                                                return <option key={x._id} value={x._id}>{x.name}</option>
                                            })
                                            :''
                                        }
                                    </Form.Control>
                                </Form.Group>
                                :null
                            }
                            
                            <Form.Group>
                                <Form.Label>
                                    Product Type
                                </Form.Label>
                                <Form.Control as="select" name="product_type" onChange={this.newProjectFieldChanged} required>
                                    <option></option>
                                    {
                                        this.state.productTypes?
                                        this.state.productTypes.map((x,index)=>{
                                            return <option key={x._id} value={x._id}>{x.product_name}</option>
                                        })
                                        :''
                                    }
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>
                                    Assembly Number
                                </Form.Label>
                                <Form.Control type="text" name="itemnumber" onChange={this.newProjectFieldChanged} required></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>
                                    Revision
                                </Form.Label>
                                <Form.Control type="text" name="revision" onChange={this.newProjectFieldChanged} required></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>
                                    Description
                                </Form.Label>
                                <Form.Control type="text" name="description" onChange={this.newProjectFieldChanged} required></Form.Control>
                            </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Modal.Footer>
                        </Form>
                </Modal>
                <ConfirmDialog ref={this.confirmDialog}/>
            </div>
        );
    }
    handleRowClick = ()=>{

    }
}

export default  Projects;