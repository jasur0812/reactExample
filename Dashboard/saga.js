import config from 'config';
import { put, takeLatest } from 'redux-saga/effects';
import { safeCall } from 'utils/authentication';
import { authRequest } from 'utils/request';
import {
  FETCH_BLACKBOARD_GROUPS,
  ADD_BLACKBOARD_MESSAGE,
  DELETE_BLACKBOARD_MESSAGE,
  FETCH_BLACKBOARD_MESSAGES,
  FETCH_TASKS,
  DEFAULT_SCROLLER_LIMIT,
  FETCH_RECENTLY_VISITED_ENTITIES,
  FETCH_RECENT_ACTIVITIES_HISTORY,
  FETCH_WIDGETS,
  SET_WIDGETS,
  ACTION_STATUS_PENDING,
  widgetsCountBySection,
} from './constants';
import {
  fetchBlackboardGroupsSuccess,
  fetchBlackboardGroupsError,
  addBlackboardMessageSuccess,
  addBlackboardMessageError,
  deleteBlackboardMessageSuccess,
  deleteBlackboardMessageError,
  fetchBlackboardMessagesSuccess,
  fetchBlackboardMessagesError,
  fetchTasksSuccess,
  fetchTasksError,
  fetchRecentlyVisitedEntitiesSuccess,
  fetchRecentlyVisitedEntitiesError,
  fetchRecentActivitiesHistoryError,
  fetchRecentActivitiesHistorySuccess,
  fetchWidgetsSuccess, fetchWidgetsError,
  setWidgetsSuccess, setWidgetsError,
} from './actions';
import { showNotification } from '../NotificationsProvider/actions';
import messages from './messages';

export function* fetchBlackboardGroups() {
  const requestURL = `${config.API_ENDPOINT}/groups/my?embed=permissions`;
  try {
    const blackboardGroups = yield safeCall(authRequest, requestURL);
    yield put(fetchBlackboardGroupsSuccess(blackboardGroups));
  } catch (err) {
    yield put(fetchBlackboardGroupsError(err));
  }
}

export function* addBlackboardMessage(action) {
  const requestURL = `${config.API_ENDPOINT}/blackboards`;
  try {
    const blackboardMessages = yield safeCall(authRequest, requestURL, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ groupId: parseInt(action.groupId, 10), message: action.message }),
    });
    yield put(addBlackboardMessageSuccess(blackboardMessages, action.groupId));
    yield put(showNotification(messages.messageSent, 'success'));
  } catch (err) {
    yield put(addBlackboardMessageError(err));
  }
}

export function* deleteBlackboardMessage(action) {
  const requestURL = `${config.API_ENDPOINT}/blackboards/${action.blackboardId}`;
  try {
    yield safeCall(authRequest, requestURL, { method: 'DELETE' });
    yield put(deleteBlackboardMessageSuccess(action.blackboardId));
  } catch (err) {
    yield put(deleteBlackboardMessageError(err));
  }
}

export function* fetchBlackboardMessages(action) {
  const requestURL = `${config.API_ENDPOINT}/blackboards?groupId=${action.groupId}&limit=${action.limit}&offset=${action.offset}`;
  try {
    const blackboardMessages = yield safeCall(authRequest, requestURL);
    const hasMore = blackboardMessages.length === action.limit;
    yield put(fetchBlackboardMessagesSuccess(blackboardMessages, action.groupId, hasMore));
  } catch (err) {
    yield put(fetchBlackboardMessagesError(err));
  }
}

export function* fetchTasks(action) {
  const statusList = ['to do', 'in process'];
  const statusListQuery = statusList.map((el) => `status=${el}`).join('&');
  const requestURL = `${config.API_ENDPOINT}/tasks?limit=${DEFAULT_SCROLLER_LIMIT}&offset=${action.offset}` +
  `&orderBy=dueDate,subject,taskId&${statusListQuery}`;
  try {
    const taskList = yield safeCall(authRequest, requestURL);
    const hasMore = taskList.length === DEFAULT_SCROLLER_LIMIT;
    yield put(fetchTasksSuccess(taskList, hasMore));
  } catch (err) {
    yield put(fetchTasksError(err));
  }
}

