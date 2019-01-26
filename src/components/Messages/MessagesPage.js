import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { withAuthorization, withEmailVerification } from '../Session'
import { withFirebase } from '../Firebase'
import Messages from '../Messages'

class MessagesPage extends Component {
  componentDidMount () {
    this.unsubscribe = this.props.firebase
      .users()
      .onSnapshot(snapshot => {
        let users = {}
        snapshot.forEach(doc => (users[doc.id] = doc.data()))
        this.props.onSetUsers(users)
      })
  }

  componentWillUnmount () {
    this.unsubscribe()
  }

  render () {
    if (this.props.users === null) {
      return null
    }

    return (
      <div>
        <h1>Messages Page</h1>
        <p>The Messages Page is accessible by every signed in user.</p>

        <Messages users={this.props.users} />

      </div>
    )
  }
}

const mapStateToProps = state => ({
  users: state.userState.users
})

const mapDispatchToProps = dispatch => ({
  onSetUsers: users => dispatch({ type: 'USERS_SET', users })
})

const condition = authUser => !!authUser

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withEmailVerification,
  withAuthorization(condition)
)(MessagesPage)
