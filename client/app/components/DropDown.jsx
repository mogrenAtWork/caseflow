import React from 'react';
import PropTypes from 'prop-types';

export default class DropDown extends React.Component {
  onChange = (event) => {
    this.props.onChange(event.target.value);
  }

  render() {
    let {
      errorMessage,
      label,
      name,
      options,
      required,
      value,
      readOnly
    } = this.props;

    return <div className="cf-form-dropdown">
      <label className="question-label" htmlFor={name}>
        {label || name} {required && <span className="cf-required">Required</span>}
      </label>
      {errorMessage && <span className="usa-input-error-message">{errorMessage}</span>}
      <select value={value} onChange={this.onChange} id={name} disabled={readOnly}>
        {options.map((option, index) =>
          <option
            value={option}
            id={`${name}_${option}`}
            key={index}>{option}
          </option>
        )}
      </select>
    </div>;
  }
}

DropDown.propTypes = {
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.string
};
