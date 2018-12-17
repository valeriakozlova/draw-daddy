import React, { Component } from 'react';

class JoinedUsers extends Component {
	render() {
		return (
			<div>
				<p>
					Users Joined:
					{this.props.players ? this.props.players.map((player) => player.name) : 'none yet'}
				</p>
			</div>
		);
	}
}

export default JoinedUsers;
