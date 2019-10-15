import Blackboard from './components/Blackboard';
import Calendar from '../Calendar';
import Tasks from './components/Tasks';
import DefaultWidget from './components/DefaultWidget';
import RecentlyVisitedEntities from './components/RecentlyVisitedEntities';
import ActivityHistory from './components/ActivityHistory';

export const componentByWidgetType = {
  blackboard: Blackboard,
  calendar: Calendar,
  tasks: Tasks,
  default: DefaultWidget,
  recentlyVisitedEntities: RecentlyVisitedEntities,
  activityHistory: ActivityHistory,
};
