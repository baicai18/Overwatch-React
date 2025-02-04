import React from 'react';

import {Form,Card} from 'react-bootstrap';

class KeywordSearchField extends React.Component { 
    constructor(props){
        super(props);
        this.state={
            index: props.index,
            searchField:props.searchField
        }
    }

    onChange = (e)=>{
        var searchField = this.state.searchField;
        var target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        searchField[e.currentTarget.name] = value;

        this.setState({
            searchField:searchField
        },()=>{
            if(this.props.onDataChanged){
                this.props.onDataChanged(this.state.index, this.state.searchField);
            }

        })
    }

    render() {
        return (
            <Card>
                <Card.Body className="card-body-thin">
                    <Form.Row>
                        <Form.Group className="col-auto">
                            <Form.Label>Search Value</Form.Label>
                            <Form.Control type="text" name="search_value" value={this.state.searchField.search_value||''} onChange={this.onChange}/>
                        </Form.Group>
                        <Form.Group className="col-auto">
                            <Form.Label>Display Value</Form.Label>
                            <Form.Control type="text" name="display_value" value={this.state.searchField.display_value||''} onChange={this.onChange}/>
                        </Form.Group>
                    </Form.Row>
                </Card.Body>

            </Card>
        )
    }
    

}

export default KeywordSearchField;