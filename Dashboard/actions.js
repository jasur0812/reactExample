/*
 *
 * Dashboard actions
 *
 */

import {
  SET_SHOW_MODAL,
  SET_WIDGET_SECTION,
  SET_VALID_WIDGETS,
  SET_WIDGET_INDEX,
  FETCH_BLACKBOARD_GROUPS,
  SET_BLACKBOARD_GROUP_ID,
  SET_BLACKBOARD_PERMISSION_TO_ADD_MESSAGES,
  ADD_BLACKBOARD_MESSAGE,
  SET_DELETING_BLACKBOARD_MESSAGE_ID,
  DELETE_BLACKBOARD_MESSAGE,
  FETCH_BLACKBOARD_MESSAGES,
  FETCH_TASKS,
  FETCH_RECENTLY_VISITED_ENTITIES,
  FETCH_RECENT_ACTIVITIES_HISTORY,
  FETCH_WIDGETS,
  SET_WIDGETS,
  ACTION_STATUS_PENDING,
  ACTION_STATUS_ERROR,
  ACTION_STATUS_SUCCESS,
} from './constants';

export function setShowModal(show) {
  return {
    type: SET_SHOW_MODAL,
    status: ACTION_STATUS_PENDING,
    show,
  };
}

export function setWidgetSection(section) {
  return {
    type: SET_WIDGET_SECTION,
    status: ACTION_STATUS_PENDING,
    section,
  };
}

export function setWidgetIndex(index) {
  return {
    type: SET_WIDGET_INDEX,
    status: ACTION_STATUS_PENDING,
    index,
  };
}

export function setValidWidgets(widgets) {
  return {
    type: SET_VALID_WIDGETS,
    status: ACTION_STATUS_PENDING,
    widgets,
  };
}

export function fetchBlackboardGroups() {
  return {
    type: FETCH_BLACKBOARD_GROUPS,
    status: ACTION_STATUS_PENDING,
  };
}

export function fetchBlackboardGroupsSuccess(blackboardGroups) {
  return {
    type: FETCH_BLACKBOARD_GROUPS,
    status: ACTION_STATUS_SUCCESS,
    blackboardGroups,
  };
}

export function fetchBlackboardGroupsError(error) {
  return {
    type: FETCH_BLACKBOARD_GROUPS,
    status: ACTION_STATUS_ERROR,
    error,
  };
}

export function setBlackboardGroupId(groupId) {
  return {
    type: SET_BLACKBOARD_GROUP_ID,
    status: ACTION_STATUS_PENDING,
    groupId,
  };
}

export function setBlackboardPermissionToAddMessages(permission) {
  return {
    type: SET_BLACKBOARD_PERMISSION_TO_ADD_MESSAGES,
    status: ACTION_STATUS_PENDING,
    permission,
  };
}

export function addBlackboardMessage(message, groupId) {
  return {
    type: ADD_BLACKBOARD_MESSAGE,
    status: ACTION_STATUS_PENDING,
    message,
    groupId,
  };
}

export function addBlackboardMessageSuccess(blackboardMessage, groupId) {
  return {
    type: ADD_BLACKBOARD_MESSAGE,
    status: ACTION_STATUS_SUCCESS,
    blackboardMessage,
    groupId,
  };
}

export function addBlackboardMessageError(error) {
  return {
    type: ADD_BLACKBOARD_MESSAGE,
    status: ACTION_STATUS_ERROR,
    error,
  };
}

export function setDeletingBlackboardMessageId(blackboardId) {
  return {
    type: SET_DELETING_BLACKBOARD_MESSAGE_ID,
    status: ACTION_STATUS_PENDING,
    blackboardId,
  };
}

export function deleteBlackboardMessage(blackboardId) {
  return {
    type: DELETE_BLACKBOARD_MESSAGE,
    status: ACTION_STATUS_PENDING,
    blackboardId,
  };
}

