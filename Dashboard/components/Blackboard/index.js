import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Input, UncontrolledTooltip } from 'reactstrap';
import Select from 'react-select';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import VisibilitySensor from 'react-visibility-sensor';
import classNames from 'classnames';

import Confirm from '../../../../components/Confirm';
import {
  setBlackboardGroupId, fetchBlackboardGroups, setBlackboardPermissionToAddMessages, addBlackboardMessage,
  setDeletingBlackboardMessageId, deleteBlackboardMessage, fetchBlackboardMessages,
} from '../../actions';
import {
  makeSelectBlackboardGroupId, makeSelectBlackboardGroups, makeSelectBlackboardPermissionToAddMessages,
  makeSelectBlackboardMessages, makeSelectBlackboardDeletingMessageId,
  makeSelectBlackboardSelectedGroup, makeSelectBlackboardHasMore,
  makeSelectBlackboardLoading,
} from '../../selectors';
import { makeSelectCurrentUser } from '../../../SessionProvider/selectors';
import messages from '../../messages';
import './blackboard.scss';
import { checkPermissions } from '../../../../helpers/permissionHelper';
import PermissionError from '../../../../components/PermissionError';

class Blackboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };
    this.limit = 20;
    this.offset = 0;
  }

  componentDidMount() {
    this.fetchGroups();
  }

  componentDidUpdate() {
    const { groupId, blackboardGroups, currentUser } = this.props;

    if (blackboardGroups.size > 0 && !groupId && currentUser) {
      this.setInitialGroup();
    }
  }

  onGroupSelect = (groupId) => {
    const { selectedGroup, dispatch } = this.props;

    if (selectedGroup) {
      this.showGroupMessages(groupId);
    } else {
      dispatch(setBlackboardGroupId(groupId));
    }
  };

  onMessageChange = (e) => {
    this.setState({ message: e.target.value });
  };

  onMessageDelete = () => {
    const { deletingBlackboardMessageId, dispatch } = this.props;

    dispatch(deleteBlackboardMessage(deletingBlackboardMessageId));
    this.hideDeleteModal();
  };

  onFormSubmit = (e) => {
    e.preventDefault();
    this.sendMessage();
  };

  setInitialGroup() {
    const { blackboardGroups, currentUser, dispatch } = this.props;
    const hasUsersAddMessagesPermission = checkPermissions(currentUser, 'messages', 'create');

    dispatch(setBlackboardGroupId(blackboardGroups.getIn([0, 'groupId'])));
    dispatch(setBlackboardPermissionToAddMessages(hasUsersAddMessagesPermission));
  }

  hideDeleteModal = () => {
    const { dispatch } = this.props;
    dispatch(setDeletingBlackboardMessageId(null));
  };

  showDeleteModal = (blackboardId) => () => {
    const { dispatch } = this.props;
    dispatch(setDeletingBlackboardMessageId(blackboardId));
  };

  sendMessage = () => {
    const { message } = this.state;
    const { groupId, dispatch } = this.props;

    const trimmedMessage = message.trim();
    if (groupId && trimmedMessage) {
      dispatch(addBlackboardMessage(trimmedMessage, groupId));
      this.setState({ message: '' });
    }
  };

  fetchGroups = () => {
    const { dispatch } = this.props;

    dispatch(fetchBlackboardGroups());
  };

  showGroupMessages = (groupId) => {
    const { dispatch } = this.props;

    this.offset = 0;
    dispatch(fetchBlackboardMessages(groupId, this.limit, this.offset));
    dispatch(setBlackboardGroupId(groupId));
  };

  fetchMoreBlackboardMessages = (isVisible) => {
    const { dispatch, selectedGroup } = this.props;

    if (isVisible) {
      this.offset += this.limit;
      dispatch(fetchBlackboardMessages(selectedGroup, this.limit, this.offset));
    }
  };

  renderLoading = () => (
    <h4 className="text-center">
      <i className="fa-spin fa fa-spinner" /> <FormattedMessage {...messages.loading} />...
    </h4>
  );

  renderMessages() {
    const { groupId, blackboardGroups, blackboardMessages, selectedGroup, currentUser, loading } = this.props;

    if (!groupId) return null;

    if (blackboardMessages.size === 0 && loading) {
      return this.renderLoading();
    } else if (blackboardMessages.size === 0) {
      return <FormattedMessage {...messages.noMessages} />;
    }

    const hasMessagesDeletePermission = checkPermissions(currentUser, 'messages', 'delete');

    const userColClassName = classNames('col-4', { blackboard__text_hover: !selectedGroup });

    return blackboardMessages.map((blackboard) => {
      const currentGroup = blackboardGroups.find((group) => group.get('groupId') === blackboard.get('groupId'));
      const isCreatedByCurrentUser = parseInt(currentUser.userId, 10) === parseInt(blackboard.get('createdBy'), 10);
      return (
        <div className="row" key={blackboard.get('blackboardId')}>
          <div
            className={userColClassName}
            onClick={() => !selectedGroup && this.showGroupMessages(currentGroup.groupId)}
            role="button"
            tabIndex="-11"
          >{currentGroup.get('name')}</div>
          <div className="col-7">{blackboard.get('message')}</div>
          {hasMessagesDeletePermission && selectedGroup && isCreatedByCurrentUser && (
            <div className="col-1 text-right" onClick={this.showDeleteModal(blackboard.get('blackboardId'))} role="button" tabIndex="-11">
              <i className="fa fa-trash-alt blackboard__text_hover" />
            </div>
          )}
        </div>
      );
    });
  }

  render() {
    const { message } = this.state;
    const {
      groupId,
      blackboardGroups,
      name,
      onRemoveWidget,
      selectedGroup,
      hasMore,
      currentUser,
      hasPermissionToAddMessages,
      deletingBlackboardMessageId,
    } = this.props;

    const hasMessagesReadPermission = checkPermissions(currentUser, 'messages', 'read');

    const selectGroupOptions = blackboardGroups.map((group) => ({ value: group.get('groupId'), label: group.get('name') }));
    return (
      <div className="blackboard text-left w-100">
        <div className="blackboard__header mx-3 d-flex justify-content-between">
          <h4>{name}</h4>
          <div className="col-1 text-right" onClick={onRemoveWidget} role="button" tabIndex="-11">
            <i className="fa fa-trash-alt blackboard__text_hover" id="remove-blackboard" />
          </div>
          <UncontrolledTooltip placement="right" target="remove-blackboard"><FormattedMessage {...messages.remove} /></UncontrolledTooltip>
        </div>
        {hasMessagesReadPermission && <React.Fragment>
          <div className="blackboard__body">
            {hasPermissionToAddMessages && (
              <div className="row mx-0 blackboard__bodyNewMessage">
                <div className="col-4">
                  <span className="blackboard__helperText"><FormattedMessage {...messages.newMessage} />:</span>
                  <Select
                    simpleValue
                    onChange={this.onGroupSelect}
                    value={groupId}
                    options={selectGroupOptions.toJS()}
                    clearable={false}
                    className="small"
                  />
                </div>
                <div className="col-8 blackboard__messageInput">
                  <form className="d-flex align-items-center w-100" onSubmit={this.onFormSubmit}>
                    <Input
                      className="text-left mb-0"
                      placeholder="Message"
                      value={message}
                      onChange={this.onMessageChange}
                    />
                    <div className="ml-3" role="button" tabIndex={-42} onClick={this.sendMessage}>
                      <i className="fa fa-paper-plane blackboard__text_hover" />
                    </div>
                  </form>
                </div>
              </div>
            )}
            <div className="mt-2 blackboard__bodyMain">
              <div className="px-3">
                <div className="row">
                  <div className="col-4"><span className="blackboard__helperText"><FormattedMessage {...messages.group} /></span></div>
                  <div className="col-8"><span className="blackboard__helperText"><FormattedMessage {...messages.message} /></span></div>
                </div>
              </div>
              <div className="px-3 blackboard__messages">
                {selectedGroup && (
                  <div className="row">
                    <div className="col-4" onClick={this.fetchGroups} role="button" tabIndex="-11">
                      <i className="fa fa-long-arrow-alt-left blackboard__text_hover" />
                    </div>
                  </div>
                )}
                {this.renderMessages()}
                {selectedGroup && hasMore && (
                  <VisibilitySensor onChange={this.fetchMoreBlackboardMessages}>
                    {this.renderLoading()}
                  </VisibilitySensor>
                )}
              </div>
            </div>
          </div>
          {deletingBlackboardMessageId && (
            <Confirm
              onCancel={this.hideDeleteModal}
              onConfirm={this.onMessageDelete}
              text={<FormattedMessage {...messages.areYouSureToDeleteMessage} />}
              title={<FormattedMessage {...messages.deletingMessage} />}
            />
          )}
        </React.Fragment>}
        {!hasMessagesReadPermission && <PermissionError
          text={<FormattedMessage {...messages.noPermissionToView} />}
        />}
      </div>
    );
  }
}

Blackboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  groupId: PropTypes.string,
  blackboardGroups: PropTypes.object.isRequired,
  hasPermissionToAddMessages: PropTypes.bool.isRequired,
  blackboardMessages: PropTypes.object.isRequired,
  deletingBlackboardMessageId: PropTypes.string,
  name: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
  onRemoveWidget: PropTypes.func.isRequired,
  selectedGroup: PropTypes.string,
  hasMore: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  groupId: makeSelectBlackboardGroupId(),
  blackboardGroups: makeSelectBlackboardGroups(),
  hasPermissionToAddMessages: makeSelectBlackboardPermissionToAddMessages(),
  blackboardMessages: makeSelectBlackboardMessages(),
  deletingBlackboardMessageId: makeSelectBlackboardDeletingMessageId(),
  selectedGroup: makeSelectBlackboardSelectedGroup(),
  currentUser: makeSelectCurrentUser(),
  hasMore: makeSelectBlackboardHasMore(),
  loading: makeSelectBlackboardLoading(),
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Blackboard);
