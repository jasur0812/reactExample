import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createStructuredSelector } from 'reselect';
import VisibilitySensor from 'react-visibility-sensor';
import { fetchRecentActivitiesHistory } from '../../actions';
import {
  makeRecentActivitiesHistoryList,
  makeRecentActivitiesHistoryHasMore,
  makeRecentActivitiesHistoryLoading,
  makeRecentActivitiesHistoryOffset,
} from '../../selectors';
import messages from '../../messages';
import './activityHistory.scss';
import FormattedDate from '../../../../components/FormattedDate';
import { recentActivitiesHistoryMessages, activityLogIcon } from './activityHistoryHandler';
import { DEFAULT_SCROLLER_LIMIT } from '../../constants';

class ActivityHistory extends React.PureComponent {
  constructor(props) {
    super(props);
    this.recentActivitiesHistoryContainer = React.createRef();
  }

  componentDidMount() {
    const { loadRecentActivitiesHistory } = this.props;
    loadRecentActivitiesHistory(0);
  }

  loadMoreRecentActivitiesHistory = (isVisible) => {
    const { loadRecentActivitiesHistory, offset, loading } = this.props;

    if (isVisible && !loading) {
      loadRecentActivitiesHistory(offset + DEFAULT_SCROLLER_LIMIT);
    }
  };

  renderLoading = () => (
    <h4 className="text-center">
      <i className="fa-spin fa fa-spinner" /> <FormattedMessage {...messages.loading} />...
    </h4>
  );

  renderRecentActivitiesHistoryList() {
    const { recentActivitiesHistoryList, loading, hasMore } = this.props;

    if (recentActivitiesHistoryList.size === 0 && loading) {
      return this.renderLoading();
    } else if (recentActivitiesHistoryList.size === 0) {
      return <FormattedMessage {...messages.noRecentActivitiesHistory} />;
    }

    const renderActivityLogIcon = (activityType) => activityLogIcon(activityType) ?
      <span className="icon-area"><FontAwesomeIcon icon={activityLogIcon(activityType)} /></span>
        : '';

    const formatUserName = (user) => user
      ? `${user.get('firstName')} ${user.get('lastName')}`
      : (<FormattedMessage {...messages.unknownUser} />);

    const formatActivityLogEvent = (activityType) => recentActivitiesHistoryMessages[activityType].activityHistoryType
        ? <strong><FormattedMessage {...recentActivitiesHistoryMessages[activityType].activityHistoryType} /></strong>
        : '';

    const formatEntityType = (entityType) => <strong><FormattedMessage {...messages[entityType]} /></strong>;

    const formatEntityName = (entityName = 'Entity name') => <strong>{entityName}</strong>;

    return (
      <div className="activitiesHistory__list pl-3" ref={this.recentActivitiesHistoryContainer}>
        {recentActivitiesHistoryList.map((recentActivityHistory) => (
          <div key={recentActivityHistory.get('recentActivityId')}>
            <div className="row activityHistory">
              <div className="col-1 activityHistory__item">
                <span className={`activityHistory__${recentActivityHistory.get('referencedEntityType')}Item`}>&nbsp; </span>
              </div>
              <div className="col-1 activityHistory__item">
                {renderActivityLogIcon(recentActivityHistory.get('activityType'))}
              </div>
              <div className="col-8 activityHistory__item">
                <FormattedMessage
                  {...recentActivitiesHistoryMessages[recentActivityHistory.get('activityType')].activityHistoryMessage}
                  values={{
                    User: formatUserName(recentActivityHistory.get('createdBy')),
                    ActivityLogEvent: formatActivityLogEvent(recentActivityHistory.get('activityType')),
                    EntityType: formatEntityType(recentActivityHistory.get('referencedEntityType')),
                    EntityName: formatEntityName(recentActivityHistory.get('referencedEntityName')),
                  }}
                />
              </div>
              <div className="col-2 activityHistory__date">
                <FormattedDate value={recentActivityHistory.get('createdAt')} />
              </div>
            </div>
          </div>
        ))}
        {hasMore && (
          <VisibilitySensor onChange={this.loadMoreRecentActivitiesHistory} containment={this.recentActivitiesHistoryContainer.current}>
            {this.renderLoading()}
          </VisibilitySensor>
        )}
      </div>
    );
  }

  render() {
    const { name, onRemoveWidget } = this.props;

    return (
      <div className="activitiesHistory">
        <div className="activitiesHistory__header mx-3">
          <h4>{name}</h4>
          <div onClick={onRemoveWidget} role="button" tabIndex="-11">
            <i className="fa fa-trash-alt" id="remove-activity-history" />
          </div>
          <UncontrolledTooltip placement="right" target="remove-activity-history">
            <FormattedMessage {...messages.remove} />
          </UncontrolledTooltip>
        </div>
        {this.renderRecentActivitiesHistoryList()}
      </div>
    );
  }
}

ActivityHistory.propTypes = {
  name: PropTypes.string.isRequired,
  onRemoveWidget: PropTypes.func.isRequired,
  loadRecentActivitiesHistory: PropTypes.func.isRequired,
  recentActivitiesHistoryList: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  hasMore: PropTypes.bool,
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  recentActivitiesHistoryList: makeRecentActivitiesHistoryList(),
  hasMore: makeRecentActivitiesHistoryHasMore(),
  loading: makeRecentActivitiesHistoryLoading(),
  offset: makeRecentActivitiesHistoryOffset(),
});

const mapDispatchToProps = (dispatch) => ({
  loadRecentActivitiesHistory: (offset) => dispatch(fetchRecentActivitiesHistory(offset)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityHistory);
