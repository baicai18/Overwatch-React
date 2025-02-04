import React, { Component } from 'react';


class UniversalLink extends Component {
    constructor(props){
        super(props)
        this.control = React.createRef();
        this.state = {
            linkType:this.props.linkType,
            value:this.props.value,
            display:this.props.display,
        }
    }
    
    static getLinkURL(linkType,value, display){
        switch(linkType){
            case 1: //Organization
                return "/organization/" + encodeURIComponent(value);
            case 2: //Assembly
                return "/project/" + encodeURIComponent(value);
            case 3: //RFQ
                return "/rfq/" + encodeURIComponent(value);
            case 4: //Quotation
                return "/quotation/" + encodeURIComponent(value);
            case 5: //Purchase Order
                return "/purchaseOrder/" + encodeURIComponent(value);
            // case 2: //ComponentID
            //     return "/component/" + encodeURIComponent(value);
            // case 3: //RCC SN
            //         return "/rcc/resourceSN/" + encodeURIComponent(value);
            // case 4: //WO
            //     return "/wo/" + encodeURIComponent(value); 
            // case 5: //Geram WO
            //     return "/geram/wo/" + encodeURIComponent(value); 
            // case 6: //PM Machine SN
            //     return "/pm/machines/" + encodeURIComponent(value); 
            // case 11: //Itemnumber
            //     return "/itemInfo/" + encodeURIComponent(value); 
            // case 12: //Agile Change
            //     return "/changeNotice/" + encodeURIComponent(value); 
            // case 13: //Agile Quality Issue
            //     return "/qualityIssue/" + encodeURIComponent(value); 
            // case 14: //Agile Quality Action
            //     return "/qualityAction/" + encodeURIComponent(value); 
            // case 16: //SPCN
            //     return "/spcn/" + encodeURIComponent(value); 
            // case 17: //PCN
            //     return "/pcn/" + encodeURIComponent(value); 
            // case 18: //SO
            //     return "/so/" + encodeURIComponent(value); 
            // case 31: //traveler
            //     return "http://192.168.1.90/ReprintTravelerOpt.aspx?WO=" + encodeURIComponent(value); 
            default:
                console.error("Link Type: " + linkType + " - Has not been defined");
                return '';
        }
    }


    render() {
        return (
            <a href={UniversalLink.getLinkURL(this.state.linkType, this.state.value, this.state.display)} title={this.state.display}>{this.state.display}</a>
        )
    }

    
    
}



export default UniversalLink;
