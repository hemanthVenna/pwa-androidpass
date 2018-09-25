import React, { Component } from "react";
import userLanguage from '../helpers/languageConstants.js';
class AlertContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      language : 'en'
    }
  }
  render() {
    const reqLanguage = userLanguage[this.state.language];
    return (
      <div className="headingSection padtop-80" >
        <div>
          <div>
          {/* Hexagon Widget */}
          <div className="widget activeborder">
          <div className="widgetContents">              
            <div className="hexagonContents">
              <div className="hexaBg"><img src="images/hexagon.png" alt="hexagon" /></div>
              <div className="devImg"><img src="/images/hpLaptop.png" alt="hpLaptop" /></div>
            </div>
            <h4>HP Spectre x360 15</h4>
            <div className="hexagonImg">
            </div>        
          </div>
          </div>
          {/*  welcome Alert */} 
          <div className="widgetAlert none">
            <h4>{reqLanguage.welcomeHeader}</h4>
            <div><img src="images/ic-welcome.png" alt="welcomeImage"/></div>
            <h6>{reqLanguage.welcomeMsg}</h6>
            <div className="btnContainer"> <button className="btn btn-primary">{reqLanguage.iAmHere}</button>
            </div>
          </div>
          {/*  At the store Alert */}
          <div className="widgetAlert none">
            <h4>{reqLanguage.atStore}</h4>
            <div><img src="images/ic-store.png" alt="storeImage"/></div>
            <h6>{reqLanguage.atStoreHeader}</h6>
            <p>{reqLanguage.atStoreSubHeader}</p>
            <div className="btnContainer"> <button className="btn btn-primary">{reqLanguage.tryAgain}</button>
            </div>
          </div>

          {/*  It's busy Alert */}
          <div className="widgetAlert">
            <h4>{reqLanguage.busy}</h4>
            <div><img src="images/ic-busy.png" alt="storeImage"/></div>
            <h6>{reqLanguage.busyHeader}</h6>
            <p>{reqLanguage.busySubHeader}</p>
            <div className="btnContainer"> 
              <button className="btn btn-primary">{reqLanguage.tapToExplore}</button>
              <button className="btn btn-cancel">{reqLanguage.cancel}</button>
            </div>
          </div>

          {/*  It's available Alert */}
          <div className="widgetAlert none">
            <h4>{reqLanguage.available}</h4>
            <div><img src="images/ic-select.png" alt="storeImage"/></div>
            <h6>{reqLanguage.availHeader}</h6>
            <p>{reqLanguage.availSubHeader}</p>
            <div className="btnContainer"> <button className="btn btn-primary">{reqLanguage.guideMe}</button>
            </div>
          </div>

        {/*  It's unavailable Alert */}
          <div className="widgetAlert none">
            <h4>{reqLanguage.unavailable}</h4>
            <div><img src="images/ic-busy.png" alt="storeImage"/></div>
            <h6>{reqLanguage.notFoundOnDemo}</h6>
            <p>{reqLanguage.likeToExploreSimilar}</p>
            <div className="btnContainer"> <button className="btn btn-primary">{reqLanguage.tapToExplore}</button>
            </div>
          </div>

        </div>
        </div>
      </div>
    );
  }
}

export default AlertContainer;
