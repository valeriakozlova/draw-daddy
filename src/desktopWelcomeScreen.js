import React, { Component } from "react";
import JoinedUsers from './desktopJoinedUsers'

class DesktopWelcome extends Component {

  handleEvent = event => {
    this.props.changeGameStage("drawingStage");
  }

  render() {
    return (
    <div>
      <h1>Welcome to Draw Daddy</h1>
      <p>Go to this site on your mobile to play: www.whatever-we-want-this-to-be.com</p>
      <JoinedUsers />

      <button onClick={this.handleEvent}> Everyone's in! </button>
    </div>
    )
  }
}

export default DesktopWelcome;