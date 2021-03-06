import React, {Component} from 'react';
import Votes from './mobileVotes';
import MobileDefault from './mobileDefault';

class MobileVotesScreen extends Component {
  render() {

    const players = [];
    this.props.gameData.players.forEach(player => {
      if (this.props.gameData.playerGuess[player.name] && player.name !== this.props.gameData.mainPlayer) {
        players.push(player);
      }
    });

    const guesses = players.map(player => (
      <Votes key={player.name} player={player.name} guess={this.props.gameData.playerGuess[player.name]} gameData={this.props.gameData} addPoints={this.props.addPoints}/>
      ));



    if (!this.props.gameData.playerVote[this.props.gameData.mainPlayer]) {
      return (
        <div className="mobile-votes-container">
          {guesses}
        </div>
      );
    }

    return (
      <div>
        <MobileDefault />
      </div>
    );
  }
}
export default MobileVotesScreen;