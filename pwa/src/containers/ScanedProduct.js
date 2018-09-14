import React, { Component } from "react";
/*import { map, indexOf}  from 'lodash';
import deviceData from '../helpers/data/devices';*/
import $ from 'jquery';
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
        jwtString: ''
  		};
      // this.androidPay = React.createRef();
  	}

    componentWillMount(){
      console.log(navigator.userAgent)
      const userAgent = navigator.userAgent.toLowerCase();
      const IsFBMSN = includes(userAgent,'FBAN/FBIOS');
      // alert("please don't use FB browser")

    }

  	componentDidMount() {
      const userAgent = navigator.userAgent.toLowerCase();
      const IsFBMSN = includes(userAgent,'FBAN/FBIOS');
      if(IsFBMSN){

      $('.HiaYvf-LgbsSe .kcZgp-LgbsSe .n2to0e .P0Lgcb .Wetbn .skIXFc-ktSouf-wcotoc-WGXQb .MEDVr-LgbsSe-bN97Pc .Wetbn-LgbsSe-bN97Pc .KVuj8d-tSZMSb .MEDVr-LgbsSe-bN97Pc .LgbsSe-bN97Pc ').click(function(){
        console.log("button clicked")
      })
      $('.kcZgp-LgbsSe').click(function(){
        console.log("button clicked")
      })
      $("#___savetoandroidpay_0").click(function(){
        console.log("button clock")
      })
      let currentParams = this.props.match.params;
  		let sessionId = (!isUndefined(currentParams.sessionId) && !isEmpty(currentParams.sessionId)) ? currentParams.sessionId : '';
      console.log(appConstants);
      document.cookie = appConstants.sessionCookie+"=" + sessionId+ ";path=/;";
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
	        //currentParams = { latitude: "17.425646", longitude: "78.4201999", sessionId:sessionId };
	        currentParams = { latitude: position.coords.latitude, longitude: position.coords.longitude, sessionId:sessionId };  
          console.log('currentParams11')
          console.log(currentParams)
	        const that = this;
	        ApiClient.apiPost(ApiEndPoints.DevicesBySessionId, currentParams).then(function(res) {
            console.log("device session")
            console.log(res)
			  		if(res.data.data.length > 0) {
              const productsList = res.data.data.length > 0 ? res.data.data.filter((item) => {
                  if(item.Id !== null){
                    return item; 
                  }else{
                    return null
                  } 
              }) : [];
              that.setWishlistCookies(productsList);
              that.setState({wishList: productsList, storeId: res.data.nearestStoreId, loaded: true});
              /*const uagent = navigator.userAgent.toLowerCase();
              let isiPhone = includes(uagent, appConstants.iphone);
              if(isiPhone){ */
                that.createPass(currentParams, res.data.data);
              // }
			     	} else {
			      	alert("111"+userLanguage.en.saveSessionErr);
			      }	
			  	});
		  	}, (error) => {
		  		alert(userLanguage.en.browserSettingErr);
	      });
	    }else{
        alert(userLanguage.en.useAnotherBrowser);
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
    					alert(userLanguage.en.passNotCreated);
    				}
  		  	});
        }
        let isAndroid = includes(uagent,appConstants.android);
        console.log("input param")
        console.log(inputParam)
        if(isAndroid){
          ApiClient.apiPost(ApiEndPoints.CreateandroidPass, inputParam).then(function(res) {
            if(res.status === 200){
              console.log('request success')
              console.log(res)
              // that.assignWalletPass(res.data.jwt);
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
    AndAPI(){
      console.log("loyalti save clicked")
    }

  render() {
  	const { wishList, activePass } = this.state;
  	const storeId = this.state.storeId ? this.state.storeId : '';
  	const displayText = wishList.length > 0 ? wishList : '';
  	const uagent = navigator.userAgent.toLowerCase();
  	let isiPhone = includes(uagent, appConstants.iphone);
  	let downloadPass = (isiPhone && !isEmpty(activePass)) ? true : false;
    const userAgent = navigator.userAgent.toLowerCase();
      const IsFBMSN = includes(userAgent,'FB'); // 'FBAN/FBAS'
    const notFromFBMSNWrap = <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
        { downloadPass ? <iframe width="1" height="1" src={activePass} title="test"></iframe> : '' }
        <div className={`headingTxtBeacon ${!displayText ? 'bgWhite' : ''}`}>
          { displayText ?
            <div className="padtop-80">
              <div className="bgWhite">
                <h1>{userLanguage.en.oneStepAway}</h1>
                <div className="deviceTxt">{userLanguage.en.saveForInStoreExp}</div>
              </div>
              <div className="grayBg">
                <Handoff wishlistData={displayText} appConstants={appConstants} storeId={storeId} isIos={isiPhone} walletClickHandler={this.assignWalletPass}/>
              </div>
            </div> : ''
          }
          <div id='loyalty'></div>
          <div>
          </div>
        </div>
      </Animated>;
      const fromFBMSNWrap = <div className={`headingTxtBeacon `}><div className="padtop-80" style={{marginTop:'100px'}}><div className="bgWhite">U r from fb</div></div></div>
    return (
			<div className="headingSection" >
      {IsFBMSN ? fromFBMSNWrap : notFromFBMSNWrap }
			</div>
    );
  }
}

export default ScanedProduct;
