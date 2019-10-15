import React, { Component } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col, UncontrolledTooltip } from 'reactstrap';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import VisibilitySensor from 'react-visibility-sensor';
import {
  makeRecentlyVisitedEntitiesList,
  makeRecentlyVisitedEntitiesLoading,
  makeSelectHasMoreRecentlyVisitedEntities,
  makeSelectRecentlyVisitedEntitiesOffset,
} from '../../selectors';
import { fetchRecentlyVisitedEntities } from '../../actions';
import messages from '../../messages';
import './recentlyVisitedEntities.scss';
import { makeSelectCurrentUser } from '../../../SessionProvider/selectors';
import { DEFAULT_SCROLLER_LIMIT } from '../../constants';
import { generateUriByEntityType } from '../../../../helpers/generateUri';

class RecentlyVisitedEntities extends Component {
  componentDidMount() {
    const { loadRecentlyVisitedEntities } = this.props;
    loadRecentlyVisitedEntities(0);
  }

  handleLoadRecentlyVisitedEntities = (isVisible) => {
    const { loadRecentlyVisitedEntities, loading, offset } = this.props;

    if (isVisible && !loading) {
      loadRecentlyVisitedEntities(offset + DEFAULT_SCROLLER_LIMIT);
    }
  };

  renderLoading = () => (
    <h4 className="text-center">
      <i className="fa-spin fa fa-spinner" /> <FormattedMessage {...messages.loading} />...
    </h4>
  );

  renderRecentlyVisitedEntities() {
    const { recentlyVisitedEntities, loading } = this.props;

    if (recentlyVisitedEntities.size === 0 && loading) {
      return this.renderLoading();
    } else if (recentlyVisitedEntities.size === 0) {
      return <FormattedMessage {...messages.noRecentlyVisitedEntities} />;
    }

    return (
      <div className="dashboardWidgets__list px-3">
        <div>
          {recentlyVisitedEntities.map((entity) => (
            <Link
              to={generateUriByEntityType(entity.get('entityType'), entity.get('entityId')) || '/dashboard'}
              key={entity.get('recentlyVisitedEntityId')}
            >
              <Row
                className={`dashboardWidget dashboardWidgets__entityItem dashboardWidget__${entity.get('entityType')}Item`}
                key={`${entity.get('entityId')}_${entity.get('entityType')}`}
              >
                <Col xs={2} className="px-0 dashboardWidget__type">
                  <div className="dashboardWidget__type">
                    <FormattedMessage {...messages[entity.get('entityType')]} />
                  </div>
                </Col>
                <Col xs={6}>
                  {entity.get('name')}
                </Col>
                <Col sm={4} className="text-right">
                  <span className="dashboardWidget_date" title="Zuletzt angesehen">
                    <FormattedDate
                      value={entity.get('visitedAt')}
                      day="2-digit"
                      month="2-digit"
                      year="numeric"
                      hour="2-digit"
                      minute="2-digit"
                      hour12={false}
                    />
                  </span>
                </Col>
              </Row>
            </Link>
          ))}
        </div>
        {this.props.hasMore && (
          <VisibilitySensor onChange={this.handleLoadRecentlyVisitedEntities} >
            {this.renderLoading()}
          </VisibilitySensor>
        )}
      </div>
    );
  }

  render() {
    const { name, onRemoveWidget } = this.props;

    return (
      <div className="dashboardWidgets">
        <div className="dashboardWidgets__header mx-3">
          <h4>{name}</h4>
          <div onClick={onRemoveWidget} role="button" tabIndex="-11">
            <i className="fa fa-trash-alt" id="remove-recently-visited-entities" />
          </div>
          <UncontrolledTooltip placement="right" target="remove-recently-visited-entities">
            <FormattedMessage {...messages.remove} />
          </UncontrolledTooltip>
        </div>
        {this.renderRecentlyVisitedEntities()}
      </div>
    );
  }
}

RecentlyVisitedEntities.propTypes = {
  name: PropTypes.string.isRequired,
  loadRecentlyVisitedEntities: PropTypes.func.isRequired,
  recentlyVisitedEntities: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  loading: PropTypes.bool,
  hasMore: PropTypes.bool,
  currentUser: PropTypes.object,
  onRemoveWidget: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  recentlyVisitedEntities: makeRecentlyVisitedEntitiesList(),
  loading: makeRecentlyVisitedEntitiesLoading(),
  hasMore: makeSelectHasMoreRecentlyVisitedEntities(),
  offset: makeSelectRecentlyVisitedEntitiesOffset(),
  currentUser: makeSelectCurrentUser(),
});

const mapDispatchToProps = (dispatch) => ({
  loadRecentlyVisitedEntities: (offset) => dispatch(fetchRecentlyVisitedEntities(offset)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecentlyVisitedEntities);
