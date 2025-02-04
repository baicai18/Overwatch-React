import React from 'react';
import {Form, Col, Card,Row, Dropdown, ListGroup, CardDeck} from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import DeliverableForm from './DeliverableForm';
// import DraggableList from '../DraggableList';
import auth from '../../../auth';
import moment from 'moment'
import DraggableList from '../DraggableList';

class NotificationAction extends React.Component{

    constructor(props){
        super(props);
        this.lastKey=0;

        this.state = {
            index:props.index,
            data:props.data||{},
        }

    }

    componentDidUpdate(props){
        if(props.data !== this.props.data){
            this.setState({
                data:this.props.data
            })
        } 
    }

    operatorChanged = (e)=>{
        let value = e.target.value;
        let data = this.state.data;
        data.operator = value;

        switch(value){
            case '':
                if(!(typeof data.value === 'string' || data.value instanceof String)){
                    data.value = ''
                }
                break;
            case '=':
                if(!(typeof data.value === 'string' || data.value instanceof String)){
                    data.value = ''
                }
                break;
            case '!=':
                if(!(typeof data.value === 'string' || data.value instanceof String)){
                    data.value = ''
                }
                break;
            case 'IN':
                if(!Array.isArray(data.value)){
                    data.value = [];
                }
                break;
            case 'NOTIN':
                if(!Array.isArray(data.value)){
                    data.value = [];
                }
                break;
            case 'AND':
                if((typeof data.value === 'string' || data.value instanceof String)||Array.isArray(data.value)){
                    data.value = []
                }
                break;
            case 'OR':
                if((typeof data.value === 'string' || data.value instanceof String)||Array.isArray(data.value)){
                    data.value = []
                }
                break;
        }

        // <option value=""></option>
        // <option value="=">=</option>
        // <option value="!=">!=</option>
        // <option value="IN">IN</option>
        // <option value="NOTIN">NOT IN</option>
        // <option value="AND">AND</option>
        // <option value="OR">OR</option>

        this.setState({
            data:data
        },()=>{
            if(this.props.onDataChanged){
                this.props.onDataChanged(this.state.index,this.state.data);
            }
        })
        
    }

    dataChanged = (e)=>{
        var data = this.state.data;
        var target = e.currentTarget;
        let value = target.type === 'checkbox' ? 
                        target.checked : 
                    target.type === 'number' ?
                        Number(target.value) :
                    target.value;
        data[e.currentTarget.name] = value;
        this.setState({
            data:data
        },()=>{
            if(this.props.onDataChanged){
                this.props.onDataChanged(this.state.index,this.state.data);
            }
        })
        

    }

    
    removeSelectValue = (value,index)=>{
        let data = this.state.data;
        data.target.splice(index,1);
        this.setState({
            data:data
        },()=>{
            if(this.props.onDataChanged){
                this.props.onDataChanged(this.state.index,this.state.data);
            }
        })
    }

