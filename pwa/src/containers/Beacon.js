import React, { Component } from "react";
import appConstants from "../helpers/appConstants";
//import {isEmpty, uniqWith,  isEqual, find, isUndefined, map, indexOf, includes}  from 'lodash';
import { isUndefined, isEmpty, includes }  from 'lodash';
import DeviceInfo from '../components/DeviceInfo';
import Notification from '../components/Notification';
import ExploreMore from '../components/ExploreMore';
// import NewsDescription from '../components/NewsDescription';
import ApiClient  from '../helpers/ApiClient';
import ApiEndPoints  from '../helpers/ApiEndPoints';
import {Animated} from 'react-animated-css';
import userLanguage from '../helpers/languageConstants.js';
class Beacon extends Component {
  	constructor(props) {
		super(props);
		this.state = {
			wishList: [],
			storeId: '',
			displayDetails: false,
			showList: false,
			showAtStore: false,
			isNotAvailable: false,
			selectedDevice: '',
			notificationSent: false,
			exploreMore: false,
			wayFinderSymbol: '',
			journeyCompletedId:'',
			isNotOnDisplay: false,
			locationAccessAllowed : true,
			locationAccessAllowedDuplicate : false,
			displayLoader : true,
			language : 'en',
			showConnectionAlert: false
		};
  	}

