import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import updateService from '../UpdateService';
import {Users} from '../sdk/SDK';



const FileNotification = ()=>{
    return (
        <div className="icon-circle bg-primary">
            <i class="fas fa-file-alt text-white"/>
            {/* <FontAwesomeIcon icon="file-alt" className="text-white"/> */}
        </div>
    )
}
const DonateNotification = ()=>{
    return (
        <div className="icon-circle bg-primary">
            <i class="fas fa-donate text-white"/>
            {/* <FontAwesomeIcon icon="donate" className="text-white"/> */}
        </div>
    )
}
const ExclamationNotification = ()=>{
    return (
        <div className="icon-circle bg-primary">
            <i class="fas fa-exclasmation-triangle text-white"/>
            {/* <FontAwesomeIcon icon="exclamation-triangle" className="text-white"/> */}
        </div>
    )
}

function NotificationList(props){
    const listItems = props.notifications.map((notification)=>{

        var className = '';
        if(notification.seen){
            className = 'class="font-weight-bold"';
        }
        var MessageType = <div/>;
        switch (notification.message_type) {
            case 1:
                MessageType = FileNotification;
                break;
            case 2:
                MessageType = DonateNotification;
                break;
            case 3:
                MessageType = ExclamationNotification;
                break;
            default:
                break;
        }
        return (
            <a key={notification["_id"]} className="dropdown-item d-flex align-items-center" href={notification.link} data-type="notification" data-id={notification["_id"]}>
                <div className="mr-3">
                <MessageType/>
                </div>
                <div>
                <div className="small text-gray-500">{notification.timestamp}</div>
                <span className={className}>{notification.message}</span>
                </div>
            </a>

        )
    });
    return (<div>{listItems}</div>);
}

class Notifications extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show:false,
            user:props.user,
            siteTitle:props.siteTitle,
        }
        this.doSomething = this.doSomething.bind(this);
        this.toggleShow = this.toggleShow.bind(this);
        this.hide = this.hide.bind(this);
        this.refreshUser = this.refreshUser.bind(this);
        this.socket = updateService.newSocket('notifications');
        this.socket.addEventListener(this, 'notification', this.refreshUser.bind(this));
    }


    render() {
        return (
            <li className="nav-item dropdown no-arrow mx-1" aria-labelledby="userDropdown" >
                <div className="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" tabIndex="1"  onClick={this.toggleShow} onBlur={this.hide}>
                    <i class="fas fa-bell"/>
                    {/* <FontAwesomeIcon icon="bell"/> */}
                    <span className="badge badge-danger badge-counter" style={
                        this.state.user.notifications?
                        (this.state.user.notifications.filter(x=>!x.seen).length > 0 ? {}: {display:'none'})
                        :({display:'none'})
                    } id="notification_count">{
                        this.state.user.notifications?
                        (this.state.user.notifications.filter(x=>!x.seen).length > 0 ? this.state.user.notifications.filter(x=>!x.seen).length : '')
                        :('')
                    }</span>
                </div>
                
                
                <div className={ "dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in " + (this.state.show ? 'show' : '')}>
                    <h6 className="dropdown-header">
                    Alerts Center
                    </h6>
                    <div id="notifications">
                        <NotificationList notifications={
                            this.state.user.notifications?
                            this.state.user.notifications
                            :[]
                            }/>
                    </div>
                    <a className="dropdown-item text-center small text-gray-500" href="/">Show All Alerts</a>
                </div>
            </li>
        );
    }

    doSomething(e){
        e.preventDefault();
        console.log(e.target.innerHTML);
    }
    
    toggleShow(){
        this.setState({show: !this.state.show});
        if(!this.state.show){
            this.markNotificationsRead();
        }
    }
    
    hide(e){
        if(e && e.relatedTarget){
            e.relatedTarget.click();
        }
        this.setState({show: false});
    }

    async markNotificationsRead(){
        if(this.state.user.notifications){
            var ids = this.state.user.notifications.filter(x=>!x.seen).map(x=>{
                return {id:x["_id"]};
            });
            if(ids.length > 0){
                Users.markNotificationsRead(ids)
                .then(data=>{
                    this.state.user.notifications.filter(x=>!x.seen).forEach(x=>{
                        x.seen = true;
                    });
        
                    this.setState({});
                })
                .catch(err=>{
                    console.log(err);
                })
    
            }
        }
        
    }

    refreshUser = () =>{
        Users.getMyInfo()
        .then(data=>{
            this.setState({
                user:data
            });
        })
        .catch(err=>{
            console.log(err);
        })
    }
    async pullMyData(){

    }

}

export default Notifications;