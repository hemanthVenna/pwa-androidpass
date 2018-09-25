import React, { Component } from "react";
/*import { map, indexOf}  from 'lodash';
import deviceData from '../helpers/data/devices';*/
import Handoff from '../components/Handoff';
import { isUndefined, isEmpty, includes }  from 'lodash';
// import HomeContainer from '../containers/HomeContainer';
import ApiClient  from '../helpers/ApiClient';
import appConstants from "../helpers/appConstants";
import ApiEndPoints  from '../helpers/ApiEndPoints';
import {Animated} from 'react-animated-css';
import userLanguage from '../helpers/languageConstants.js';

class ScanedProduct extends Component {
  	constructor(props) {
	 	super(props);
  		this.state = {
  			Listskus: '',
  			wishList: [],
  			storeId: '',
  			loaded: false,
  			activePass: '',
        jwtString: '',
        locationAccessAllowed : true,
        displayLoader : false,
        language: 'en'
  		};
  	}

  	componentDidMount() {

      const userAgent = navigator.userAgent.toLowerCase();
      const IsFBMSN = ((userAgent.indexOf('fb_iab') > -1) || (userAgent.indexOf('fban/') > -1) || (userAgent.indexOf('micromessenger') > -1));
      if(!IsFBMSN){
        this.setState({displayLoader:true});
  		  let currentParams = this.props.match.params;
    		let sessionId = (!isUndefined(currentParams.sessionId) && !isEmpty(currentParams.sessionId)) ? currentParams.sessionId : '';
        document.cookie = appConstants.sessionCookie+"=" + sessionId+ ";path=/;";
        localStorage.setItem(appConstants.sessionCookie, sessionId);
        if (navigator && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
  	        //currentParams = { latitude: "17.425646", longitude: "78.4201999", sessionId:sessionId };
            this.setState({locationAccessAllowed:true,})
  	        currentParams = { latitude: position.coords.latitude, longitude: position.coords.longitude, sessionId:sessionId };  
  	        const that = this;
  	        ApiClient.apiPost(ApiEndPoints.DevicesBySessionId, currentParams).then(function(res) {
  			  		if(res.data.data.length > 0) {
                const productsList = res.data.data.length > 0 ? res.data.data.filter((item) => {
                    if(item.Id !== null){
                      return item; 
                    }else{
                      return null
                    } 
                }) : [];
                that.setWishlistCookies(productsList);
    			  		that.setState({wishList: productsList, storeId: res.data.nearestStoreId, loaded: true,displayLoader:false});
                  that.createPass(currentParams, res.data.data);
  			     	} else {
  			      	alert(userLanguage[that.state.language].saveSessionErr);
  			      }	
  			  	});
  		  	}, (error) => {
  		  		// alert(userLanguage.en.browserSettingErr);
            this.setState({locationAccessAllowed:false,displayLoader:false})
  	      });
  	    }else{
          alert(userLanguage[this.state.language].useAnotherBrowser);
        }
      }
  	};
    setWishlistCookies = (data) => {
      let stringObj = JSON.stringify(data);
      document.cookie = appConstants.wishlistData+"=" + stringObj + ";path=/;";
    }
 	  createPass = (inputParam, wishlist) => {
  		if(wishlist.length > 0){
  			inputParam.sku = '';
  			inputParam.make = wishlist[0].Make;
  			inputParam.model = wishlist[0].DeviceName;
  			inputParam.storeId = wishlist[0].SStoreId;
        const that = this;
        const uagent = navigator.userAgent.toLowerCase();
        let isiPhone = includes(uagent, appConstants.iphone);
        if(isiPhone){
    			ApiClient.apiPost(ApiEndPoints.CreateiosPass, inputParam).then(function(res) {
    				if(res.status === 200){
    					that.assignWalletPass(res.data.passUrl);
    				}else{
    					alert(userLanguage[that.state.language].passNotCreated);
    				}
  		  	});
        }
        let isAndroid = includes(uagent,appConstants.android);
        if(isAndroid){
          ApiClient.apiPost(ApiEndPoints.CreateandroidPass, inputParam).then(function(res) {
            if(res.status === 200){
              var promise1 = new Promise(function(resolve, reject) {
                that.setState({
                  'jwtString' : res.data.jwt
                });
                resolve();
              });
              promise1.then(function(){
                var saveToAndroidPay = document.createElement("g:savetoandroidpay");
                saveToAndroidPay.setAttribute("theme", "light");
                saveToAndroidPay.setAttribute("jwt", that.state.jwtString);
                saveToAndroidPay.setAttribute("onsuccess", "successHandler");
                saveToAndroidPay.setAttribute("onfailure", "failureHandler");
                  document.querySelector("#loyalty").appendChild(saveToAndroidPay);
                
                var script = document.createElement("script");
                script.src = "https://apis.google.com/js/plusone.js";
                document.head.appendChild(script);
              })
                  
            }else{
              console.log('request failed')
              // alert(userLanguage.en.passNotCreated);
            }
          });
        }
  		}
  	}

  	assignWalletPass= (passUrl) => {
  		this.setState({activePass: passUrl});
  	}
  	getDispayData() {
  		console.log();
  	}

  render() {
  	const { wishList, activePass } = this.state;
  	const storeId = this.state.storeId ? this.state.storeId : '';
  	const displayText = wishList.length > 0 ? wishList : '';
  	const uagent = navigator.userAgent.toLowerCase();
  	let isiPhone = includes(uagent, appConstants.iphone);
    const reqLanguage = userLanguage[this.state.language];
    let msg = userLanguage.en.unableContentAndroid;
    if(uagent.indexOf('fban/') > -1){
      msg = userLanguage.en.unableContentIos;
    }
    if((uagent.indexOf('fb_iab') > -1) || (uagent.indexOf('micromessenger') > -1)){
      msg = userLanguage.en.unableContentAndroid;
    }
  	let downloadPass = (isiPhone && !isEmpty(activePass)) ? true : false;
    const IsFBMSN = ((uagent.indexOf('fb_iab') > -1) || (uagent.indexOf('fban/') > -1) || (uagent.indexOf('micromessenger') > -1));

    const notFromFBMSNWrap = <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
        <div className={`${!displayText ? 'bgWhite' : ''}`}>
          { displayText ?
            <div className="">
              <div className="bgWhite">
                <h1>{reqLanguage.oneStepAway}</h1>
                <div className="deviceTxt padbtm-60">{reqLanguage.saveForInStoreExp}</div>
              </div>
              <div className="grayBg">
                <Handoff wishlistData={displayText} appConstants={appConstants} storeId={storeId} isIos={isiPhone} walletClickHandler={this.assignWalletPass}/>
              </div>
              <div id='loyalty'></div>
            </div>  : ''
          }
        </div>
        { downloadPass ? <iframe width="1" height="1" src={activePass} title="test"></iframe> : '' }
      </Animated>;

      const fromFBMSNWrap = <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
        <div className={`headingTxtBeacon `}>
          <div className="headingSection">
            <div className="widgetAlert">
              <h4>{reqLanguage.unableToSave}</h4>
              <div><img src="/images/ic-busy.png" alt="welcomeImage"/></div>
              <div className='unableSubHead'><p>{reqLanguage.weHaveSol}</p></div>
              <div className='unableContent' >
                <p>{msg}</p>
              </div>
            </div>
          </div>
        </div>
        </Animated>;


        const locationAlert = <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
        <div className={`headingTxtBeacon `}>
          <div className="headingSection padtop-80">
            <div className="widgetAlert">
              <h4>{reqLanguage.locationAlertHeader}</h4>
              <div><img src="/images/ic-store.png" alt="welcomeImage"/></div>
              <div className='unableSubHead'><p>{reqLanguage.enableLocation}</p></div>
              <div className='unableContent' >
                <p>{reqLanguage.locationAlertContent}</p>
              </div>
              <div className="btnContainer"> <button className="btn btn-primary" onClick={() => ApiClient.doReload()}>{reqLanguage.tryAgain}</button>
              </div>
            </div>
          </div>
        </div>
        </Animated>;


        const loader = <div className="loaderContainer">
          <div className="loaderContent">
             <img src="/images/loader.gif" alt="loader" />
          </div>
        </div>;

    return (
			<div className="headingSection" >
        {(IsFBMSN && this.state.locationAccessAllowed) ? fromFBMSNWrap : notFromFBMSNWrap }
        {!this.state.locationAccessAllowed && locationAlert}
        {this.state.displayLoader && loader}
			</div>
    );
  }
}

export default ScanedProduct;
