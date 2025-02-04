import React, { Component } from 'react';
import {Button, InputGroup, Form} from 'react-bootstrap';


class UniversalObjectFormControl extends Component {
    constructor(props){
        super(props)
        this.control = React.createRef();
        this.state = {
            linkType:this.props.linkType,
        }
    }


    linkClicked = ()=>{
        let value = this.control.current.value
        if(value && value !== ''){
            switch(this.state.linkType){
                case 1: //SN
                    window.open("/sn/" + encodeURIComponent(value), "_blank"); 
                    break;
                case 2: //ComponentID
                    window.open("/component/" + encodeURIComponent(value), "_blank"); 
                    break;
                case 3: //RCC SN
                    window.open("/rcc/resourceSN/" + encodeURIComponent(value), "_blank"); 
                    break;
                case 4: //WO
                    window.open("/wo/" + encodeURIComponent(value), "_blank"); 
                    break;
                case 5: //Geram WO
                    window.open("/geram/wo/" + encodeURIComponent(value), "_blank"); 
                    break;
                case 6: //PM Machine SN
                    window.open("/pm/machines/" + encodeURIComponent(value), "_blank"); 
                    break;
                case 11: //Itemnumber
                    window.open("/itemInfo/" + encodeURIComponent(value), "_blank"); 
                    break;
                case 12: //PLM Change
                    window.open("/changeNotice/" + encodeURIComponent(value), "_blank"); 
                    break;
                case 13: //PLM Quality Issue
                    window.open("/qualityIssue/" + encodeURIComponent(value), "_blank"); 
                    break;
                case 14: //PLM Quality Action
                    window.open("/qualityAction/" + encodeURIComponent(value), "_blank"); 
                    break;
                case 15: //Sales Order
                    window.open("/so/" + encodeURIComponent(value), "_blank"); 
                    break;
                case 16: //SPCN
                    window.open("/spcn/" + encodeURIComponent(value), "_blank"); 
                    break;
                case 17: //PCN
                    window.open("/pcn/" + encodeURIComponent(value), "_blank"); 
                    break;
                case 18: //SO
                    window.open("/so/" + encodeURIComponent(value), "_blank"); 
                    break;
                case 31: //traveler
                    window.open("http://192.168.1.90/ReprintTravelerOpt.aspx?WO=" + encodeURIComponent(value), "_blank"); 
                    break;
                default:
                    console.error("Link Type: " + this.state.linkType + " - Has not been defined");
            }

        }
    }

    render() {
        var {linkType,...other} = this.props;
        return (
            <InputGroup>
                <Form.Control ref={this.control}  {...other}></Form.Control>
                <InputGroup.Append>
                    <Button size="sm" variant="outline-secondary" onClick={this.linkClicked}><i className="fas fa-external-link-alt"></i></Button>
                </InputGroup.Append>
            </InputGroup>
        )
    }
}



export default UniversalObjectFormControl;