export function* fetchRecentlyVisitedEntities(action) {
  const requestURL = `${config.API_ENDPOINT}/recently-visited-entities?limit=${DEFAULT_SCROLLER_LIMIT}&offset=${action.offset}`;

  try {
    const recentlyVisitedEntitiesDetails = yield safeCall(authRequest, requestURL);
    const hasMore = recentlyVisitedEntitiesDetails.length === DEFAULT_SCROLLER_LIMIT;

    yield put(fetchRecentlyVisitedEntitiesSuccess(recentlyVisitedEntitiesDetails, hasMore));
  } catch (err) {
    yield put(fetchRecentlyVisitedEntitiesError(err));
  }
}

export function* fetchRecentActivitiesHistory(action) {
  const requestURL = `${config.API_ENDPOINT}/recent-activities?limit=${DEFAULT_SCROLLER_LIMIT}&offset=${action.offset}`;
  try {
    const recentActivityHistoryList = yield safeCall(authRequest, requestURL);
    const hasMore = recentActivityHistoryList.length === DEFAULT_SCROLLER_LIMIT;
    yield put(fetchRecentActivitiesHistorySuccess(recentActivityHistoryList, hasMore));
  } catch (err) {
    yield put(fetchRecentActivitiesHistoryError(err));
  }
}

export function* fetchWidgets() {
  const requestURL = `${config.API_ENDPOINT}/user-widgets`;
  try {
    const userWidgets = yield safeCall(authRequest, requestURL);

    const widgets = {};
    Object.keys(widgetsCountBySection).forEach((currentSection) => {
      const sectionWidgets = [];
      for (let i = 0; i < widgetsCountBySection[currentSection]; i += 1) {
        const userWidget = userWidgets.find(({ positionIndex, widget: { section } }) => (section === currentSection) && (positionIndex === i));
        sectionWidgets.push(userWidget ? { id: userWidget.widget.widgetId, type: userWidget.widget.type } : {});
      }
      widgets[currentSection] = sectionWidgets;
    });

    yield put(fetchWidgetsSuccess(widgets));
  } catch (err) {
    yield put(fetchWidgetsError(err));
  }
}

export function* setWidgets({ widgets }) {
  const widgetsToJS = widgets.toJS();
  const widgetsToSend = [];
  Object.keys(widgetsToJS).forEach((section) => {
    widgetsToJS[section].forEach((widget, index) => {
      if (widget.type) {
        widgetsToSend.push({ widgetType: widget.type, positionIndex: index });
      }
    });
  });
  const requestURL = `${config.API_ENDPOINT}/user-widgets`;
  try {
    yield safeCall(authRequest, requestURL, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ widgets: widgetsToSend }),
    });
    yield put(setWidgetsSuccess());
  } catch (err) {
    yield put(setWidgetsError(err));
  }
}

export default function* FindPropSaga() {
  yield takeLatest(({ type, status }) => type === FETCH_BLACKBOARD_GROUPS && status === ACTION_STATUS_PENDING, fetchBlackboardGroups);
  yield takeLatest(({ type, status }) => type === ADD_BLACKBOARD_MESSAGE && status === ACTION_STATUS_PENDING, addBlackboardMessage);
  yield takeLatest(({ type, status }) => type === DELETE_BLACKBOARD_MESSAGE && status === ACTION_STATUS_PENDING, deleteBlackboardMessage);
  yield takeLatest(({ type, status }) => type === FETCH_BLACKBOARD_MESSAGES && status === ACTION_STATUS_PENDING, fetchBlackboardMessages);
  yield takeLatest(({ type, status }) => type === FETCH_TASKS && status === ACTION_STATUS_PENDING, fetchTasks);
  yield takeLatest(({ type, status }) => type === FETCH_RECENTLY_VISITED_ENTITIES && status === ACTION_STATUS_PENDING, fetchRecentlyVisitedEntities);
  yield takeLatest(({ type, status }) => type === FETCH_RECENT_ACTIVITIES_HISTORY && status === ACTION_STATUS_PENDING, fetchRecentActivitiesHistory);
  yield takeLatest(({ type, status }) => type === FETCH_WIDGETS && status === ACTION_STATUS_PENDING, fetchWidgets);
  yield takeLatest(({ type, status }) => type === SET_WIDGETS && status === ACTION_STATUS_PENDING, setWidgets);
}