export function deleteBlackboardMessageSuccess(blackboardId) {
  return {
    type: DELETE_BLACKBOARD_MESSAGE,
    status: ACTION_STATUS_SUCCESS,
    blackboardId,
  };
}

export function deleteBlackboardMessageError(error) {
  return {
    type: DELETE_BLACKBOARD_MESSAGE,
    status: ACTION_STATUS_ERROR,
    error,
  };
}

export function fetchBlackboardMessages(groupId, limit, offset) {
  return {
    type: FETCH_BLACKBOARD_MESSAGES,
    status: ACTION_STATUS_PENDING,
    groupId,
    limit,
    offset,
  };
}

export function fetchBlackboardMessagesSuccess(blackboardMessages, groupId, hasMore) {
  return {
    type: FETCH_BLACKBOARD_MESSAGES,
    status: ACTION_STATUS_SUCCESS,
    blackboardMessages,
    groupId,
    hasMore,
  };
}

export function fetchBlackboardMessagesError(error) {
  return {
    type: FETCH_BLACKBOARD_MESSAGES,
    status: ACTION_STATUS_ERROR,
    error,
  };
}

export function fetchTasks(offset) {
  return {
    type: FETCH_TASKS,
    status: ACTION_STATUS_PENDING,
    offset,
  };
}

export function fetchTasksSuccess(taskList, hasMore) {
  return {
    type: FETCH_TASKS,
    status: ACTION_STATUS_SUCCESS,
    taskList,
    hasMore,
  };
}

export function fetchTasksError(error) {
  return {
    type: FETCH_TASKS,
    status: ACTION_STATUS_ERROR,
    error,
  };
}

export function fetchRecentlyVisitedEntities(offset) {
  return {
    type: FETCH_RECENTLY_VISITED_ENTITIES,
    status: ACTION_STATUS_PENDING,
    offset,
  };
}

export function fetchRecentlyVisitedEntitiesSuccess(recentlyVisitedEntities, hasMore) {
  return {
    type: FETCH_RECENTLY_VISITED_ENTITIES,
    status: ACTION_STATUS_SUCCESS,
    recentlyVisitedEntities,
    hasMore,
  };
}

export function fetchRecentlyVisitedEntitiesError(error) {
  return {
    type: FETCH_RECENTLY_VISITED_ENTITIES,
    status: ACTION_STATUS_ERROR,
    error,
  };
}

export function fetchRecentActivitiesHistory(offset) {
  return {
    type: FETCH_RECENT_ACTIVITIES_HISTORY,
    status: ACTION_STATUS_PENDING,
    offset,
  };
}

export function fetchRecentActivitiesHistorySuccess(recentActivitiesHistoryList, hasMore) {
  return {
    type: FETCH_RECENT_ACTIVITIES_HISTORY,
    status: ACTION_STATUS_SUCCESS,
    recentActivitiesHistoryList,
    hasMore,
  };
}

export function fetchRecentActivitiesHistoryError(error) {
  return {
    type: FETCH_RECENT_ACTIVITIES_HISTORY,
    status: ACTION_STATUS_ERROR,
    error,
  };
}

export function fetchWidgets() {
  return {
    type: FETCH_WIDGETS,
    status: ACTION_STATUS_PENDING,
  };
}

export function fetchWidgetsSuccess(widgets) {
  return {
    type: FETCH_WIDGETS,
    status: ACTION_STATUS_SUCCESS,
    widgets,
  };
}

export function fetchWidgetsError(error) {
  return {
    type: FETCH_WIDGETS,
    status: ACTION_STATUS_ERROR,
    error,
  };
}

export function setWidgets(widgets) {
  return {
    type: SET_WIDGETS,
    status: ACTION_STATUS_PENDING,
    widgets,
  };
}

export function setWidgetsSuccess() {
  return {
    type: SET_WIDGETS,
    status: ACTION_STATUS_SUCCESS,
  };
}

export function setWidgetsError(error) {
  return {
    type: SET_WIDGETS,
    status: ACTION_STATUS_ERROR,
    error,
  };
}