    CustomMenu = React.forwardRef(
        ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
            // const [value, setValue] = useState('');
        
            return (
                <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
                >
                <Form.Control
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Add value"
                    onKeyPress={(e)=>{if(e.key  === 'Enter')this.newSelectValue(e)}}
                    //value={value}
                />
                </div>
            );
        },
    )

    newSelectValue = (event)=>{
        let value = event.currentTarget.value;
        let data = this.state.data;
        if(data.value){
            if(data.value.includes(value)){
                alert("Value already exists");
                return;
            }else{
                data.value.push(value);
                event.currentTarget.value='';
            }
        }else{
            data.value = [value];
            event.currentTarget.value='';
        }
        this.setState({
            data:data
        },()=>{
            if(this.props.onDataChanged){
                this.props.onDataChanged(this.state.index,this.state.data);
            }
        });

    }
    onListChanged = (list)=>{
        let data = this.state.data;
        data.value = list;
        this.setState({
            data:data
        }, ()=>{
            if(this.props.onDataChanged){
                this.props.onDataChanged(this.state.index,this.state.data);
            }

        })
    }

    deleteCondition = ()=>{
        if(this.props.onDelete){
            this.props.onDelete(this.state.index);
        }
    }
    deletePart = (index)=>{
        let data = this.state.data;
        data.value.splice(index,1);
        this.setState({
            data:data
        },()=>{
            if(this.props.onDataChanged){
                this.props.onDataChanged(this.state.index,this.state.data);
            }
        })
    }
    newPart = ()=>{
        let data = this.state.data;
        data.value.push({});
        this.setState({
            data:data
        },()=>{
            if(this.props.onDataChanged){
                this.props.onDataChanged(this.state.index,this.state.data);
            }
        })
    }

    targetChanged = (e,index)=>{
        var data = this.state.data;
        var target = e.currentTarget;
        let value = target.type === 'checkbox' ? 
                        target.checked : 
                    target.type === 'number' ?
                        Number(target.value) :
                    target.value;
        data.target[index][e.currentTarget.name] = value;
        if(e.currentTarget.name === 'type'){
            data.target[index].value = ''
        }
        this.setState({
            data:data
        },()=>{
            if(this.props.onDataChanged){
                this.props.onDataChanged(this.state.index,this.state.data);
            }
        })
    }

    render(){
        return (
            <Card className="mb-1">
                <Card.Header>
                    <div className="header-actions">
                        <a onClick={this.deleteCondition}>
                            <i class="fas fa-xmark"/>
                            {/* <FontAwesomeIcon icon="plus"/> */}
                        </a>
                    </div>

                </Card.Header>
                <Card.Body>
                    <Form.Row>
                        <Form.Group className="col-md-2">
                            <Form.Label>Type</Form.Label>
                            <Form.Control as={'select'} value={this.state.data.type} name="type" onChange={this.dataChanged}>
                                <option value=""></option>
                                <option value="email">Email</option>
                                <option value="notification">Notification</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="col-md-10">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control value={this.state.data.subject} name={'subject'} onChange={this.dataChanged}/>
                        </Form.Group>
                        <Form.Group className="col-md-12">
                            <Form.Label>Message</Form.Label>
                            <Form.Control as="textarea" rows="6" value={this.state.data.message} name={'message'} onChange={this.dataChanged}/>
                        </Form.Group>

                    </Form.Row>
                    <Card>
                        <Card.Header>
                            Target
                            <div className="header-actions">
                            <Dropdown>
                                <Dropdown.Toggle as={"a"} id="dropdown-custom-components">
                                <i class="fas fa-plus"/>
                                {/* <FontAwesomeIcon icon="plus"/> */}
                                </Dropdown.Toggle>

                                <Dropdown.Menu as={this.CustomMenu}>
                                </Dropdown.Menu>
                            </Dropdown>
                                {/* <a onClick={this.newSelectValue}>
                                    <FontAwesomeIcon icon="plus"/>
                                </a> */}
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <DraggableList 
                            key={this.state.data.target} 
                            keyName={"NULL"}
                            list={this.state.data.target} 
                            onListChanged={this.onListChanged}
                            mapFunction={(x,index)=>{
                                return <ListGroup.Item>
                                            {/* {x} */}
                                            <Card.Body>
                                            <Form.Row>
                                                <Form.Group className="col-md-2">
                                                    <Form.Label>Type</Form.Label>
                                                    <Form.Control as="select" name="type" value={x.type} onChange={(e)=>{this.targetChanged(e,index)}}>
                                                        <option></option>
                                                        <option value="user">User</option>
                                                        <option value="role">Role</option>
                                                    </Form.Control>
                                                </Form.Group>
                                                <Form.Group className="col-md-6">
                                                    <Form.Label>Value</Form.Label>
                                                    <Form.Control as="select" name="value" value={x.value} onChange={(e)=>{this.targetChanged(e,index)}}>
                                                        <option></option>
                                                        {
                                                            x.type === 'user'?
                                                            (this.props.users?this.props.users.map((user)=>{
                                                                return <option value={user.email}>{`${user.first_name} ${user.last_name} - ${user.email}`}</option>
                                                            }):null):
                                                            (this.props.roles?this.props.roles.map((role)=>{
                                                                return <option value={role.role_code}>{role.description}</option>
                                                            }):null)
                                                        }
                                                    </Form.Control>
                                                </Form.Group>
                                            </Form.Row>

                                            </Card.Body>
                                            <div className="header-actions">
                                                <a onClick={()=>{this.removeSelectValue(x,index)}}>
                                                    <i class="fas fa-times"/>
                                                </a>
                                            </div>
                                        </ListGroup.Item>
                                }
                            }/>
                        </Card.Body>
                    </Card>
                    
                    
                </Card.Body>
            </Card>
        )
        
    }
    
}

export default  NotificationAction;