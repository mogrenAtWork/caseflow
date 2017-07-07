import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Actions from './actions/Dockets';
import { loadingSymbolHtml } from '../components/RenderFunctions.jsx';
import Docket from './Docket';
import ApiUtil from '../util/ApiUtil';

export const getDockets = (dispatch) => {
  ApiUtil.get('/hearings/dockets.json', { cache: true }).
    then((response) => {
      dispatch(Actions.populateDockets(response.body));
    }, (err) => {
      dispatch(Actions.handleServerError(err));
    });
};

export class DailyDocketContainer extends React.Component {

  componentDidMount() {
    if (!this.props.dockets) {
      this.props.getDockets();
    }
  }

  render() {

    if (this.props.serverError) {
      return <div style={{ textAlign: 'center' }}>
        An error occurred while retrieving your hearings.</div>;
    }

    if (!this.props.dockets) {
      return <div className="loading-dockets">
        <div>{loadingSymbolHtml('', '50%', '#68bd07')}</div>
        <div>Loading hearings, please wait...</div>
      </div>;
    }

    if (Object.keys(this.props.dockets).length === 0) {
      return <div>You have no upcoming hearings.</div>;
    }

    return <Docket {...this.props} />;
  }
}

const mapStateToProps = (state) => ({
  dockets: state.dockets,
  serverError: state.serverError
});

const mapDispatchToProps = (dispatch) => ({
  getDockets: () => {
    getDockets(dispatch);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DailyDocketContainer);

DailyDocketContainer.propTypes = {
  veteran_law_judge: PropTypes.object.isRequired,
  dockets: PropTypes.object,
  serverError: PropTypes.object
};