import React from 'react';
import {Form, Col, Card,Row, Dropdown, ListGroup, CardDeck} from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import DeliverableForm from './DeliverableForm';
// import DraggableList from '../DraggableList';
import auth from '../../../auth';
import moment from 'moment'
import DraggableList from '../DraggableList';

class NotificationCondition extends React.Component{

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
        data.value.splice(index,1);
        this.setState({
            data:data
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
                        {
                            ['=','!=','IN','NOTIN'].includes(this.state.data.operator||'')?
                            <Form.Group className="col-md-5">
                                <Form.Label>Field</Form.Label>
                                <Form.Control value={this.state.data.field} name={'field'} onChange={this.dataChanged}/>
                            </Form.Group>
                            :null
                        }
                        <Form.Group className="col-md-2">
                            <Form.Label>Operator</Form.Label>
                            <Form.Control as={'select'} value={this.state.data.operator} onChange={this.operatorChanged}>
                                <option value=""></option>
                                <option value="=">=</option>
                                <option value="!=">!=</option>
                                <option value="IN">IN</option>
                                <option value="NOTIN">NOT IN</option>
                                <option value="AND">AND</option>
                                <option value="OR">OR</option>
                            </Form.Control>
                        </Form.Group>
                        {
                            ['=','!='].includes(this.state.data.operator||'')?
                            <Form.Group className="col-md-5">
                                <Form.Label>Value</Form.Label>
                                <Form.Control value={this.state.data.value} name={'value'} onChange={this.dataChanged}/>
                            </Form.Group>
                            :null
                        }

                    </Form.Row>
                    {
                        ['=','!='].includes(this.state.data.operator||'')?
                        null
                        :<Form.Group>
                        <Form.Label>
                            {
                                this.state.data?
                                    (this.state.data.operator === 'AND' || this.state.data.operator === 'OR')?
                                    null
                                    :(this.state.data.operator === '=' || this.state.data.operator === '!=')?
                                    'Value'
                                    :null
                                :null
                            }
                        </Form.Label>
                            {
                                this.state.data?
                                    (this.state.data.operator === 'AND' || this.state.data.operator === 'OR')?
                                    <Card>
                                        <Card.Header>
                                            Parts 
                                            <div className="header-actions">
                                                <a onClick={this.newPart}>
                                                    <i class="fas fa-plus ml-2"/>
                                                    {/* <FontAwesomeIcon icon="plus"/> */}
                                                </a>
                                            </div>
                                        </Card.Header>
                                        <Card.Body>
                                            {
                                                this.state.data.value.map((value,index)=>{
                                                    return <NotificationCondition data={value} index={index} onDelete={this.deletePart}/>
                                                })

                                            }
                                        </Card.Body>
                                    </Card>
                                    :(this.state.data.operator === '=' || this.state.data.operator === '!=')?
                                    <Form.Control value={this.state.data.value} name={'value'} onChange={this.dataChanged}/>
                                    :<Card>
                                        <Card.Header>
                                            Values
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
                                            key={this.state.data.value} 
                                            keyName={"NULL"}
                                            list={this.state.data.value} 
                                            onListChanged={this.onListChanged}
                                            mapFunction={(x,index)=>{
                                                return <ListGroup.Item>
                                                            {x}
                                                            <div className="header-actions">
                                                                <a onClick={()=>{this.removeSelectValue(x,index)}}>
                                                                    <i class="fas fa-times"/>
                                                                    {/* <FontAwesomeIcon icon="times"/> */}
                                                                </a>
                                                            </div>
                                                        </ListGroup.Item>
                                                }
                                            }/>
                                        </Card.Body>
                                    </Card>
                                :null
                            }
                    </Form.Group>
                    }
                    
                </Card.Body>
            </Card>
        )
        
    }
    
}

export default  NotificationCondition;