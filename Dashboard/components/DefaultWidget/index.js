import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import messages from '../../messages';

const DefaultWidget = ({ name, onRemoveWidget }) => (
  <div>
    <i className="fa fa-trash" aria-hidden="true" onClick={onRemoveWidget} id="remove-default-widget" />
    <UncontrolledTooltip placement="right" target="remove-default-widget"><FormattedMessage {...messages.remove} /></UncontrolledTooltip>
    <h4>{name}</h4>
  </div>
);

DefaultWidget.propTypes = {
  name: PropTypes.string,
  onRemoveWidget: PropTypes.func.isRequired,
};

export default DefaultWidget;
