import React, { Component, Fragment } from 'react';
import './App.css';
import { BrowserView, MobileView } from 'react-device-detect';
import MobileMainView from './mobileMainView';
import DesktopMainView from './desktopMainView';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class App extends Component {
  //below is to set up cookies
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
	};

	constructor(props) {
    super(props);
    const { cookies } = props;
		this.state = {
			gameStage: '',
			mainPlayer: cookies.get('name') || '',
			players: [],
			currentPlayer: '',
			playerGuess: {},
			playerVote: {},
			line: [],
			timer: null
		};

		this.changeGameStage = this.changeGameStage.bind(this);
		this.takeTurns = this.takeTurns.bind(this);
		this.sendPaintData = this.sendPaintData.bind(this);
		this.addPoints = this.addPoints.bind(this);
		this.resetTimer = this.resetTimer.bind(this);
		this.socket = undefined;
	}

	static getHostName() {
		const parser = document.createElement('a');
		parser.href = document.location;
		return parser.hostname;
	}

	componentDidMount() {
		const hostname = App.getHostName();
		const port = 3001;
		this.socket = new WebSocket('ws://' + hostname + ':' + port);
		this.socket.onopen = function (event) {
			console.log('Connected to: ' + event.currentTarget.url);
		};
		this.socket.onmessage = (event) => {
			const message = JSON.parse(event.data);
			switch (message.type) {
				case 'welcomePack':
					this.setState({ gameStage: message.gameStage,
													players: message.players });
													//refactor
					this.setState({ currentPlayer: message.currentPlayer.name });
					this.setState({ playerGuess: message.playerGuess });
					this.setState({ playerVote: message.playerVote });
					this.setState({ line: message.line });
					this.setState({ timer: message.timer });
					break
				case 'updatePlayers':
					this.setState({ players: message.players });
					break;
				case 'updateVotes':
					this.setState({ playerVote: message.playerVote });
					break;
				case 'addGuess':
					this.setState({ playerGuess: message.playerGuess});
          break;
				case 'gameStage':
					this.setState({ gameStage: message.gameStage });
					break;
				case 'turns':
					this.setState({ currentPlayer: message.currentPlayer.name});
					this.setState({ line: [] });
					this.setState({ playerGuess: {} });
					this.setState({ playerVote: {} });
					break;
				case 'canvas':
					this.setState({ line: message.line});
					break;
				case 'timer':
					this.setState({ timer: message.timer});
					break;
				default:
					console.log("Unknown event type " + message.type);
			}
		};
	}

	takeTurns() {
		const takeTurns = { type: 'turns'};
		this.socket.send(JSON.stringify(takeTurns));
	}

	changeGameStage = (stage) => {
		const gameStage = {
			type: 'gameStage',
			gameStage: stage
		};
		this.socket.send(JSON.stringify(gameStage));
		this.setState({ gameStage: stage });
	}

	addPlayerName = (name) => {
    const { cookies } = this.props;
		cookies.set('name', name, { path: '/' });
		this.setState({ mainPlayer: name });
		const addPlayer = {
			type: 'addPlayer',
			player: name
		};
		this.socket.send(JSON.stringify(addPlayer));
	};

	addGuess = (guess) => {
    const setGuess = {
      type: 'addGuess',
      player: this.state.mainPlayer,
      guess
    };
    this.socket.send(JSON.stringify(setGuess));
	};

  sendPaintData = (line) => {
    const body = {
      type: "canvas",
      line: line
    };
    this.socket.send(JSON.stringify(body));
  }

	addPoints(points, player, mainPlayer) {
		const addPoints = {
      type: 'addPoints',
      player,
			points,
			mainPlayer
		};
		this.socket.send(JSON.stringify(addPoints));
	}

	resetTimer(){
		this.setState({ timer: "" });
	}

	render() {
		return (
			<Fragment >
				<BrowserView >
					<DesktopMainView gameData={this.state} changeGameStage={this.changeGameStage} takeTurns={this.takeTurns} resetTimer={this.resetTimer}/>
				</BrowserView>
				<MobileView >
					<MobileMainView gameData={this.state} addPlayerName={this.addPlayerName} sendPaintData={this.sendPaintData} addGuess={this.addGuess} changeGameStage={this.changeGameStage} addPoints={this.addPoints}/>
				</MobileView>
			</Fragment>
		);
	}
}

export default withCookies(App);

//can't enter the same name
// can't put the same guess into the system
// randomize guesses
// logic for the next round and timer

