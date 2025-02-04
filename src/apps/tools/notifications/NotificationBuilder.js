import React from 'react';
import {Card, Col, Row, Form} from 'react-bootstrap';
import NotificationCondition from './NotificationCondition';
import NotificationAction from './NotificationAction';
import SDK from '../../../sdk/SDK';

class NotificationBuilder extends React.Component { 
    constructor(props){
        super(props);
        this.lastKey=0;

        let formData = props.formData || {}
        if(formData.fields){
            formData.fields.forEach((x)=>{
                x.key = this.lastKey++;
            })

        }

        this.state={
            type:props.type,
            data:props.data || {
                type:props.type,
                code:props.code,
                organization:props.organization,
                description:'',
                status:'Requested',
                conditions:[
                    {
                        field:'',
                        operator:'OR',
                        value:[
                            {
                                field:'organization_name',
                                operator:'=',
                                value:'TEST',
                            },
                            {
                                field:'organization_name',
                                operator:'=',
                                value:'TEST2',
                            }
                        ],
                    },
                    {
                        field:'organization_name',
                        operator:'=',
                        value:'TEST',
                    },
                    {
                        field:'organization_name',
                        operator:'IN',
                        value:[
                            'TEST1',
                            'TEST2'
                        ],
                    },

                ],
                actions:[
                    {
                        type:'email',
                        target:[
                            {
                                type:'user',
                                value:'ivan.lee.18@gmail.com'
                            },
                            {
                                type:'role',
                                value:'IT'
                            }
                        ],
                        message:'TEST'
                    }
                ]
            }
        }
        
    }
    componentDidMount(props){
        this.updateStatuses();
    }
    componentDidUpdate(props){
        if(props.type !== this.props.type || props.data !== this.props.data){
            
            this.setState({
                type:this.props.type,
                data:props.data || {
                    type:this.props.type
                },
                updateKey:Math.random()
            })
        }
    }
    

    updateStatuses =  async()=>{
        try{
            let q = `process_type="` + this.props.code + `"`
            q+= `,inactive=false`
                // if(!this.state.showInactive){
                    
                // }
            let statuses = await SDK.Statuses.findStatuses({q:q})
            this.setState({
                statuses:statuses
            })
        }catch(err){

        }
        
    }
    newCondition = ()=>{
        let data = this.state.data;
        data.conditions.push({
        })
        this.setState({data:data})
    }
    
    conditionListValueChanged = (index, listData)=>{
        let data = this.state.data;
        data.conditions[index] = listData;
        this.setState({
            data:data
        })

    }

    deleteCondition = (index)=>{
        let data = this.state.data;
        data.conditions.splice(index,1);
        this.setState({
            data:data
        })
    }

    
    newAction = ()=>{
        let data = this.state.data;
        data.actions.push({
            type:'email'
        })
        this.setState({data:data})
    }
    
    actionListValueChanged = (index, listData)=>{
        let data = this.state.data;
        data.actions[index] = listData;
        this.setState({
            data:data
        })

    }

    deleteAction = (index)=>{
        let data = this.state.data;
        data.actions.splice(index,1);
        this.setState({
            data:data
        })
    }

    render() {

        return (
            <Card>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <Card>
                                <Card.Header>Notification for {this.state.code}</Card.Header>
                                <Card.Body>
                                    <Form.Group>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control value={this.state.data?this.state.data.description:''} name="description"/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Status</Form.Label>
                                        <Form.Control as="select" value={this.state.data?this.state.data.status:''} name="status">
                                            <option></option>
                                            {
                                                this.state.statuses?this.state.statuses.map((row)=>{
                                                    return <option value={row.status_name}>{row.status_name}</option>
                                                })
                                                :null
                                            }
                                        </Form.Control>
                                    </Form.Group>
                                    {/* {
                                        this.renderPreview()
                                    } */}
                                </Card.Body>
                            </Card>
                            <Card>
                                <Card.Header>
                                    Actions 
                                    <div className="header-actions">
                                        <a onClick={this.newAction}>
                                            <i class="fas fa-plus"/>
                                            {/* <FontAwesomeIcon icon="plus"/> */}
                                        </a>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    {this.state.data?this.state.data.actions.map((row, index)=>{
                                        return <NotificationAction users={this.props.users} roles={this.props.roles} data={row} index={index} onDataChanged={this.actionListValueChanged} onDelete={this.deleteAction}/>
                                    }):null}
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card>
                                <Card.Header>
                                    Conditions 
                                    <div className="header-actions">
                                        <a onClick={this.newCondition}>
                                            <i class="fas fa-plus"/>
                                            {/* <FontAwesomeIcon icon="plus"/> */}
                                        </a>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    {this.state.data?this.state.data.conditions.map((row, index)=>{
                                        return <NotificationCondition data={row} index={index} onDataChanged={this.conditionListValueChanged} onDelete={this.deleteCondition}/>
                                    }):null}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Body>
                    <pre>{JSON.stringify(this.state.data, null, 2)}</pre>
                </Card.Body>
            </Card>
        )
        
    }
}

export default NotificationBuilder;