import React from 'react';
import PropTypes from 'prop-types';
import SearchBar from '../SearchBar';
import Button from '../Button';
import Alert from '../Alert';
import { connect } from 'react-redux';
import { setSearch, clearAllFilters, toggleExpandAll, clearSearch } from '../../reader/actions';
import _ from 'lodash';
import Analytics from '../../util/AnalyticsUtil';

export const DocumentListHeader = (props) => {
  const buttonText = props.expandAll ? 'Collapse all' : 'Expand all';

  const categoryFilters = Object.keys(props.docFilterCriteria.category).some((category) =>
    props.docFilterCriteria.category[category]
  );
  const tagFilters = Object.keys(props.docFilterCriteria.tag).some((tag) =>
    props.docFilterCriteria.tag[tag]
  );
  const numberRead = _.reduce(props.documents, (acc, doc) =>
    acc + (doc.opened_by_current_user ? 1 : 0), 0);

  const filteredCategories = [].concat(
    categoryFilters ? ['categories'] : [],
    tagFilters ? ['tags'] : []).join(' ');

  return <div>
    <div className="usa-grid-full document-list-header">
      <div className="cf-list-spaced-out">
        <h1>Joe Snuffy</h1>
        <p>{`You’ve viewed ${numberRead} out of ${props.numberOfDocuments} documents`}</p>
      </div>

      <div className="usa-width-one-third">
        <SearchBar
          id="searchBar"
          onChange={props.setSearch}
          onClearSearch={props.clearSearch}
          onClick={props.clickSearch}
          value={props.docFilterCriteria.searchQuery}
          size="small"
          analyticsCategory="Claims Folder"
        />
      </div>
      <div className="usa-width-one-third num-of-documents">
        {props.numberOfDocuments} Documents
      </div>
      <div className="usa-width-one-third">
        <span className="cf-right-side">
          <Button
            name={buttonText}
            onClick={props.toggleExpandAll}
            id="btn-default"
            disabled={props.noDocuments}
          />
        </span>
      </div>
    </div>
    {Boolean(filteredCategories.length) &&
      <Alert
        title="Showing limited results"
        type="info">
        Documents are currently
          filtered by {filteredCategories}. <a
            href="#"
            id="clear-filters"
            onClick={props.clearAllFilters}>
          Click here to see all documents.</a>
      </Alert>}
  </div>;
};

DocumentListHeader.propTypes = {
  documents: PropTypes.object,
  setSearch: PropTypes.func.isRequired,
  expandAll: PropTypes.bool,
  toggleExpandAll: PropTypes.func,
  noDocuments: PropTypes.bool,
  clearAllFilters: PropTypes.func,
  numberOfDocuments: PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
  expandAll: state.ui.expandAll,
  numberOfDocuments: state.ui.filteredDocIds ? state.ui.filteredDocIds.length : _.size(state.documents),
  docFilterCriteria: state.ui.docFilterCriteria,
  documents: state.documents
});

const mapDispatchToProps = (dispatch) => ({
  clearAllFilters: () => {
    Analytics.event('Claims Folder', 'click', 'Clear all filters');
    dispatch(clearAllFilters());
  },
  clearSearch: () => {
    dispatch(clearSearch());
  },
  setSearch: (searchQuery) => {
    dispatch(setSearch(searchQuery));
  },
  toggleExpandAll: () => {
    Analytics.event('Claims Folder', 'click', 'Expand/Collapse all');
    dispatch(toggleExpandAll());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentListHeader);
