import React, { Component } from "react";
//import userLanguage from '../helpers/languageConstants.js';
class ExperienceDevices extends Component {
  render() {
    const {experienceDeviceList, activeKey} = this.props;
    const displayData = experienceDeviceList.length > 0 ? experienceDeviceList.map((product, index) => (
        <div className="topAlign" key={product.Id.toString()}>
          <div className={`widget topRow`}>
            <div className="deviceImg"><img src={product.DeviceImage ? product.DeviceImage : '/images/hpLaptop.png'} alt={product.DeviceName} title={product.DeviceName} /></div>
            <h2 className="productTitle">{product.DeviceName}</h2>
            <h4>{product.Categories}</h4>
            {/*<h4>USD $200</h4>*/}
            {(activeKey === '1' && !product.showAddr) ?
              <div className="panoramaContent">
                <div className="panoramaleft">
                  <div className="cityName">{product.City}</div>
                  <div className="distance">{product.Distance} miles</div>
                </div>
                <div className="panoramaright">
                  <div className="address">{product.StoreName} </div>
                  <div className="address">{product.Address}</div>
                  <div className="time">{product.closeStatus}</div>
                </div>
              </div>
            : ''}
            {/*<button className="btn active" onClick={() => this.selectDevice(product)}>{userLanguage.en.tapFind}</button>*/}
          </div>
        </div>
    )) : '';
    //const {deviceInfo} = this.props;
    return (
      <div>
         {(displayData) ? displayData : ''}
      </div>
    );
  }
}

export default ExperienceDevices;
