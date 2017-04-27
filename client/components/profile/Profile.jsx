import React from 'react';
import { connect } from 'react-redux';
import { getPreviousRoomNames, addPeerRoomData, listPeerNames, addPeerMessages, addPeerCode } from './../../actions/actionCreators';
import ProfileRoomsList from './ProfileRoomsList';
import ProfilePartnersList from './ProfilePartnersList';
import ProfileCodeLog from './ProfileCodeLog';
import ProfileMessageLog from './ProfileMessageLog';
import socket from '../../clientUtilities/sockets';


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.requestRoomData = this.requestRoomData.bind(this);
    this.populateRoomData = this.populateRoomData.bind(this);
    this.separateData = this.separateData.bind(this);
  }

  componentDidMount() {
    socket.on('room data sent', this.populateRoomData);
  }

  requestRoomData(room) {
    // this function will be invoked onClick of the room name listed in ProfileRoomsListItem
    const payload = {
      userName: this.props.userName,
      roomName: room
    };
    socket.emit('grab room data', payload);
  }

  populateRoomData(payload) {
    // send names from the messages to store
    const peerNames = [];
    payload.forEach((chunk) => {
      if (!peerNames.includes(chunk.user2name)) {
        peerNames.push(chunk.user2name);
      }
    });
    this.props.listPeerNames(peerNames);
    // create object out of data blob from server
    const peerData = {};
    payload.forEach((chunk) => {
      const data = { type: chunk.type, data: chunk.data, id: chunk.mcid, user1name: chunk.user1name, user2name: chunk.user2name };
      peerData[chunk.user2name] = (peerData[chunk.user2name] || []).concat(data);
    });
    this.props.addPeerData(peerData);
  }

  separateData(peer) {
    // get the code/messages for just one peer
    const peerDataArray = this.props.peerData[peer];
    
    // separate messages from code
    const messages = peerDataArray.filter((data) => {
      if (data.type === 'message') {
        return data;
      }
    }).sort((a, b) => a.id - b.id);
    this.props.addPeerMessages(messages);

    // separate code from messages
    const code = peerDataArray.filter((data) => {
      if (data.type === 'code') {
        return data;
      }
    })[0].data;
    this.props.addPeerCode(code);

  }

  render() {
    return (
      <div className="col-md-12 container-fluid text-intro left-side">
        <h1 className="text-center">{this.props.userName}'s Profile </h1>
        <div className="col-md-2 ">
          <div className="profile-background">
            <ProfileRoomsList requestRoomData={this.requestRoomData} />
          </div>
          <div className="profile-background profile-margin" >
            <ProfilePartnersList separateData={this.separateData} />
          </div>
        </div>
        <div className="col-md-offset-1 col-md-4 profile-background">
          <ProfileCodeLog code={this.props.peerCode} />
        </div>
        <div className="col-md-offset-1 col-md-4 profile-background">
          <ProfileMessageLog messages={this.props.peerMessages} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  previousRoomNames: state.previousRoomNames,
  userName: state.userName,
  peerNames: state.peerNames,
  peerMessages: state.peerMessages,
  peerCode: state.peerCode,
  peerData: state.peerData
});

const mapDispatchToProps = dispatch => ({
  getPreviousRoomNames: () => dispatch(getPreviousRoomNames()),
  addPeerRoomData: peerData => dispatch(addPeerRoomData(peerData)),
  listPeerNames: names => dispatch(listPeerNames(names)),
  addPeerMessages: msgs => dispatch(addPeerMessages(msgs)),
  addPeerCode: code => dispatch(addPeerCode(code))
});

// export default Profile;
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