  	componentDidMount() {
  		var lang = navigator.language || navigator.userLanguage;
  		this.setState({language:lang})
  		let currentParams = this.props.match.params;
  		console.log(currentParams);
  		let sessionId = (!isUndefined(currentParams.sessionId) && !isEmpty(currentParams.sessionId)) ? currentParams.sessionId : ApiClient.getRequiredKeyCookieValue(appConstants.sessionCookie);
  		document.cookie = appConstants.sessionCookie+"=" + sessionId+ ";path=/;";
	    if (navigator.geolocation) {
	     	navigator.geolocation.getCurrentPosition((position) => {
	     		this.setState({locationAccessAllowed:true,locationAccessAllowedDuplicate:true});
		        currentParams = { latitude: position.coords.latitude, longitude: position.coords.longitude, sessionId:sessionId };
		       	//currentParams = { latitude: '17.425646', longitude: '78.41799', sessionId:sessionId };   
		        const that = this;
		        ApiClient.apiPost(ApiEndPoints.DevicesBySessionId, currentParams).then(function(res) {
			  		if(res.data.data.length > 0) {
			  			const productsList = res.data.data.length > 0 ? res.data.data.filter((item) => {
		                  	if(item.Id !== null){
		                    	return item; 
		                  	}else{
		                  		return null;
		                  	} 
			            }) : [];
			  			that.setWishlistCookies(productsList, appConstants.wishlistData);
			  			const showAtStore = (res.data.nearestStoreId === null) ? true : false;
			  			if(!showAtStore){
			     			//alert('show not in store');
			     			document.cookie = appConstants.storeId+"=" + res.data.nearestStoreId + ";path=/;";
			     		}
			     		let journeyCompletedIds = ApiClient.getRequiredKeyCookieValue(appConstants.journeyCompleted);
      					journeyCompletedIds = (journeyCompletedIds !== undefined && journeyCompletedIds !== '') ? journeyCompletedIds : '';
			     		let showList = (journeyCompletedIds !== '') ? true: false;
			  			that.setState({wishList: productsList, storeId: res.data.nearestStoreId, showList: showList,journeyCompletedId:journeyCompletedIds,displayLoader : false,});
			     	} else {
			      		alert(userLanguage[that.state.language].saveSessionErr);
			      	}	
			  	});
		  	}, (error) => {
		  		this.setState({locationAccessAllowed:false,displayLoader:false})
	      	});
	    }
  	}
  	handleCancel = () => {
  		this.setState({
			showAtStore: false,
			selectedDevice: '',
			notificationSent: false,
		});
  	}
 	handleClick = (selectedProduct) => {
 		if(!window.navigator.onLine){
 			console.log("no cnnection")
 			this.setState({
 				showConnectionAlert: true
 			})
 		}
 		this.setState({
			notificationSent: false,
			wayFinderSymbol: '',
			displayLoader : true
		});
 		let currentParams = this.props.match.params;
  		let sessionId = (!isUndefined(currentParams.sessionId) && !isEmpty(currentParams.sessionId)) ? currentParams.sessionId : ApiClient.getRequiredKeyCookieValue(appConstants.sessionCookie);
	    document.cookie = appConstants.sessionCookie+"=" + sessionId+ ";path=/;";
	    if (navigator.geolocation) {
	     	navigator.geolocation.getCurrentPosition((position) => {
		        currentParams = { latitude: position.coords.latitude, longitude: position.coords.longitude, sessionId:sessionId };
		        //currentParams = { latitude: '17.425646' , longitude: '78.41799', sessionId:sessionId };   
		        const that = this;
		        ApiClient.apiPost(ApiEndPoints.DevicesBySessionId, currentParams).then(function(res) {
			  		if(res.data.data.length > 0) {
			  			let showAtStore = (res.data.nearestStoreId === null) ? true : false;
			  			const productsList = res.data.data.length > 0 ? res.data.data.filter((item) => {
		                  	if(item.Id !== null){
		                    	return item; 
		                  	}else{
		                  		return null;
		                  	} 
			             }) : [];
			  			const isAvailableList = productsList.length > 0 ? productsList.filter((item) => {
		                  	if((item.Id === selectedProduct.Id) && (item.Status.toLowerCase() !== 'busy')){
		                    	return item; 
		                  	}else{
		                  		return null;
		                  	} 
			             }) : [];
			  			let busy = false;
			  			let isNotOnDisplay = false;
			  			const isOnDisplayList = productsList.length > 0 ? productsList.filter((item) => {
		                  	if((item.Id === selectedProduct.Id) && (item.IsDeviceOnDisplay)){
		                    	return item; 
		                  	}else{
		                  		return null;
		                  	} 
			            }) : [];
			  			if((res.data.nearestStoreId !== null) && (isOnDisplayList.length === 0)){
			  				isNotOnDisplay = true;
			  				let notOnDisplayIds = ApiClient.getRequiredKeyCookieValue(appConstants.notOnDisplay);
						    notOnDisplayIds = (notOnDisplayIds !== undefined && notOnDisplayIds !== '') ? notOnDisplayIds : '';
						    if(notOnDisplayIds === '') {
						      document.cookie = appConstants.notOnDisplay+"=" +selectedProduct.Id+ ";path=/;";
						    }else if(notOnDisplayIds !== '' && (notOnDisplayIds.indexOf(selectedProduct.Id) < 0)) {
						      let completedIds = notOnDisplayIds+','+this.selectedProduct.Id;
						      document.cookie = appConstants.notOnDisplay+"=" +completedIds+ ";path=/;";
						    }
			  			}
			  			if(!isNotOnDisplay){
				  			if((res.data.nearestStoreId !== null) && (isAvailableList.length === 0)){
				  				busy = true;
				  				let busyDevicesIds = ApiClient.getRequiredKeyCookieValue(appConstants.busyDevices);
							    busyDevicesIds = (busyDevicesIds !== undefined && busyDevicesIds !== '') ? busyDevicesIds : '';
							    if(busyDevicesIds === '') {
							      document.cookie = appConstants.busyDevices+"=" +selectedProduct.Id+ ";path=/;";
							    }else if(busyDevicesIds !== '' && (busyDevicesIds.indexOf(selectedProduct.Id) < 0)) {
							      let completedIds = busyDevicesIds+','+this.selectedProduct.Id;
							      document.cookie = appConstants.busyDevices+"=" +completedIds+ ";path=/;";
							    }
				  			}
			  			}
				  		
			  			that.setState({
			  				wishList: productsList, 
			  				storeId: res.data.nearestStoreId,
			  				showAtStore: showAtStore,
			  				selectedDevice: selectedProduct,
			  				isNotAvailable: busy,
			  				isNotOnDisplay: isNotOnDisplay,
			  				displayLoader : false
			  			});
			     		if(showAtStore || busy || isNotOnDisplay){
			     			//alert('show not in store');
			     		}else{
			     			that.callNotification(selectedProduct);
			     		}
			     	} else {
			      		alert(userLanguage[that.state.language].saveSessionErr);
			      	}	
			  	});
		  	}, (error) => {
		  		alert(userLanguage[this.state.language].browserSettingErr);
	      	});
	    }else{
        	alert(userLanguage[this.state.language].useAnotherBrowser);
      	}
	}
	setWishlistCookies = (data, cookieName) => {
		let wishlistIds = []
		data.forEach(function(val) { 
	        wishlistIds.push(val.Id);
	    });

      	wishlistIds = wishlistIds.join(',');
      	document.cookie = cookieName+"=" + wishlistIds + ";path=/;";
    }
	callNotification = (deviceData) => {
	    const payload = {
	      "make": this.state.selectedDevice.Make,
	      "model": this.state.selectedDevice.RDXModel,
	      "storeId": this.state.storeId 
	    };
	    this.setState({displayLoader: true})
	    ApiClient.apiPost(ApiEndPoints.SendRawNotification, payload).then((res) => {
	        if(res.status === 200){
				this.setState({
					notificationSent: true,
					wayFinderSymbol: res.data.wayFinderSymbol,
					displayLoader: false
				});
				let journeyObj = {'deviceId': deviceData.Id, 'stage': '2'}
				document.cookie = appConstants.journeyStage+"=" +JSON.stringify(journeyObj)+ ";path=/;";
	        }else{
	        	alert(userLanguage[this.state.language].unableAlert)
	        }
	    });
	}
	backButtonClick = () => {
  		this.setState({displayDetails: false});
		window.scrollTo(0, 0);
  	}
  	showList = () => { 
    	this.setState({
      		showList: true,
      		isNotAvailable: false,
      		isNotOnDisplay: false,
      	});
  	}
  	exploreMoreAction = () => {
  		this.setState({
      		exploreMore: true,
      		isNotAvailable: false,
      		isNotOnDisplay: false,
      	});
  	}
  	getDispayData() {
  		console.log();
  	}
  	render() {
  		const wishList = this.state.wishList.length > 0 ? this.state.wishList : '';
	  	const showListFlag = this.state.showList;
	  	const uagent = navigator.userAgent.toLowerCase();
  		const isiPhone = includes(uagent, appConstants.iphone);
	  	const { displayLoader, isNotOnDisplay, showAtStore, showConnectionAlert, selectedDevice, notificationSent, wayFinderSymbol, isNotAvailable, exploreMore} = this.state;
	  	const journeyCompletedId = this.state.journeyCompletedId ? this.state.journeyCompletedId : '';

	  	const loader = <div className="loaderContainer">
          <div className="loaderContent">
             <img src="/images/loader.gif" alt="loader" />
          </div>
        </div>;
        const connectionAlert = <div className="loaderContainer">
          <div className="loaderContent">
             <img src="/images/loader.gif" alt="loader" />
             <p>connection failed</p>
          </div>
        </div>;

        const reqLanguage = userLanguage[this.state.language]

	  	return (
	      	<div className="headingSection" >
	      	{(this.state.locationAccessAllowed && this.state.locationAccessAllowedDuplicate) && 
	      	<Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
	      		{ (showListFlag && !isNotAvailable && !isNotOnDisplay) ?
	      			<div className={ showAtStore ? 'none' : '' }> 
	      			{ (!this.state.displayDetails && !notificationSent && !exploreMore) ?
			      		<div>
				      		<div className="headingTxtmini">
				      			<div>
					        		<h1>{reqLanguage.youMadeIt}</h1>
				      			</div>
					        	<div className="deviceTxt">{reqLanguage.successMsgCaption1} <span className="blue">{reqLanguage.blueLight}</span> {reqLanguage.successMsgCaption2}</div>
				      		</div>
				      		{wishList ? <DeviceInfo wishlistData={wishList} activeKey="1" clickHandler={this.handleClick} deviceType={isiPhone} journeyCompleted={journeyCompletedId}/> : ''} 
			      		</div> : '' 
		      		} </div> : 
		      		<div>
				      	<div className={ (isNotAvailable || isNotOnDisplay || displayLoader) ? 'none' : '' }>
				        	<div> 
				          		<div className="widgetAlert">
						            <h4>{reqLanguage.welcomeHeader}</h4>
						            <div><img src="/images/ic-welcome.png" alt="welcomeImage"/></div>
						            <h6>{reqLanguage.welcomeMsg}</h6>
						            <div className="btnContainer"> 
						            	<button className="btn btn-primary"  onClick={() => this.showList()}>{reqLanguage.iAmHere}</button>
						            </div>
					            </div>
				          	</div>
				        </div>
			      	</div>
	      		}
	      		<div className = {!showAtStore ? 'none' : ''}>
		      		<div>
				      	<div className="widgetAlert">
				            <h4>{reqLanguage.atStore}</h4>
				            <div><img src="/images/ic-store.png" alt="storeImage"/></div>
				            <h6>{reqLanguage.atStoreHeader}</h6>
				            <p>{reqLanguage.atStoreSubHeader}</p>
				            <div className="btnContainer"> 
				            	<button className="btn btn-primary" onClick={() => this.handleClick(selectedDevice)}>{reqLanguage.tryAgain}</button>
				            </div>
				        </div>
				   	</div>
				</div>
				{isNotOnDisplay ? 
					<div>
				      	<div className="widgetAlert">
				            <h4>{reqLanguage.unavailable}</h4>
				            <div><img src="/images/ic-busy.png" alt="storeImage"/></div>
				            <h6>{reqLanguage.currentlyNotOnDisplayForDemo}</h6>
				            <p>{reqLanguage.likeToExploreSimilar}</p>
				            <div className="btnContainer"> 
				            	<button className="btn btn-primary" onClick={() => this.exploreMoreAction()}>{reqLanguage.tapToExplore}</button>
				            	<button className="btn btn-cancel"  onClick={() => this.showList()}>{reqLanguage.cancel}</button>
				            </div>
				        </div>
				   	</div> : ''
				}
				<div className = { isNotAvailable ? '' : 'none'}>
		      		<div className="widgetAlert">
			            <h4>{reqLanguage.busy}</h4>
			            <div><img src="/images/ic-busy.png" alt="storeImage"/></div>
			            <h6>{reqLanguage.busyHeader}</h6>
			            <p>{reqLanguage.busySubHeader}</p>
			            <div className="btnContainer"> 
			            	<button className="btn btn-primary" onClick={() => this.exploreMoreAction()}>{reqLanguage.tapToExplore}</button>
			            	<button className="btn btn-cancel"  onClick={() => this.showList()}>{reqLanguage.cancel}</button>
			            </div>
			        </div>
				</div>
				{notificationSent ? <Notification productData={selectedDevice} wayFinderSymbol={wayFinderSymbol} clickHandler={this.handleCancel} notificationClickHandler={this.handleClick} appConstants={appConstants}/> : ''}
				{ exploreMore  ? <ExploreMore clickHandler={this.backButtonClick}/> : '' }
	      	</Animated>
            }
            { !this.state.locationAccessAllowed &&
	      	 <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
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
		    </Animated> }

		    {displayLoader && loader}
		    {showConnectionAlert && connectionAlert}
	      	</div>	
	    );
  	}
}

export default Beacon;
