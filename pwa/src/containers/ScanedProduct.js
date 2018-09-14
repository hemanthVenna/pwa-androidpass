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

  	componentDidMount() {
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
              that.setState({wishList: productsList, storeId: res.data.nearestStoreId, loaded: true});
              /*const uagent = navigator.userAgent.toLowerCase();
              let isiPhone = includes(uagent, appConstants.iphone);
              if(isiPhone){ */
                that.createPass(currentParams, res.data.data);
              // }
			     	} else {
			      	alert(userLanguage.en.saveSessionErr);
			      }	
			  	});
		  	}, (error) => {
		  		alert(userLanguage.en.browserSettingErr);
	      });
	    }else{
        alert(userLanguage.en.useAnotherBrowser);
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
                  'jwtString' : 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwcm9kdWN0LWluZm9AcG9wY29ybm1zLTIxMjgwOS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsImF1ZCI6Imdvb2dsZSIsImlhdCI6MTUzNjczNzcyMywidHlwIjoic2F2ZXRvYW5kcm9pZHBheSIsInBheWxvYWQiOnsibG95YWx0eU9iamVjdHMiOlt7ImFjY291bnRJZCI6IkhQIFNwZWN0cmUgWDM2MCAxMy4zLWluY2ggMi1pbi0xIE1vZGVybiBQQyBMYXB0b3AgLSBpNSIsImFjY291bnROYW1lIjoiSFAgU3BlY3RyZSBYMzYwIDEzLjMtaW5jaCAyLWluLTEgTW9kZXJuIFBDIExhcHRvcCAtIGk1IiwiYmFyY29kZSI6eyJhbHRlcm5hdGVUZXh0IjoiaHR0cHM6Ly9tcnJkZXZwd2EuYXp1cmV3ZWJzaXRlcy5uZXQvYmVhY29uLXNjYW4vYTNkZTk3OTItYmQ2Yy00MDdiLWJlYTItMDgwNjNmODYzZjZlL2ZhbHNlIiwidHlwZSI6InFyQ29kZSIsInZhbHVlIjoiaHR0cHM6Ly9tcnJkZXZwd2EuYXp1cmV3ZWJzaXRlcy5uZXQvYmVhY29uLXNjYW4vYTNkZTk3OTItYmQ2Yy00MDdiLWJlYTItMDgwNjNmODYzZjZlL2ZhbHNlIn0sImNsYXNzSWQiOiIzMjkzNTU4OTg1OTAzMTIxNDU1LjgxYTIyZmI0LTdiNDctNDJhMC1iMjAwLTNhYjY0NGUyNmIxNCIsImlkIjoiMzI5MzU1ODk4NTkwMzEyMTQ1NS45MDBkMTgyYS1hOGIxLTQxNjEtYTJmOC1jYjhiNTFiMGEyMGEiLCJsaW5rc01vZHVsZURhdGEiOnsidXJpcyI6W3siZGVzY3JpcHRpb24iOiJUYXAgdG8gZmluZCB5b3VyIGRldmljZSIsInVyaSI6Imh0dHBzOi8vbXJyZGV2cHdhLmF6dXJld2Vic2l0ZXMubmV0L2JlYWNvbi1zY2FuL2EzZGU5NzkyLWJkNmMtNDA3Yi1iZWEyLTA4MDYzZjg2M2Y2ZS9mYWxzZSJ9XX0sInN0YXRlIjoiYWN0aXZlIiwidGV4dE1vZHVsZXNEYXRhIjpbeyJib2R5IjoiUHJvZHVjdCBEZXRhaWxzIDogQ29udG9zbyBhbmQgaXRzIHdlYnNpdGUsIGNvbnRvc28uY29tLCBhcmUgdXNlZCBpbiBkb2N1bWVudGF0aW9uIGFuZCBoZWxwIGZpbGVzIGZvciBtYW55IE1pY3Jvc29mdCBwcm9kdWN0cy4gQ29udG9zbyB3ZWJzaXRlIHJlZGlyZWN0cyB0byBtaWNyb3NvZnQuY29tIiwiaGVhZGVyIjoiVGVybXMifV0sInZlcnNpb24iOjF9XSwib2ZmZXJPYmplY3RzIjpbXSwiZ2lmdENhcmRPYmplY3RzIjpbXX0sIm9yaWdpbnMiOlsiaHR0cDovL21ycmRldmFwaS5henVyZXdlYnNpdGVzLm5ldCIsImh0dHA6Ly9tcnJkZXZwd2EuYXp1cmV3ZWJzaXRlcy5uZXQiLCJodHRwOi8vMTAuMTAuNi42NC9NUlIiLCJodHRwOi8vbG9jYWxob3N0OjUwNzMzIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwMCJdfQ.XjwOwXO4joWPN_2v4aAWCBbvtdSrVe2UwvMG5hGQPkXgcgomunCfeoUI48oCv3GsVoo55NlJ4ctJdqEwGtbdpsiBGICEWaeWFp8EuH9yaXM2hZHjYFkUCQcdsjj-VZrvwYAevTAc7_HjcM5mVVOFneYr6fu0AkrQCA632cM_LblryItj75hWSTxxuf7V9IPaBCsWiuoQIF2Afuc4zzOJSK0F0uVXyny2GQh7EaqOb9TglmjNBqoOw0M2Ld6UdY0VJKkuKie40A6zMbbPBtzluOcXEnWRDpz6W5n7KyTUQb4XnBg2AXm_ibwlewwDSEvkuxO6xIxxHefUMJvsaIQsTQ'
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
    return (
			<div className="headingSection" >
      <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
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
        </Animated>
			</div>
    );
  }
}

export default ScanedProduct;
