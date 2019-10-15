/* eslint-disable react/no-array-index-key */
import React, { Fragment } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { fromJS } from 'immutable';

import { withNotifications } from '../NotificationsProvider';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectShowModal,
  makeSelectWidgetSection,
  makeSelectWidgetIndex,
  makeSelectValidWidgets,
  makeSelectError,
  makeSelectWidgets,
} from './selectors';
import './dashboard.scss';
import { componentByWidgetType } from './componentByWidgetType';
import messages from './messages';
import { makeSelectUnreadNotificationsCount } from '../UserNotifications/selectors';
import { getPageTitle } from '../../helpers/getPageTitle';
import { fetchWidgets, setWidgets, setShowModal, setWidgetSection, setWidgetIndex, setValidWidgets } from './actions';
import { widgetsCountBySection } from './constants';


export class Dashboard extends React.PureComponent {
  constructor(props) {
    super(props);

    this.options = {
      large: [
        { type: 'calendar' },
      ],
      small: [
        { type: 'tasks' },
        { type: 'recentlyVisitedEntities' },
      ],
      medium: [
        { type: 'blackboard' },
        { type: 'activityHistory' },
      ],
    };
  }

  componentDidMount() {
    this.props.dispatch(fetchWidgets());
  }

  componentDidUpdate(prevProps) {
    if (this.props.error !== prevProps.error) {
      this.props.notification.showNotification(this.props.error, 'error');
    }
  }

  onDragStart = (ev, index, section) => {
    const dragData = { from: index, section };
    ev.dataTransfer.setData('text', JSON.stringify(dragData));
  };

  onDragOver = (ev) => {
    ev.preventDefault();
  };

  onDragEnter = (ev, index, section) => {
    ev.preventDefault();
    this.onDropTarget = index;
    this.onDropTargetCategory = section;
  };

  onDrop = (ev) => {
    const dragData = JSON.parse(ev.dataTransfer.getData('text'));
    const fromCategory = dragData.section;
    if (fromCategory === this.onDropTargetCategory) {
      this.rearrangeItems(dragData.from, this.onDropTarget, fromCategory);
    }
    this.onDropTarget = null;
    this.onDropTargetCategory = null;
  };

  rearrangeItems = (moveFromIndex, moveToIndex, section) => {
    const { widgets, dispatch } = this.props;

    const firstItem = widgets.getIn([section, moveFromIndex]);
    const secondItem = widgets.getIn([section, moveToIndex]);

    let widgetsUpdated = widgets.setIn([section, moveToIndex], firstItem);
    widgetsUpdated = widgetsUpdated.setIn([section, moveFromIndex], secondItem);

    dispatch(setWidgets(widgetsUpdated));
  };

  addWidget = (e, item) => {
    const { widgets, index, section, dispatch } = this.props;

    const widgetsUpdated = widgets.setIn([section, index], item);

    dispatch(setShowModal(false));
    dispatch(setWidgetIndex(null));
    dispatch(setWidgets(widgetsUpdated));
  };

  removeWidget = (e, section, type) => {
    const { widgets, dispatch } = this.props;
    const getIndex = widgets.get(section).toJS().findIndex((x) => x.type === type);

    const widgetsUpdated = widgets.setIn([section, getIndex], fromJS({}));

    dispatch(setShowModal(false));

    this.props.dispatch(setWidgets(widgetsUpdated));
  };

  showModal = (e, section, index) => {
    const { widgets, dispatch } = this.props;
    const validWidgets = this.options[section].filter((c) => !widgets.get(section).toJS().map((a) => a.type).includes(c.type));

    dispatch(setShowModal(true));
    dispatch(setWidgetSection(section));
    dispatch(setWidgetIndex(index));
    dispatch(setValidWidgets(validWidgets));
  };

  hideModal = () => {
    const { dispatch } = this.props;
    dispatch(setShowModal(false));
  };

  render() {
    const { intl: { formatMessage }, countNewNotification, showModal, validWidgets } = this.props;
    const widgets = this.props.widgets;

    const pageContent = Object.keys(widgets.toJS()).map((section) => (<div key={`row-${section}`} className="row">
      {widgets.get(section).map((item, index) => {
        const sectionSize = widgetsCountBySection[section];
        let className = 'col-md-12';
        if (sectionSize > 1) {
          className = `col-md-${(12 / sectionSize)} col-sm-12`;
        }
        const Widget = componentByWidgetType[item.get('type')] || componentByWidgetType.default;
        return (
          <div
            key={`${section}-${index}`}
            onDragStart={(e) => this.onDragStart(e, index, section)}
            onDragEnter={(e) => { this.onDragEnter(e, index, section); }}
            draggable
            className={className}
            onDragOver={(e) => { this.onDragOver(e, index, section); }}
            onDrop={(e) => { this.onDrop(e, index, section); }}
          >
            <div className="widget-box">
              {item.get('type') && <Widget
                name={formatMessage(messages[item.get('type')])}
                onRemoveWidget={(e) => this.removeWidget(e, section, item.get('type'))}
              />}
              {!item.get('type') && <span role="presentation" onClick={(e) => this.showModal(e, section, index)} >
                <i className="fa fa-plus" aria-hidden="true" />
              </span>}
            </div>
          </div>
        );
      })
    }</div>
    ));

    return (
      <Fragment>
        <Helmet>
          <title>{getPageTitle(countNewNotification, formatMessage(messages.metaTitle))}</title>
        </Helmet>
        <div className="outer-bg">
          <div className="widgets-container-drag">
            {pageContent}
          </div>
          {showModal && <Modal toggle={this.hideModal} size="sm" centered isOpen={showModal} keyboard={true}>
            <ModalHeader toggle={this.hideModal} className="text-capitalize">{formatMessage(messages[this.props.section])}</ModalHeader>
            <ModalBody>
              <ul className="widget-picker">
                {validWidgets.map((item) => (
                  <li role="presentation" key={item.get('type')} onClick={(e) => this.addWidget(e, item)}>
                    {formatMessage(messages[item.get('type')])}
                  </li>
                ))}
              </ul>
            </ModalBody>
          </Modal>}
        </div>
      </Fragment>
    );
  }
}

Dashboard.propTypes = {
  error: PropTypes.string,
  notification: PropTypes.object.isRequired,
  intl: PropTypes.object,
  countNewNotification: PropTypes.number,
  widgets: PropTypes.object,
  dispatch: PropTypes.func,
  showModal: PropTypes.bool,
  section: PropTypes.string,
  index: PropTypes.number,
  validWidgets: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  error: makeSelectError(),
  widgets: makeSelectWidgets(),
  countNewNotification: makeSelectUnreadNotificationsCount(),
  showModal: makeSelectShowModal(),
  section: makeSelectWidgetSection(),
  index: makeSelectWidgetIndex(),
  validWidgets: makeSelectValidWidgets(),
});

const withConnect = connect(mapStateToProps);

const withReducer = injectReducer({ key: 'dashboard', reducer });

const withSaga = injectSaga({ key: 'dashboard', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withNotifications,
)(injectIntl(Dashboard));
