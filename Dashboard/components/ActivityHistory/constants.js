export const RECENT_ACTIVITIES_HISTORY_CREATE_TASK = 'activity_log_task';
export const RECENT_ACTIVITIES_HISTORY_CREATE_CALL = 'activity_log_call';
export const RECENT_ACTIVITIES_HISTORY_CREATE_TEXT = 'activity_log_text';
export const RECENT_ACTIVITIES_HISTORY_CREATE_EMAIL = 'activity_log_email';
export const RECENT_ACTIVITIES_HISTORY_CREATE_ENTITY = 'entity_created';
export const RECENT_ACTIVITIES_HISTORY_UPDATE_ENTITY = 'entity_updated';
export const RECENT_ACTIVITIES_HISTORY_UPDATE_DEAL_LAST_STATUS = 'activity_log_deal_last_status';
export const RECENT_ACTIVITIES_HISTORY_CREATE_DEAL_PHASE = 'activity_log_deal_phase';
export const RECENT_ACTIVITIES_HISTORY_DELETE_ENTITY = 'entity_deleted';

export const activityLogTypes = {
  [RECENT_ACTIVITIES_HISTORY_CREATE_TASK]: 'task',
  [RECENT_ACTIVITIES_HISTORY_CREATE_CALL]: 'call',
  [RECENT_ACTIVITIES_HISTORY_CREATE_TEXT]: 'text',
  [RECENT_ACTIVITIES_HISTORY_CREATE_EMAIL]: 'email',
  [RECENT_ACTIVITIES_HISTORY_UPDATE_DEAL_LAST_STATUS]: 'deal_last_status',
  [RECENT_ACTIVITIES_HISTORY_CREATE_DEAL_PHASE]: 'deal_phase',
};
