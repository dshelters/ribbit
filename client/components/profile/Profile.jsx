import React from 'react';
import { connect } from 'react-redux';
import { getPreviousRoomNames } from './../../actions/actionCreators';
import ProfileRoomsList from './ProfileRoomsList';

    // {props.previousRoomNames.map(roomName => <div>{roomName}</div>)}

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="col-md-12 container-fluid text-intro left-side">
        <h1 className="text-center">{this.props.userName}'s Profile </h1>
        <div className="col-md-3 profile-borders profile-height">
          <ProfileRoomsList />
        </div>
        <div className="col-md-9 profile-borders profile-height">
          This is where the saved code and messages from each room would go
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  previousRoomNames: state.previousRoomNames,
  userName: state.userName
});

const mapDispatchToProps = dispatch => ({
  getPreviousRoomNames: () => dispatch(getPreviousRoomNames())
});

// export default Profile;
export default connect(mapStateToProps, mapDispatchToProps)(Profile);



        // {props.previousRoomNames.map(roomName => (
        //   <div className="black-text chat-message-container-other">
        //     {roomName}
        //   </div>))}
