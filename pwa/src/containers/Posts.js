import React, { Component } from "react";
import userLanguage from '../helpers/languageConstants.js';
class Posts extends Component {
	constructor(props){
    super(props);
    this.state = {
      language : 'en'
    }
  }
  render() {
  	const reqLanguage = userLanguage[this.state.language];
    return (
      <React.Fragment>
        <div style={{ textAlign: "center",marginTop:'10rem' }}>
          <h1>{reqLanguage.postsHeader}</h1>
        </div>
      </React.Fragment>
    );
  }
}

export default Posts;
