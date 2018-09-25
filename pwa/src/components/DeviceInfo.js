import React, { Component } from "react";
import {Animated} from 'react-animated-css';
import userLanguage from '../helpers/languageConstants.js';
class DeviceInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {activeKey: this.props.activeKey, selectedKey: '', deviceType: this.props.deviceType,displayLoader : true,language: 'en'};
  }

  selectDevice = (deviceData) => {
    //this.setState({activeKey: deviceData.deviceCode })
    this.props.clickHandler(deviceData);
    console.log('taptofind clicked')
    this.setState({displayLoader : true})
  }

  render() {
  	const {wishlistData} = this.props;
    const {journeyCompleted} = this.props;
    const reqLanguage = userLanguage[this.state.language];
    const displayData = wishlistData.length > 0 ? wishlistData.map((product, index) => (
         <div className="topAlign" key={product.Id.toString()} >
          <div className={journeyCompleted.indexOf(product.Id) > -1 ? 'greyBg widget topRow' : 'widget topRow'}>
            <div className="deviceImg"><img src={product.DeviceImage ? product.DeviceImage : '/images/hpLaptop.png'} alt={product.DeviceName} title={product.DeviceName} /></div>
            <h2 className="productTitle">{product.DeviceName}</h2>
            <h4>{product.Categories}</h4>
            {/*<h4>USD $200</h4>*/}
            <button className="btn active" onClick={() => this.selectDevice(product)}>{reqLanguage.tapFind}</button>
          </div>
        </div>
  	)) : '';

    return (
      <div>
      <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
        {(displayData) ? displayData : ''}
      </Animated>
      </div>
    );
  }
}

export default DeviceInfo;
