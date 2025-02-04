import React from 'react';
import {Card, Modal, Button, Form, Col} from 'react-bootstrap';
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
            organization_name:props.organization_name,
            organizationInfo:{},
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
        this.getOrganizationInfo();
        this.getProductTypes();
        this.refreshProjects();
    }
    componentDidUpdate(props){
        if(props.organization_name !== this.props.organization_name){
            this.setState({
                organization_name:this.props.organization_name
            },()=>{
                this.getOrganizationInfo();
                this.refreshProjects();
            })
        }
    }
    getOrganizationInfo = async()=>{
        try{
            let organizationInfo = await SDK.Organizations.getOrganizationInfo(this.state.organization_name);
            this.setState({
                organizationInfo:organizationInfo
            },()=>{
                // alert(JSON.stringify(this.state.organizationInfo));
            })
        }catch(err){
            console.log(err);
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
    refreshProjects = async ()=>{
        if(this.state.organization_name){
            try{
                let data = await SDK.Organizations.getOrganizationProjects(this.state.organization_name);
                this.setState({
                    projects:data
                })
            }catch(err){
                console.error(err);
            }
        }
    }
    
    refreshProjects = ()=>{
        let match = {q:'organizationInfo.name="' + this.state.organization_name + '"'};
        if(!this.state.showInactive){
            match.q += ',inactive_date = NULL'
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
    handleClose = () => this.setShow(false);
    handleShow = () => {
        this.setState({
            newProject:{
                organization:this.state.organizationInfo._id,
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
        SDK.Projects.saveNewProject(this.state.newProject)
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
                productType: x.productType.product_name,
                organizationInfo:x.organizationInfo,
                latestRevision:latestRevision?latestRevision.revision:'',
                description:latestRevision?latestRevision.description:'',
                create_date: latestRevision?latestRevision.create_date:x.create_date,
                inactive_date: x.inactive_date,
                actions: '',
            }

        }):[];
        let columns = [
            {key:'productType', name:'Product Type', resizable:false},
            {key:'itemnumber', name:'Assembly Number', resizable:false, formatter:({value,row})=>{
                return <a href={'/project/'+row._id}>{value}</a>
            }},
            {key:'organizationInfo', name:'Customer', resizable:false, formatter:({value,row})=>{
                return value.name
            }},
            {key:'latestRevision', name:'Latest Revision', resizable:false},
            {key:'description', name:'Description', resizable:false},
            {key:'create_date', name:'Creation Date', resizable:false},
            {key:'inactive_date', name:'Inactive Date', resizable:false},
        ]

        return (
            <div >
                <Card>
                    <Card.Header>
                        Projects
                        <div className="header-actions">
                            <a onClick={this.handleShow} title="New Project">
                                <i class="fas fa-plus"/>
                                {/* <FontAwesomeIcon icon="plus"/> */}
                            </a>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        
                        <ReactGrid
                            ref={this.projectTableRef}
                            resizeable={false}
                            columns={columns}
                            rowGetter={i=> data?data[i]:{}}
                            rowsCount={data?data.length:0} 
                            sortable={true}
                            // onRowClick={this.handleRowClick}
                            
                            buttons={[
                                <Col xs="auto" style={{display:"inline-block"}}><Form.Check label="Show Inactive" checked={this.state.showInactive} onClick={this.toggleShowInactive}></Form.Check></Col>
                            ]}
                        />
                    </Card.Body>
                </Card>
                
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Project</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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