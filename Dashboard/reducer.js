/*
 *
 * Dashboard reducer
 *
 */

import { fromJS } from 'immutable';
import moment from 'moment';
import {
  SET_SHOW_MODAL,
  SET_WIDGET_SECTION,
  SET_VALID_WIDGETS,
  SET_WIDGET_INDEX,
  SET_BLACKBOARD_GROUP_ID,
  FETCH_BLACKBOARD_GROUPS,
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

const initialState = fromJS({
  error: null,
  blackboard: fromJS({
    groupId: null,
    groups: fromJS([]),
    messages: fromJS([]),
    selectedGroup: null,
    loading: false,
    hasMore: false,
    hasPermissionToAddMessages: false,
    deletingBlackboardMessageId: null,
  }),
  tasks: fromJS({
    taskList: fromJS([]),
    loading: false,
    hasMore: false,
    offset: 0,
  }),
  recentlyVisitedEntities: fromJS({
    entities: fromJS([]),
    loading: false,
    hasMore: false,
    offset: 0,
  }),
  recentActivitiesHistory: fromJS({
    recentActivitiesHistoryList: fromJS([]),
    loading: false,
    hasMore: false,
    offset: 0,
  }),
  widgets: fromJS({
    large: [{}],
    small: [{}, {}, {}],
    medium: [{}, {}],
  }),
  showModal: false,
  widgetSection: null,
  widgetIndex: null,
  validWidgets: fromJS([]),
});

function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SHOW_MODAL: {
      if (action.status === ACTION_STATUS_PENDING) {
        return state.set('showModal', action.show);
      }
      return state;
    }
    case SET_WIDGET_SECTION: {
      if (action.status === ACTION_STATUS_PENDING) {
        return state.set('widgetSection', action.section);
      }
      return state;
    }
    case SET_WIDGET_INDEX: {
      if (action.status === ACTION_STATUS_PENDING) {
        return state.set('widgetIndex', action.index);
      }
      return state;
    }
    case SET_VALID_WIDGETS: {
      if (action.status === ACTION_STATUS_PENDING) {
        return state.set('validWidgets', fromJS(action.widgets));
      }
      return state;
    }
    case SET_BLACKBOARD_GROUP_ID: {
      if (action.status === ACTION_STATUS_PENDING) {
        return state.setIn(['blackboard', 'groupId'], action.groupId);
      }
      return state;
    }
    case FETCH_BLACKBOARD_GROUPS: {
      if (action.status === ACTION_STATUS_PENDING) {
        return state
          .set('error', null)
          .setIn(['blackboard', 'selectedGroup'], null)
          .setIn(['blackboard', 'groups'], fromJS([]))
          .setIn(['blackboard', 'messages'], fromJS([]))
          .setIn(['blackboard', 'loading'], true);
      } else if (action.status === ACTION_STATUS_SUCCESS) {
        return state
          .setIn(['blackboard', 'groups'], fromJS(action.blackboardGroups))
          .setIn(['blackboard', 'loading'], false)
          .setIn(['blackboard', 'messages'], fromJS(action.blackboardGroups
            .reduce((arr, group) => [...arr, ...group.blackboards], [])
            .sort((a, b) => moment(a.createdAt).diff(moment(b.createdAt)) > 0 ? -1 : 1)));
      } else if (action.status === ACTION_STATUS_ERROR) {
        return state
          .setIn(['blackboard', 'loading'], false)
          .set('error', action.error.toString());
      }
      return state;
    }
    case SET_BLACKBOARD_PERMISSION_TO_ADD_MESSAGES: {
      if (action.status === ACTION_STATUS_PENDING) {
        return state.setIn(['blackboard', 'hasPermissionToAddMessages'], action.permission);
      }
      return state;
    }
    case ADD_BLACKBOARD_MESSAGE: {
      if (action.status === ACTION_STATUS_PENDING) {
        return state.set('error', null);
      } else if (action.status === ACTION_STATUS_SUCCESS) {
        const blackboardMessages = state.getIn(['blackboard', 'messages']);
        const isSelectedGroup = state.getIn(['blackboard', 'selectedGroup']);
        const sameAsActionGroupId = (groupId) => groupId === action.blackboardMessage.groupId;
        const hasMessageWithActionGroupId = blackboardMessages.some((message) => sameAsActionGroupId(message.get('groupId')));

        if (!isSelectedGroup && hasMessageWithActionGroupId) {
          return state.setIn(['blackboard', 'messages'], blackboardMessages
            .map((message) => sameAsActionGroupId(message.get('groupId')) ? fromJS(action.blackboardMessage) : message)
            .sort((a, b) => moment(a.get('createdAt')).diff(moment(b.get('createdAt'))) > 0 ? -1 : 1));
        }

        return state.setIn(['blackboard', 'messages'], fromJS([action.blackboardMessage, ...blackboardMessages]));
      } else if (action.status === ACTION_STATUS_ERROR) {
        return state.set('error', action.error.toString());
      }
      return state;
    }
    case SET_DELETING_BLACKBOARD_MESSAGE_ID: {
      if (action.status === ACTION_STATUS_PENDING) {
        return state.setIn(['blackboard', 'deletingBlackboardMessageId'], action.blackboardId);
      }
      return state;
    }
    case DELETE_BLACKBOARD_MESSAGE: {
      if (action.status === ACTION_STATUS_PENDING) {
        return state.set('error', null);
      } else if (action.status === ACTION_STATUS_SUCCESS) {
        return state.setIn(['blackboard', 'messages'], state.getIn(['blackboard', 'messages'])
          .filter((blackboard) => blackboard.get('blackboardId') !== action.blackboardId));
      } else if (action.status === ACTION_STATUS_ERROR) {
        return state.set('error', action.error.toString());
      }
      return state;
    }
    case FETCH_BLACKBOARD_MESSAGES: {
      if (action.status === ACTION_STATUS_PENDING) {
        return state
          .setIn(['blackboard', 'loading'], true)
          .setIn(['blackboard', 'messages'], action.offset === 0 ? fromJS([]) : state.getIn(['blackboard', 'messages']));
      } else if (action.status === ACTION_STATUS_SUCCESS) {
        return state
          .setIn(['blackboard', 'messages'], fromJS([...state.getIn(['blackboard', 'messages']), ...action.blackboardMessages]))
          .setIn(['blackboard', 'selectedGroup'], action.groupId)
          .setIn(['blackboard', 'hasMore'], action.hasMore)
          .setIn(['blackboard', 'loading'], false);
      } else if (action.status === ACTION_STATUS_ERROR) {
        return state
          .setIn(['blackboard', 'loading'], false)
          .set('error', action.error.toString());
      }
      return state;
    }
    case FETCH_TASKS: {
      if (action.status === ACTION_STATUS_PENDING) {
        return state
          .setIn(['tasks', 'loading'], true)
          .setIn(['tasks', 'offset'], action.offset)
          .setIn(['tasks', 'taskList'], action.offset === 0 ? fromJS([]) : state.getIn(['tasks', 'taskList']))
          .set('error', null);
      } else if (action.status === ACTION_STATUS_SUCCESS) {
        return state
          .setIn(['tasks', 'taskList'], fromJS([...state.getIn(['tasks', 'taskList']), ...action.taskList]))
          .setIn(['tasks', 'hasMore'], action.hasMore)
          .setIn(['tasks', 'loading'], false);
      } else if (action.status === ACTION_STATUS_ERROR) {
        return state
          .setIn(['tasks', 'loading'], false)
          .set('error', action.error.toString());
      }
      return state;
    }
    case FETCH_RECENTLY_VISITED_ENTITIES: {
      if (action.status === ACTION_STATUS_PENDING) {
        return state
          .setIn(['recentlyVisitedEntities', 'loading'], true)
          .setIn(['recentlyVisitedEntities', 'offset'], action.offset)
          .setIn(['recentlyVisitedEntities', 'entities'], action.offset === 0
            ? fromJS([])
            : state.getIn(['recentlyVisitedEntities', 'entities']))
          .set('error', null);
      } else if (action.status === ACTION_STATUS_SUCCESS) {
        return state
          .setIn(
            ['recentlyVisitedEntities', 'entities'],
            fromJS([...state.getIn(['recentlyVisitedEntities', 'entities']), ...action.recentlyVisitedEntities])
          )
          .setIn(['recentlyVisitedEntities', 'hasMore'], action.hasMore)
          .setIn(['recentlyVisitedEntities', 'loading'], false)
          .set('error', null);
      } else if (action.status === ACTION_STATUS_ERROR) {
        return state
          .setIn(['recentlyVisitedEntities', 'loading'], false)
          .set('error', action.error.toString());
      }
      return state;
    }
    case FETCH_RECENT_ACTIVITIES_HISTORY: {
      if (action.status === ACTION_STATUS_PENDING) {
        return state
          .setIn(['recentActivitiesHistory', 'loading'], true)
          .setIn(['recentActivitiesHistory', 'offset'], action.offset)
          .setIn(
            ['recentActivitiesHistory', 'recentActivitiesHistoryList'],
            action.offset === 0 ? fromJS([]) : state.getIn(['recentActivitiesHistory', 'recentActivitiesHistoryList'])
          )
          .set('error', null);
      } else if (action.status === ACTION_STATUS_SUCCESS) {
        return state
          .setIn(
            ['recentActivitiesHistory', 'recentActivitiesHistoryList'],
            fromJS([...state.getIn(['recentActivitiesHistory', 'recentActivitiesHistoryList']), ...action.recentActivitiesHistoryList])
          )
          .setIn(['recentActivitiesHistory', 'hasMore'], action.hasMore)
          .setIn(['recentActivitiesHistory', 'loading'], false);
      } else if (action.status === ACTION_STATUS_ERROR) {
        return state
          .setIn(['recentActivitiesHistory', 'loading'], false)
          .set('error', action.error.toString());
      }
      return state;
    }
    case FETCH_WIDGETS: {
      if (action.status === ACTION_STATUS_PENDING) {
        return state
          .set('error', null);
      } else if (action.status === ACTION_STATUS_SUCCESS) {
        return state
          .set('widgets', fromJS(action.widgets));
      } else if (action.status === ACTION_STATUS_ERROR) {
        return state
          .set('error', action.error.toString());
      }
      return state;
    }
    case SET_WIDGETS: {
      if (action.status === ACTION_STATUS_PENDING) {
        return state
          .set('widgets', action.widgets)
          .set('error', null);
      } else if (action.status === ACTION_STATUS_ERROR) {
        return state
          .set('error', action.error.toString());
      }
      return state;
    }
    default:
      return state;
  }
}

export default dashboardReducer;
