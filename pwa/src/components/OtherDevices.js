import React, { Component } from "react";
import userLanguage from '../helpers/languageConstants.js';
class OtherDevices extends Component {
  constructor(props){
    super(props);
    this.state = {
      displayLoader : true,
      language:'en'
    }
  }
  componentDidMount(){
    this.setState({displayLoader : false})
  }
  callNotification = (product, simillar) => {
    this.setState({displayLoader : true})
    this.props.clickHandler(product, simillar);
  }
  render() {
    const {otherDeviceList, simillar} = this.props;
    const reqLanguage = userLanguage[this.state.language];
    const displayData = otherDeviceList.length > 0 ? otherDeviceList.map((product, index) => (
        <div className="topAlign" key={product.Id.toString()}>
          <div className={`widget topRow`}>
            <div className="deviceImg"><img src={product.DeviceImage ? product.DeviceImage : '/images/hpLaptop.png'} alt={product.DeviceName} title={product.DeviceName} /></div>
            <h2 className="productTitle">{product.DeviceName}</h2>
            <h4>{product.Categories}</h4>
            <button className="btn active" onClick={() => this.callNotification(product, simillar)}>{reqLanguage.tapFind}</button>
          </div>
        </div>
    )) : '';

    const loader = <div className="loaderContainer">
      <div className="loaderContent">
         <img src="/images/loader.gif" alt="loader" />
      </div>
    </div>;

    return (
      <div>
         {(displayData) ? displayData : ''}
         {this.state.displayLoader && loader}
      </div>
    );
  }
}

export default OtherDevices;
