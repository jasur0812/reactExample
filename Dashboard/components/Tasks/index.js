import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { UncontrolledTooltip } from 'reactstrap';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import VisibilitySensor from 'react-visibility-sensor';
import classNames from 'classnames';
import { fetchTasks } from '../../actions';
import { makeSelectTasksList, makeSelectTasksHasMore, makeSelectTasksLoading, makeSelectTasksOffset } from '../../selectors';
import { DEFAULT_SCROLLER_LIMIT } from '../../constants';
import messages from '../../messages';
import RichTextValue from '../../../../components/RichText/RichTextValue';
import './tasks.scss';

class Tasks extends Component {
  constructor(props) {
    super(props);

    this.taskListContainer = React.createRef();
  }

  componentDidMount() {
    const { loadTasks } = this.props;

    loadTasks(0);
  }

  loadMoreTasks = (isVisible) => {
    const { loadTasks, loading, offset } = this.props;

    if (isVisible && !loading) {
      loadTasks(offset + DEFAULT_SCROLLER_LIMIT);
    }
  };

  renderLoading() {
    return (
      <h4 className="text-center">
        <i className="fa-spin fa fa-spinner" /> <FormattedMessage {...messages.loading} />...
      </h4>
    );
  }

  renderTaskList() {
    const { taskList, loading, hasMore } = this.props;

    if (taskList.size === 0 && loading) {
      return this.renderLoading();
    } else if (taskList.size === 0) {
      return <FormattedMessage {...messages.noTasks} />;
    }

    return (
      <ul className="dashboardTasks__list px-3" ref={this.taskListContainer}>
        {taskList.map((task) => {
          const dueDate = moment(task.get('dueDate'));
          const taskDateClassName = classNames('dashboardTask__date', { dashboardTask__date_red: moment().isAfter(dueDate) });
          return (
            <li key={task.get('taskId')} className="dashboardTask">
              <Link to={`/tasks/${task.get('taskId')}`}>
                <RichTextValue value={task.get('subject')} />
              </Link>
              <span className={taskDateClassName}>
                {dueDate.format('DD.MM.YYYY')}
              </span>
            </li>
          );
        })}
        {hasMore && (
          <VisibilitySensor onChange={this.loadMoreTasks} containment={this.taskListContainer.current}>
            {this.renderLoading()}
          </VisibilitySensor>
        )}
      </ul>
    );
  }

  render() {
    const { name, onRemoveWidget } = this.props;

    return (
      <div className="dashboardTasks">
        <div className="dashboardTasks__header mx-3">
          <h4>{name}</h4>
          <div onClick={onRemoveWidget} role="button" tabIndex="-11">
            <i className="fa fa-trash-alt" id="remove-task" />
          </div>
          <UncontrolledTooltip placement="right" target="remove-task">
            <FormattedMessage {...messages.remove} />
          </UncontrolledTooltip>
        </div>
        {this.renderTaskList()}
      </div>
    );
  }
}

Tasks.propTypes = {
  name: PropTypes.string.isRequired,
  onRemoveWidget: PropTypes.func.isRequired,
  loadTasks: PropTypes.func.isRequired,
  taskList: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  hasMore: PropTypes.bool,
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  taskList: makeSelectTasksList(),
  hasMore: makeSelectTasksHasMore(),
  loading: makeSelectTasksLoading(),
  offset: makeSelectTasksOffset(),
});

const mapDispatchToProps = (dispatch) => ({
  loadTasks: (offset, statusList) => dispatch(fetchTasks(offset, statusList)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
