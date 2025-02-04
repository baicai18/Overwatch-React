import React, { Component} from 'react';
import {Modal, Button, Form, InputGroup} from 'react-bootstrap';
import UniversalLink from '../apps/tools/UniversalLink';
import LoadBlocker from '../LoadBlocker';
import SDK from '../sdk/SDK';
import ReactGrid from '../apps/tools/ReactGrid/ReactGrid';

class Search extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading:false,
            searchActive:false,
        }
    }

    setSearch = (value)=>{
        this.setState({
            searchActive:value,
            searchValue:''
        })
    }
    
    searchChanged=(event)=>{
        let value = event.target.value;
        this.setState({
            searchValue:value
        })
    }

    trySearch = ()=>{
        if(this.state.searchValue){
            this.search(this.state.searchValue);
        }
    }

    getLinkURL = (linkType, value)=>{
        switch(linkType){
            case 1:
                return '/organization/' + value;
                break;
            default:
                return null;
        }
    }

    search = (value)=>{
        this.setState({
            searching:true,
            results:null
        },async()=>{
            try{
                let results = await SDK.Search.searchObject(value);
                if(results.length > 0){
                    if(results.length === 1 && false){
                        //found
                        let url = UniversalLink.getLinkURL(results[0].linkType, results[0].value);//UnigenLink.getLinkURL(results[0].linkType,results[0].value);
                        if(url !==  ''){
                            window.open(UniversalLink.getLinkURL(results[0].linkType,results[0].value), "_self");
                        }else{
                            alert("Error retreiving URL");
                        }
                        
                    }else{
    
                        this.setState({
                            searching:false,
                            results:results
                        },()=>{
                           // alert("More than one item: " + JSON.stringify(results));
                        })
    
                    }
                }else{
                    this.setState({
                        searching:false,
                    },()=>{
                        alert(value + " not found");
                    })
                }
            }catch(err){
                alert(err);
                this.setState({
                    searching:false
                },()=>{
                    alert(value + " not found");
                })
            }
        })
    }
    handleClose = ()=>{
        this.setSearch(false);
        this.setState({results:null})
    }

    render() {

        let columns = [
            { key: "type", name: "Type"},
            { key: "organization", name: "Organization"},
            { key: "value", name: "Value", formatter:({value, row})=>{
                if(value){
                    return <UniversalLink key={value+row.linkType}  linkType={row.linkType} value={value} display={row.display}/>
                }else{
                    return '';
                }
            },exportFormatter:({value,row})=>{
                return value
            }},
        ];
        //columns = null;

        return(
            <div className={"search-wrapper " + (this.state.searchActive?'active':'')}>
                <div className="input-holder">
                    {
                        this.state.searching?
                        <LoadBlocker/>
                        :''
                    }
                    <InputGroup>
                        <Form.Control className="search-input" type="text" placeholder="Type to search" value={this.state.searchValue} onChange={this.searchChanged} onKeyPress={(e)=>{if(e.key==="Enter"){this.trySearch()}}}/>
                        
                        <div className="input-group-append">
                            <button className="btn btn-primary" 
                                onClick={()=>{
                                    this.trySearch();
                                    // if(this.state.searchActive){
                                    //     this.trySearch();
                                    // }else{this.setSearch(true)}
                                    }
                                }
                            >
                                <i className="fas fa-search fa-sm"></i>
                            </button>
                        </div>
                    </InputGroup>
                    
                </div>
                <button className="close" onClick={()=>{this.setSearch(false)}}></button>
                <Modal show={this.state.results} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Multiple Items Found</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <ReactGrid
                        export={false}
                        key={this.state.results}
                        columns={columns}
                        //rowGetter={this.bomRowGetter}
                        rowGetter={(i)=>{return this.state.results[i]}}
                        rowsCount={this.state.results?this.state.results.length:0}
                        showRowCount={true}
                        //height='300px'
                    />
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
    
}



export default Search;
