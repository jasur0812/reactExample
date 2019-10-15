import { createSelector } from 'reselect';

const selectDashboard = (state) => state.get('dashboard');

const makeSelectShowModal = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.get('showModal'),
);

const makeSelectWidgetSection = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.get('widgetSection'),
);

const makeSelectWidgetIndex = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.get('widgetIndex'),
);

const makeSelectValidWidgets = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.get('validWidgets'),
);

const makeSelectBlackboardGroupId = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.getIn(['blackboard', 'groupId']),
);

const makeSelectBlackboardGroups = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.getIn(['blackboard', 'groups']),
);

const makeSelectBlackboardPermissionToAddMessages = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.getIn(['blackboard', 'hasPermissionToAddMessages']),
);

const makeSelectBlackboardMessages = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.getIn(['blackboard', 'messages']),
);

const makeSelectBlackboardDeletingMessageId = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.getIn(['blackboard', 'deletingBlackboardMessageId']),
);

const makeSelectBlackboardSelectedGroup = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.getIn(['blackboard', 'selectedGroup']),
);

const makeSelectBlackboardHasMore = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.getIn(['blackboard', 'hasMore']),
);

const makeSelectBlackboardLoading = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.getIn(['blackboard', 'loading']),
);

const makeSelectError = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.get('error')
);

const makeSelectTasksList = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.getIn(['tasks', 'taskList']),
);

const makeSelectTasksHasMore = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.getIn(['tasks', 'hasMore']),
);

const makeSelectTasksLoading = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.getIn(['tasks', 'loading']),
);

const makeSelectTasksOffset = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.getIn(['tasks', 'offset']),
);

const makeRecentlyVisitedEntitiesList = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.getIn(['recentlyVisitedEntities', 'entities'])
);

const makeRecentlyVisitedEntitiesLoading = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.getIn(['recentlyVisitedEntities', 'loading'])
);

const makeSelectHasMoreRecentlyVisitedEntities = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.getIn(['recentlyVisitedEntities', 'hasMore'])
);

const makeSelectRecentlyVisitedEntitiesOffset = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.getIn(['recentlyVisitedEntities', 'offset']),
);

const makeRecentActivitiesHistoryList = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.getIn(['recentActivitiesHistory', 'recentActivitiesHistoryList']),
);

const makeRecentActivitiesHistoryHasMore = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.getIn(['recentActivitiesHistory', 'hasMore']),
);

const makeRecentActivitiesHistoryOffset = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.getIn(['recentActivitiesHistory', 'offset']),
);

const makeRecentActivitiesHistoryLoading = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.getIn(['recentActivitiesHistory', 'loading']),
);
const makeSelectWidgets = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.get('widgets')
);


export {
  makeSelectShowModal,
  makeSelectWidgetSection,
  makeSelectWidgetIndex,
  makeSelectValidWidgets,
  makeSelectBlackboardGroupId,
  makeSelectBlackboardGroups,
  makeSelectBlackboardPermissionToAddMessages,
  makeSelectBlackboardMessages,
  makeSelectBlackboardDeletingMessageId,
  makeSelectBlackboardSelectedGroup,
  makeSelectBlackboardHasMore,
  makeSelectBlackboardLoading,
  makeSelectTasksOffset,
  makeSelectError,
  makeSelectTasksList,
  makeSelectTasksHasMore,
  makeSelectTasksLoading,
  makeRecentlyVisitedEntitiesList,
  makeRecentlyVisitedEntitiesLoading,
  makeSelectHasMoreRecentlyVisitedEntities,
  makeSelectRecentlyVisitedEntitiesOffset,
  makeRecentActivitiesHistoryList,
  makeRecentActivitiesHistoryHasMore,
  makeRecentActivitiesHistoryOffset,
  makeRecentActivitiesHistoryLoading,
  makeSelectWidgets,
};
