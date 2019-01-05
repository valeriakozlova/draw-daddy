import React, { Component } from "react";
import DesktopVotes from './desktopVotes';
import Timer from './desktopTimerFooter';
import Canvas from './canvas';


class DesktopVotingScreen extends Component {

  render() {

    const guesses = this.props.gameData.guessesDisplayed.map((guess, index) => (
      <DesktopVotes key={index} guess={guess}/>
    ));

    return (
      <div>
      <h1>What is it?</h1>
        <div id="canvas-votes-container">
            <Canvas gameData={this.props.gameData}/>
          <div id="desktop-votes-container">
            {guesses}
          </div>
        </div>
        <div>
          <Timer gameData={this.props.gameData} changeGameStage={this.props.changeGameStage} stage={"scoreStage"} resetTimer={this.props.resetTimer}/>
        </div>
      </div>
    )
  }
}

export default DesktopVotingScreen;
