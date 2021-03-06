import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import Profile from 'components/Profile';
import { getUser } from 'actions/usersActions';

const select = state => {
  const { username, firstName, lastName, imageUrl } = state.users.currentUser;
  const { activeUsers, gettingAUser } = state.users;
  return { username, firstName, lastName, imageUrl, activeUsers, gettingAUser };
};

const actions = {
  getUser
};

export default withRouter(connect(select, actions)(Profile));
