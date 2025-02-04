import React from 'react';
import {Card, Button} from 'react-bootstrap';
import SDK from '../../sdk/SDK';
import DeliverableForm from '../tools/deliverableForm/DeliverableForm';


class FormSubmit extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            show:false,
            rfq_number:props.rfq_number,
            project:props.project||{},
            revision:props.revision||{},
            requirement:props.requirement||{},
            deliverable:props.deliverable||{},
        }


    }

    componentDidMount(){
        
        
        
    }

    componentDidUpdate(props){
        if(props.rfq_number !== this.props.rfq_number){
            this.setState({
                rfq_number:this.props.rfq_number
            })
        }
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
        if(props.deliverable !== this.props.deliverable){
            this.setState({
                deliverable:this.props.deliverable
            })
        }
    }

    setShow = (value)=> {
        this.setState({show:value});
    }

    formDataChanged = (data) =>{
        let deliverable = this.state.deliverable;
        deliverable.formData = data;
        this.setState({
            deliverable:deliverable
        },()=>{
            //console.log(JSON.stringify(this.state.deliverable));
        })
            
            
    }
    trySave = ()=>{
        if(this.state.deliverable.formData){
            let formData = Object.assign({},this.state.deliverable.formData);
            formData = this.removeKey(formData, 'key');
            //console.log(JSON.stringify(formData));
            this.uploadForm(formData);
        }
        

    }
    removeKey = (formData, key)=>{
        var keys = Object.keys(formData);
        for (var i = 0; i < keys.length; i++) {
            if(Array.isArray(formData[keys[i]])){
                formData[keys[i]].forEach(listItem=>{
                    listItem = this.removeKey(listItem,key);
                    delete listItem[key];
                })
            }else if (typeof formData[keys[i]] === 'object'){
                this.removeKey(formData[keys[i]], key)
            }
            
        }
        return formData;
    }
    uploadForm = async (formData)=>{
        try{
            let data = await SDK.RFQ.submitDeliverableForm(this.state.rfq_number, this.state.requirement._id, this.state.deliverable._id,formData);
            
            if(this.props.onSaved){
                this.props.onSaved(data);
            }
            alert("Saved");
        }catch(err){
            alert(err);
        }
        // SDK.Projects.submitDeliverableForm(this.state.project._id, this.state.revision._id, this.state.requirement._id, this.state.deliverable._id,formData)
        // .then(data=>{
        //     alert("Saved");
        //     // alert(JSON.stringify(data));
        // })
    }

    render = ()=>{
        return (
            <div>
                <Button onClick={this.trySave}>Save</Button>
                
                
                <Card>
                    <Card.Header className="card-header-border">{this.state.requirement.display_name}</Card.Header>
                    <Card.Body style={{overflow:"auto"}}>
                        <DeliverableForm formDesign={this.state.requirement.formData} formData={this.state.deliverable?this.state.deliverable.formData:null} onChange={this.formDataChanged}/>
                    </Card.Body>
                </Card>
                {/* <pre>{JSON.stringify(this.state.parsedBOM,function (key, value) {
                                        if (key == "parentNode") {
                                            return undefined;
                                        }
                                        return value;
                                    }, 
                                    2)}</pre> */}
                                    
                {/* <pre>{JSON.stringify(this.state.deliverable,function (key, value) {
                                        if (key == "parentNode") {
                                            return undefined;
                                        }
                                        return value;
                                    }, 
                                    2)}</pre> */}
            </div>
        )
    }
}

export default  FormSubmit;