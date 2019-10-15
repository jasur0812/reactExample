import {
  faCheckCircle, faCheckDouble, faComment, faEnvelope, faFire, faFont, faPhone, faTasks,
} from '@fortawesome/pro-light-svg-icons';
import { faClipboardCheck, faStream } from '@fortawesome/pro-regular-svg-icons';

import {
  RECENT_ACTIVITIES_HISTORY_CREATE_CALL,
  RECENT_ACTIVITIES_HISTORY_CREATE_DEAL_PHASE,
  RECENT_ACTIVITIES_HISTORY_CREATE_EMAIL,
  RECENT_ACTIVITIES_HISTORY_CREATE_ENTITY,
  RECENT_ACTIVITIES_HISTORY_CREATE_TASK,
  RECENT_ACTIVITIES_HISTORY_CREATE_TEXT,
  RECENT_ACTIVITIES_HISTORY_UPDATE_DEAL_LAST_STATUS,
  RECENT_ACTIVITIES_HISTORY_UPDATE_ENTITY,
  RECENT_ACTIVITIES_HISTORY_DELETE_ENTITY,
  activityLogTypes,
} from './constants';
import messages from '../../messages';

const activityIconsByType = (activityType) => {
  switch (activityType) {
    case 'call':
      return faPhone;
    case 'email':
      return faEnvelope;
    case 'task':
      return faTasks;
    case 'text':
      return faFont;
    case 'comment':
      return faComment;
    case 'condition':
      return faCheckDouble;
    case 'deal_last_status':
      return faClipboardCheck;
    case 'deal_changelog':
      return faStream;
    case 'deal_phase':
      return faCheckCircle;
    default:
      return faFire;
  }
};

export const recentActivitiesHistoryMessages = {
  [RECENT_ACTIVITIES_HISTORY_UPDATE_ENTITY]: {
    activityHistoryMessage: messages.recentActivityHistoryEntityUpdated,
    activityHistoryType: '',
  },
  [RECENT_ACTIVITIES_HISTORY_CREATE_ENTITY]: {
    activityHistoryMessage: messages.recentActivityHistoryEntityCreated,
    activityHistoryType: '',
  },
  [RECENT_ACTIVITIES_HISTORY_DELETE_ENTITY]: {
    activityHistoryMessage: messages.recentActivityHistoryEntityDeleted,
    activityHistoryType: '',
  },
  [RECENT_ACTIVITIES_HISTORY_CREATE_CALL]: {
    activityHistoryMessage: messages.recentActivityHistoryCreateCall,
    activityHistoryType: messages.recentActivityHistoryTypeCall,
  },
  [RECENT_ACTIVITIES_HISTORY_CREATE_TASK]: {
    activityHistoryMessage: messages.recentActivityHistoryCreateTask,
    activityHistoryType: messages.recentActivityHistoryTypeTask,
  },
  [RECENT_ACTIVITIES_HISTORY_CREATE_TEXT]: {
    activityHistoryMessage: messages.recentActivityHistoryCreateText,
    activityHistoryType: messages.recentActivityHistoryTypeText,
  },
  [RECENT_ACTIVITIES_HISTORY_CREATE_EMAIL]: {
    activityHistoryMessage: messages.recentActivityHistoryCreateEmail,
    activityHistoryType: messages.recentActivityHistoryTypeEmail,
  },
  [RECENT_ACTIVITIES_HISTORY_UPDATE_DEAL_LAST_STATUS]: {
    activityHistoryMessage: messages.recentActivityHistoryUpdatedDealLastStatus,
    activityHistoryType: messages.recentActivityHistoryTypeDealLastStatus,
  },
  [RECENT_ACTIVITIES_HISTORY_CREATE_DEAL_PHASE]: {
    activityHistoryMessage: messages.recentActivityHistoryCreatedNewPhase,
    activityHistoryType: messages.recentActivityHistoryTypeNewDealPhase,
  },
};

export const activityLogIcon = (recentActivityHistoryType) => (activityIconsByType(activityLogTypes[recentActivityHistoryType]));
