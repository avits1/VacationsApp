import React from 'react';
import Moment from 'react-moment';
import  'moment-timezone';

const IMG = (imageName) => {
    return require(`../../upload/${imageName}`);
}

class VacationCube extends React.Component {
        
    followVacation(vac_id, is_followed) { // for vacations_user                
        if (is_followed) {
            this.props.removeFollowed(vac_id);
        }
        else {
            this.props.addFollowed(vac_id);
        }
    }
    
    editVacation(vac_id) { // for admin vacation                                        
        this.props.editVacation(vac_id);                
    }
    
    delVacation(vac_id) { // for admin vacation         
        this.props.deleteVacation(vac_id);
    }
    
    
    render() {               
        
        let DateStart = new Date(this.props.vcube.date_start);
        let DateEnd = new Date(this.props.vcube.date_end);
        var follow_num = (!this.props.vcube.follow_num) ? 0 : this.props.vcube.follow_num;

        return (
        <div className="vacation_div">            

            <div className={(this.props.is_admin) ? "d-none text-right" : "text-right"}>
                <div className=""><i onClick={(e) => this.followVacation(this.props.vcube.vac_id, this.props.is_followed)} className={(this.props.is_followed) ? "fas fa-star" : "far fa-star"}></i></div> 
            </div>

            <div className={(!this.props.is_admin) ? "d-none text-right" : "text-right"}>
                <div className=""><i onClick={(e) => this.delVacation(this.props.vcube.vac_id)} className="far fa-times-circle"></i></div> 
                <div className=""><i onClick={(e) => this.editVacation(this.props.vcube.vac_id)} className="fas fa-pen"></i></div> 
            </div>

            <div className="text-left text-success">To: <span className="text-dark">{this.props.vcube.dest}</span></div>
            <div className="text-left text-success">Description: <span className="text-dark">{this.props.vcube.vac_desc}</span></div>
            <div className="text-left text-success">Price: <span className="text-dark">{this.props.vcube.price} &#8362;</span></div>
            
            <div className='vacation_row row'>
                <div className='vacation_col col-md-12'>                    
                    <img  className='border border-primary rounded ' width='100%' height='100%'  src={IMG(this.props.vcube.pic)} alt="Vacation Pic" />
                </div>
            </div>
                        
            <div className="row">                           
                <div className="col-10">                        
                    <div className="text-left  text-success">Vacation Dates:</div>
                    <div  className="text-left text-info">
                        <Moment date={DateStart} format="DD/MM/YYYY" /> - <Moment date={DateEnd} format="DD/MM/YYYY" />
                    </div>
                </div>

                <div className="col-2">
                    <div className={(this.props.is_admin) ? "d-none text-right" : "text-right badge badge-dark"}>{follow_num}</div>
                </div>
            </div>
            <div className="row">  
            <div className="col-10">                        
                    <div  className="text-left text-info">
                    </div>            
                </div>
            </div>
        </div>
        );
    }
}

export default VacationCube;
