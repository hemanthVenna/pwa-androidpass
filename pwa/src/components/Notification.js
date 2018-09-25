import React, { Component } from "react";
import Feedback from '../components/Feedback';
import ApiClient  from '../helpers/ApiClient';
/*import ApiEndPoints  from '../helpers/ApiEndPoints';*/
// import { find }  from 'lodash';
import {Animated} from 'react-animated-css';
import userLanguage from '../helpers/languageConstants.js';
import appConstants from "../helpers/appConstants";

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 0, 
      selectedKey: '', 
      showbtns: false,
      showSharethoughts: false,
      loveIt: false,
      review: false,
      displayLoader : true,
      language:'en'
    };
  }
  componentDidMount() {
   this.componentLoadAction();
   this.setState({displayLoader : false})
   console.log("this")
  };

  componentLoadAction = () => {
    // console.log(1111111);
    setTimeout(() => {
      this.setState({
        showbtns: true,
      });
      let journeyObj = {'deviceId': this.props.productData.Id, 'stage': '3'}
      document.cookie = appConstants.journeyStage+"=" +JSON.stringify(journeyObj)+ ";path=/;";
    }, this.props.appConstants.timeoutSpan);
  }
  deviceNotFoundAction = (product) => {
    this.props.notificationClickHandler(product);
    const that = this;
    this.setState({displayLoader : true})
    setTimeout(function(){
      that.setState({
        showbtns: false,
        displayLoader : false
      });
      that.componentLoadAction();
    }, 5000);

    /*this.setState({
      showbtns: false,
    });*/
  };
  deviceFoundAction = () => {
    this.setState({
      showSharethoughts: true,
    });
    let wishlistIds = ApiClient.getRequiredKeyCookieValue(appConstants.wishlistData);
    wishlistIds = (wishlistIds !== undefined && wishlistIds !== '') ? wishlistIds : '';
      
    if(wishlistIds.indexOf(this.props.productData.Id) > -1){
      let journeyObj = {'deviceId': this.props.productData.Id, 'stage': '4'}
      document.cookie = appConstants.journeyStage+"=" +JSON.stringify(journeyObj)+ ";path=/;";
      let journeyCompletedIds = ApiClient.getRequiredKeyCookieValue(appConstants.journeyCompleted);
      journeyCompletedIds = (journeyCompletedIds !== undefined && journeyCompletedIds !== '') ? journeyCompletedIds : '';
      if(journeyCompletedIds === '') {
        document.cookie = appConstants.journeyCompleted+"=" +this.props.productData.Id+ ";path=/;";
      }else if(journeyCompletedIds !== '' && (journeyCompletedIds.indexOf(this.props.productData.Id) < 0)) {
        let completedIds = journeyCompletedIds+','+this.props.productData.Id;
        document.cookie = appConstants.journeyCompleted+"=" +completedIds+ ";path=/;";
      }
    }
  };
  loveItAction = () => {
    console.log('okkkkkkk');
  };
  cancel = () => {
    this.props.clickHandler();
  };
  render() {
    const product = this.props.productData;
    const {showSharethoughts} = this.state;
    const {wayFinderSymbol} = this.props;

    const loader = <div className="loaderContainer">
          <div className="loaderContent">
             <img src="/images/loader.gif" alt="loader" />
          </div>
        </div>;
    const reqLanguage = userLanguage[this.state.language];
    return (
      <div>
        { 
          !showSharethoughts ?
          <div>
            <div className={`headingTxtmini ${!this.state.showbtns ? 'activeborder' : 'hidden'}`}>
              <h1>{reqLanguage.findHeader}</h1>
              <div className="deviceTxt">{reqLanguage.findContent}</div>
            </div>
            <div className={`headingTxtmini ${this.state.showbtns ? 'activeborder' : 'hidden'}`}>
              <h1>{reqLanguage.foundHeader}</h1>
              <div className="deviceTxt">{reqLanguage.foundContent}</div>
            </div>
            <div className= "NewsData topAlign">
              <div className={`widget wayWidget ${!this.state.showbtns ? 'activeborder' : 'hidden'}`} key={product.DeviceName.toString()}>
              <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
                <div className="widgetContents">              
                  <div className="wayIcon deviceImg">
                    <img src={wayFinderSymbol} alt="product" />
                  </div>
                  <hr />
                  <h4>{product.DeviceName}</h4>
                  <div className="hexagonImg">
                    <img src={product.DeviceImage ? product.DeviceImage : '/images/hpLaptop.png'} alt={product.DeviceName} title={product.DeviceName} />
                  </div> 
                  <div className="btnContainer"> 
                    <button className="btn btn-primary" onClick={() => this.cancel()}>{reqLanguage.cancel}</button>
                  </div>         
                </div>
                </Animated>
              </div>
            </div>
            <div className={`widget topAlign topRow ${this.state.showbtns ? 'activeborder' : 'hidden'}`}>
            <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
              <h2 className="productTitle">{product.DeviceName}</h2>
              <div className="img-padding"><img src={product.DeviceImage} alt={product.DeviceName} title={product.DeviceName} /></div>
                <button className="btn active" onClick={() => this.deviceFoundAction()}>{reqLanguage.yes}</button>
                <button className="btn active" onClick={() => this.deviceNotFoundAction(product)}>{reqLanguage.no}</button>
            </Animated>
            </div>
          </div>
          :
          <Feedback productData={product} loveItHandler={this.loveItAction}/>

        }
        {this.state.displayLoader && loader}
      </div>
    );
  }
}

export default Notification;
