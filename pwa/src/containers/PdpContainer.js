import React, { Component } from "react";
import { find, isUndefined, isEmpty }  from 'lodash';
import deviceData from '../helpers/data/devices';
import locationData from '../helpers/data/locations';
import {Animated} from 'react-animated-css';
import userLanguage from '../helpers/languageConstants.js';
class PdpContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: '', 
      clicked: false,
      imgkey: 0,
      language: 'en'
    };
  }

  selectImage = (imgUrl, index) => { 
    this.setState({
      imgUrl: imgUrl,
      clicked: true,
      imgkey: index
    });
  }

  render() {
    const {skuId } = this.props.match.params;
    const location = find(locationData.locations, { 'locationCode': '5zGSiSScdocvi4Z' });
    const locationText = (!isUndefined(location) && !isEmpty(location)) ? location.locationName : '';
    const deviceInfo = find(deviceData.devices, {'deviceCode': skuId });
    const imgUrl = this.state.clicked ? this.state.imgUrl : deviceInfo.shortdeskimageUri;
    const tabImgs = deviceInfo.productImages.map((key, index) => (<img src={key} alt="" key={index.toString()} onClick={() => this.selectImage(key, index)} className={`cursor ${this.state.imgkey === index ? 'active' : ''}`}/>));

    const reqLanguage = userLanguage[this.state.language];
    return (
      <div className="headingSection whiteBg">
      <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
        <div className="breadCrum">
        <div className="breadCrumBar">
          {reqLanguage.ctl}
          <span className="pull-right hidden-xs hidden-sm">
            <img src="/images/share.png" alt="" />
          </span>
        </div>
      </div>
    <div className="container p-top-large">
      <div className="row">
        <div className="col-md-7 leftContainer">
          <h3>{deviceInfo.deviceName}</h3>
          <div className="Model">
            <span className="bold">{reqLanguage.model}:</span>
            <span>15-CHO11DX</span> 
            <span className="bold">{reqLanguage.sku}:</span>
            <span>{deviceInfo.deviceCode}</span>
          </div>
          <div className="starrating">
            <span><img src="/images/fourStar.png" alt="star rating" /></span>
            <span>(98) Add a review</span>
            <span className="reviews">25 {reqLanguage.questions}, 42 {reqLanguage.answers}</span>
          </div>
          <div className="sliderContainer">
            <div className="sliderImage">
              <img src={imgUrl} alt={deviceInfo.deviceName} />
            </div>
            <div className="sliderButtons">
              <div className="sliderButtons-m">
                {tabImgs ? tabImgs : ''}
            </div>
            </div>
            <div className="displaySettings">
              <div>
                <span className="green">{reqLanguage.onDisplay}</span> at 
                <span> {locationText}</span>
                <span className="changeStore"> <a>{reqLanguage.changeStore}</a></span>
              </div>          
            </div>
          </div>      
        </div>
        <div className="col-md-5 rightContainer">
          <div>
          <h4><img className="dollar" src="/images/dollar.png" alt="" /> <b>{reqLanguage.priceMatch} </b> {reqLanguage.guarantee}</h4>
          <h1>$ {deviceInfo.price}</h1>
          </div>
          <div className="protectProduct">
            <div className="protectImg">
              <img className="tick" src="/images/tick.png" alt="" />
            </div>
            <div className="protectContent">
              <h2>{reqLanguage.protectProduct}</h2>
              <h5>{reqLanguage.learnAboutAccidenatalPLans}</h5>
            </div>
          </div>
          <div className="plans">
            <div className="plancart">
              <span className="year">1 Year</span>
              <span className="amount">$199.99</span>
            </div>
            <div className="plancart">
              <span className="year">2 Year</span>
              <span className="amount">$199.99</span>
            </div>
            <div className="plancart">
              <span className="year">{reqLanguage.noPlan}</span>
              <span className="">{reqLanguage.selected}</span>
            </div>
          </div>
          <div className="cartButtons">
            <button >{reqLanguage.addToCart}</button>
            <button className="inactive">{reqLanguage.buildBundle}</button>
            <div className="registryButtons">
              <a>{reqLanguage.savedForLater}</a>
              <a>{reqLanguage.addForRegistry}</a>
            </div>
            <div className="delivery">
              <div> <b>{reqLanguage.freeShipping}</b> Get it by Wed, Jun 20</div>
              <div> {reqLanguage.wantItToday} </div>
              <div>{reqLanguage.sameDayDelivery}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="row offersContainer">
       <div className="col-md-5 offersPullRight" >
        
       </div>
       <div className="col-md-7 offersSection">
         <div className="row offers">
           <div className="col-md-7">
             <h4>{reqLanguage.specialOffer}</h4>
             <ul>
                <li>$29.99 Anti-Malware with Select Purchase</li>
                <li>Save $20 on Microsoft Office with Device</li>
                <li>Save $30 or $50 on Printer with device</li>
                <li>$50 Off Dragon Software with Computer</li>
                <li>$50 off Select Mouse with Laptop</li>         
                <li className="Showmore"> <a>{reqLanguage.showmore}</a></li>          
             </ul>
           </div>
           <div className="col-md-5">
             <h4>{reqLanguage.cardMemberOffers}</h4>
              <ul>
                <li>{reqLanguage.finance12}</li>
                <li>{reqLanguage.finance6}</li>
                <li>{reqLanguage.rewards}</li>          
             </ul>
           </div>
        </div>
        <div className="row touch">
          <div className="col-md-3 text-center">
            <img src="/images/touch.png" alt="touch"/>
          </div>
          <div className="col-md-9">
            Touch screen HP Spectre x360 Convertible 2-in-1 Laptop: Develop creativity with this 15.6-inch HP Spectre laptop. Its 360-degree hinge converts it to a tablet for careful drawing or video editing on the 4K display with the digital pen, and its quad-core Intel Core i7 processor and 16GB of DDR4 RAM let you switch between programs smoothly. This HP Spectre laptop has a 512GB SSD for fast boot times.
          </div>
        </div>
       </div>
      </div>
      <div className="windowsTools">
      <div className="row">
        <div className="col-md-4">
          <img src="/images/cooldesign.png" className="headImg" alt="cool designs" />
          <h3>{reqLanguage.coolDesigns}</h3>
          <p>{reqLanguage.coolDesignsContent}</p>
        </div> 
        <div className="col-md-4">
          <img src="/images/performance.png" className="headImg" alt="cool designs" />
          <h3>{reqLanguage.betterPerformance}</h3>
          <p>{reqLanguage.betterPerformanceContent}</p>
        </div> 
        <div className="col-md-4">
          <img src="/images/peace.png" className="headImg" alt="cool designs" />
          <h3>{reqLanguage.peaceOfMind}</h3>
          <p>{reqLanguage.peaceOfMindContent}</p>
        </div>
      </div>
      <div className="row winRow">
        <div className="col-md-6">
          <img src="/images/windowsGallery1.png" alt="gallery" className="marginTop-15" />
        </div>
        <div className="col-md-6">
          <h3>{reqLanguage.bestWindowsYet}</h3>
          <p>{reqLanguage.bestWIndowsYetContent}</p>
        </div>
      </div>
      <div className="row winRow">
        <div className="col-md-6 pull-right">
          <img src="/images/windowsGallery2.png" alt="gallery" className="marginTop-15" />
        </div>
        <div className="col-md-6">
          <h3>{reqLanguage.security}</h3>
          <p>{reqLanguage.securityContent}</p>
        </div>
      </div>
      <div className="row winRow">
        <div className="col-md-6">
          <img src="/images/windowsGallery3.png" alt="gallery" className="marginTop-15" />
        </div>
        <div className="col-md-6">
          <h3>{reqLanguage.microsoftEdge}</h3>
          <p>{reqLanguage.microsoftEdgeContent}</p>
        </div>
      </div>
      <div className="row winRow">
        <div className="col-md-6 pull-right">
          <img src="/images/windowsGallery4.png" alt="gallery" className="marginTop-15" />
        </div>
        <div className="col-md-6">
          <h3>{reqLanguage.office}</h3>
          <p>{reqLanguage.officeContent}</p>
        </div>
      </div>
    </div>
    </div> 
    </Animated>     
      </div>
    );
  }
}

export default PdpContainer;
