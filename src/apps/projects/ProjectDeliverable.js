import React from 'react';
import {Card, Button} from 'react-bootstrap';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import SDK from '../../sdk/SDK';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BomSubmit from './BomSubmit';
import FileSubmit from './FileSubmit';
import FormSubmit from './FormSubmit';


class ProjectDeliverable extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            show:false,
            project:props.project||{},
            revision:props.revision||{},
            requirement:props.requirement||{},
            deliverable:props.deliverable
        }
        this.handleRowClick = this.handleRowClick.bind(this);
    }

    componentDidMount(){
    }
    componentDidUpdate(props){
        let state = this.state;
        if(props.project !== this.props.project && this.props.projecty !== {}){
            this.setState({
                project:this.props.project
            })

        }
        if(props.revision !== this.props.revision && this.props.revision !== {}){
            this.setState({
                revision:this.props.revision
            })

        }
        if(props.requirement !== this.props.requirement && this.props.requirement !== {}){
            this.setState({
                requirement:this.props.requirement
            })

        }
        
        if(props.deliverable !== this.props.deliverable && (JSON.stringify(props.deliverable) !== JSON.stringify(this.props.deliverable))){
            this.setState({
                deliverable:this.props.deliverable
            })
        }
        // if(props.deliverable !== this.props.deliverable){
        //     this.setState({
        //         deliverable:this.props.deliverable
        //     })
        // }
        
    }
    setShow = (value)=> {
        this.setState({show:value});
    }

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

    onSaved=(data)=>{
        if(this.props.onSaved){
            this.props.onSaved(data);
        }
    }

    deliverableBody(type){
        switch(type){
            case 'bom':
                return <BomSubmit project={this.state.project} revision={this.state.revision} requirement={this.state.requirement} deliverable={this.state.deliverable} onSaved={this.onSaved}/>;
                break;
            case 'file':
                return <FileSubmit project={this.state.project} revision={this.state.revision} requirement={this.state.requirement} deliverable={this.state.deliverable} onSaved={this.onSaved}/>;
                //return "File";
            case 'form':
                return <FormSubmit project={this.state.project} revision={this.state.revision} requirement={this.state.requirement} deliverable={this.state.deliverable} onSaved={this.onSaved}/>;
                //return "Form";
            default:
                return 'NONE';
    }

    }

    render = ()=>{
        if(this.state.show){
            return (
                <Card className={this.state.show?"fullscreen":""}>
                    <Card.Header className="card-header-border">
                        
                        <h4>{this.state.requirement.display_name}</h4>
                        <h5>{this.state.requirement.description}</h5>
                        <div className="header-actions">
                            <a onClick={()=>{this.setShow(!this.state.show)}}>
                                <i class="fas fa-times"/>
                                {/* <FontAwesomeIcon icon="times"/> */}
                            </a>
                        </div>
                    </Card.Header>
                    <Card.Body style={{overflow:"auto"}}>
                        {
                            this.deliverableBody(this.state.requirement.type)
                        }
                    </Card.Body>
                    <Card.Footer> 
                        {/* <Button onClick={()=>{this.setShow(!this.state.show)}}>Close</Button> */}
                    </Card.Footer>
                </Card>
            );

        }else{
            return (
                <Card>
                    <Card.Body>
                        <h4>{this.state.requirement?this.state.requirement.display_name:''}</h4>
                        <h5>{this.state.requirement?this.state.requirement.description:''}</h5>
                        {this.state.deliverable && this.state.deliverable._id ?
                            'FOUND':
                            'NOT FOUND'
                        }
                        {/* {this.state.project.deliverables?
                            (this.state.project.deliverables.find((element)=>{
                                return element.requirement_id === x.requirement_id
                            })?
                            this.state.project.deliverables.find((element)=>{
                                return element.requirement_id === x.requirement_id
                            }).toString()
                            :
                            '')
                            :'Not Found'
                        } */}
                        {/* {this.state.requiredForRFQ?'True':'False'} */}
                            <div className="header-actions">
                            <Button size="sm" onClick={()=>{this.setShow(!this.state.show)}}>View</Button>
                            </div>
                    </Card.Body>
                </Card>
            );

        }
    }

    handleRowClick(){

    }
}

export default  ProjectDeliverable;