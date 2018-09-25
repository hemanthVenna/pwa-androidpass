import React, { Component } from "react";
import NewsDescription from '../components/NewsDescription';
import ExploreMore from '../components/ExploreMore';
import BeaconWithProduct from '../containers/BeaconWithProduct'
// import ApiClient  from '../helpers/ApiClient';
//import ApiEndPoints  from '../helpers/ApiEndPoints';
// import { find }  from 'lodash';
import {Animated} from 'react-animated-css';
import userLanguage from '../helpers/languageConstants.js';
import appConstants from "../helpers/appConstants";
class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loveIt: false,
      review: false,
      buyNow: false,
      exploreMore: false,
      language: 'en',
      backToBeacon : false
    };
  }

  loveIt = () => {
    let journeyObj = {'deviceId': this.props.productData.Id, 'stage': '5'}
    document.cookie = appConstants.journeyStage+"=" +JSON.stringify(journeyObj)+ ";path=/;";
    /*let journeyCompletedIds = ApiClient.getRequiredKeyCookieValue(appConstants.journeyCompleted);
    journeyCompletedIds = (journeyCompletedIds !== undefined && journeyCompletedIds !== '') ? journeyCompletedIds : '';
    if(journeyCompletedIds === '') {
      document.cookie = appConstants.journeyCompleted+"=" +this.props.productData.Id+ ";path=/;";
    }else if(journeyCompletedIds !== '' && (journeyCompletedIds.indexOf(this.props.productData.Id) < 0)) {
      let completedIds = journeyCompletedIds+','+this.props.productData.Id;
      document.cookie = appConstants.journeyCompleted+"=" +completedIds+ ";path=/;";
    }*/
    this.setState({
      loveIt: false,
      review: false,
      exploreMore: false,
      buyNow: true
    });
  };
  showReview = () => {
    this.setState({
      loveIt: false,
      exploreMore: false,
      review: true,
      buyNow: false
    });
  };
  exploreMoreAction = () => {
    this.setState({
      loveIt: false,
      review: false,
      exploreMore: true,
      buyNow: false
    });
  }
  backButtonClick = () => {
    this.setState({
      loveIt: false,
      review: false,
      exploreMore: false,
      buyNow: false
    });
  }
  backExploreClick = () => {
    this.setState({
      loveIt: false,
      review: false,
      exploreMore: true,
      buyNow: false
    });
  }

  buyNowAction = () => {
    this.setState({
      loveIt: false,
      review: false,
      exploreMore: false,
      buyNow: true,
    });
  }

  backToHome = () => {
    this.setState({backToBeacon:true})
  }
  render() {
    const product = this.props.productData;
    const {loveIt, review, buyNow, exploreMore, backToBeacon} = this.state;
    const reqLanguage = userLanguage[this.state.language];
    return (
      <div>
        {backToBeacon ? <BeaconWithProduct /> : 
        <div>
        <div className={ (loveIt || review || buyNow || exploreMore) ? 'none' : '' }>
          <div className="headingTxtmini">
            <h1>{reqLanguage.feedBackHeader1}</h1>
            <div className="deviceTxt">{reqLanguage.feedBackContent1}</div>
          </div>
          <div className="widget topAlign topRow activeborder">
          <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
            <h2 className="productTitle">{product.DeviceName}</h2>
            <div className="img-padding deviceImg"><img src={product.DeviceImage} alt={product.DeviceName} title={product.DeviceName} /></div>
            <div className="productRating">
              <div><img src="/images/fiveStar.png" alt="" /></div>
              <span className="cursor" onClick={() => this.showReview()}>(98) {reqLanguage.seeReviews}</span>
            </div> 
            <button className="btn active" onClick={() => this.loveIt()}>{reqLanguage.loveIt}</button>
            <button className="btn active" onClick={() => this.exploreMoreAction()}>{reqLanguage.exploreMore}</button>
           {/* <button className="btn active" onClick={() => this.showReview()}>{reqLanguage.rr}</button>*/}
            </Animated>
          </div>
        </div>
        <div className={ !loveIt ? 'none' : '' }>
          <div className="headingTxtmini">
            <h1>{reqLanguage.feedBackHeader2}</h1>
            <div className="deviceTxt">{reqLanguage.feedBackContent2}</div>
          </div>
          <div className="widget topRow topAlign activeborder">
          <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
            <div className="deviceImg"><img src={product.DeviceImage ? product.DeviceImage : '/images/hpLaptop.png'} alt={product.DeviceName} title={product.DeviceName} /></div>
            <button className="btn active" onClick={() => this.buyNowAction()}>{reqLanguage.buyNow}</button>
            <button className="btn active">{reqLanguage.exploreMore}</button>
          </Animated>
          </div>
        </div>
        <div className={ !review ? 'none' : '' }>
          <NewsDescription deviceInfo={product} clickHandler={this.backButtonClick}/>
        </div>
        <div className={ !buyNow ? 'none' : '' }>
          <div className="headingTxtmini">
            <h1>{reqLanguage.feedBackHeader3}</h1>
            <div className="deviceTxt ">{reqLanguage.feedBackContent3}</div>
          </div>
          <div className="widget topRow topAlign activeborder">
          <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
            <h2 className="productTitle">{product.DeviceName}</h2>
            <div className="img-padding"><img src={product.DeviceImage ? product.DeviceImage : '/images/hpLaptop.png'} alt={product.DeviceName} title={product.DeviceName} /></div>
          </Animated>
          </div>
          <button className="btn btn-back" onClick={() => this.backToHome()}>{reqLanguage.backToHome}</button>
        </div>
        { !exploreMore ? '' : <ExploreMore deviceInfo={product} clickHandler={this.backExploreClick}/> }
        </div>
      }
      </div>
    );
  }
}

export default Feedback;
