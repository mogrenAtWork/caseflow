import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { formatDateStr } from '../util/DateUtil';
import Comment from '../components/Comment';
import { singleDocumentLink } from '../reader/utils';
import DocumentCategoryIcons from '../components/DocumentCategoryIcons';
import TagTableColumn from '../components/reader/TagTableColumn';
import Table from '../components/Table';
import Button from '../components/Button';
import * as Constants from './constants';
import CommentIndicator from './CommentIndicator';
import DropdownFilter from './DropdownFilter';
import { bindActionCreators } from 'redux';
import Link from '../components/Link';
import Highlight from '../components/Highlight';

import { setDocListScrollPosition, changeSortState,
  setTagFilter, setCategoryFilter, selectCurrentPdfLocally } from './actions';
import { getAnnotationsPerDocument } from './selectors';
import {
  SelectedFilterIcon, UnselectedFilterIcon, rightTriangle,
  SortArrowUp, SortArrowDown, DoubleArrow } from '../components/RenderFunctions';
import DocCategoryPicker from './DocCategoryPicker';
import DocTagPicker from './DocTagPicker';
import Analytics from '../util/AnalyticsUtil';

const NUMBER_OF_COLUMNS = 6;

class FilterIcon extends React.PureComponent {
  render() {
    const {
      handleActivate, label, getRef, selected, idPrefix
    } = this.props;

    const onActivate = (event) => {
      Analytics.event('Claims Folder', 'activate filter', idPrefix);
      handleActivate(event);
    };

    const handleKeyDown = (event) => {
      if (event.key === ' ' || event.key === 'Enter') {
        onActivate(event);
        event.preventDefault();
      }
    };

    const className = 'table-icon';

    const props = {
      role: 'button',
      getRef,
      'aria-label': label,
      className,
      tabIndex: '0',
      onKeyDown: handleKeyDown,
      onClick: onActivate
    };

    if (selected) {
      return <SelectedFilterIcon {...props} idPrefix={idPrefix} />;
    }

    return <UnselectedFilterIcon {...props} />;
  }
}

FilterIcon.propTypes = {
  label: PropTypes.string.isRequired,
  iconName: PropTypes.string,
  handleActivate: PropTypes.func,
  getRef: PropTypes.func,
  idPrefix: PropTypes.string.isRequired,
  className: PropTypes.string
};

class LastReadIndicator extends React.PureComponent {
  render() {
    if (!this.props.shouldShow) {
      return null;
    }

    return <span
      id="read-indicator"
      ref={this.props.getRef}
      aria-label="Most recently read document indicator">
        {rightTriangle()}
      </span>;
  }
}

const lastReadIndicatorMapStateToProps = (state, ownProps) => ({
  shouldShow: state.ui.pdfList.lastReadDocId === ownProps.docId
});
const ConnectedLastReadIndicator = connect(lastReadIndicatorMapStateToProps)(LastReadIndicator);

class DocTypeColumn extends React.PureComponent {
  boldUnreadContent = (content, doc) => {
    if (!doc.opened_by_current_user) {
      return <strong>{content}</strong>;
    }

    return content;
  };

  onClick = (id) => () => {
    // Annoyingly if we make this call in the thread, it won't follow the link. Instead
    // we use setTimeout to force it to run at a later point.
    setTimeout(() => this.props.selectCurrentPdfLocally(id), 0);
  }

  render = () => {
    const { doc } = this.props;

    // We add a click handler to mark a document as read even if it's opened in a new tab.
    // This will get fired in the current tab, as the link is followed in a new tab. We
    // also need to add a mouseUp event since middle clicking doesn't trigger an onClick.
    // This will not work if someone right clicks and opens in a new tab.
    return this.boldUnreadContent(
      <Link
        onMouseUp={this.onClick(doc.id)}
        onClick={this.onClick(doc.id)}
        to={singleDocumentLink(this.props.documentPathBase, doc)}
        aria-label={doc.type + (doc.opened_by_current_user ? ' opened' : ' unopened')}>
        <Highlight>
          {doc.type}
        </Highlight>
      </Link>, doc);
  }
}

const mapDocTypeDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    selectCurrentPdfLocally
  }, dispatch)
});

DocTypeColumn.propTypes = {
  doc: PropTypes.object,
  documentPathBase: PropTypes.string
};

const ConnectedDocTypeColumn = connect(
  null, mapDocTypeDispatchToProps
)(DocTypeColumn);


class DocumentsTable extends React.Component {
  constructor() {
    super();
    this.state = {
      filterPositions: {
        tag: {},
        category: {}
      }
    };
  }

  componentDidMount() {
    this.hasSetScrollPosition = false;
    this.setFilterIconPositions();
    window.addEventListener('resize', this.setFilterIconPositions);
  }

  componentWillUnmount() {
    this.props.setDocListScrollPosition(this.tbodyElem.scrollTop);
    window.removeEventListener('resize', this.setFilterIconPositions);
  }

  setFilterIconPositions = () => {
    this.setCategoryFilterIconPosition();
    this.setTagFilterIconPosition();
  }

  setCategoryFilterIconPosition = () => {
    this.setFilterIconPosition('category', this.categoryFilterIcon);
  }

  setTagFilterIconPosition = () => {
    this.setFilterIconPosition('tag', this.tagFilterIcon);
  }

  getTbodyRef = (elem) => this.tbodyElem = elem
  getLastReadIndicatorRef = (elem) => this.lastReadIndicatorElem = elem
  getCategoryFilterIconRef = (categoryFilterIcon) => this.categoryFilterIcon = categoryFilterIcon
  getTagFilterIconRef = (tagFilterIcon) => this.tagFilterIcon = tagFilterIcon
  toggleCategoryDropdownFilterVisiblity = () => this.props.toggleDropdownFilterVisiblity('category')
  toggleTagDropdownFilterVisiblity = () => this.props.toggleDropdownFilterVisiblity('tag')

  getKeyForRow = (index, { isComment, id }) => {
    return isComment ? `${id}-comment` : id;
  }

  setFilterIconPosition = (filterType, icon) => {
    const boundingClientRect = {
      bottom: icon.getBoundingClientRect().bottom + window.scrollY,
      right: icon.getBoundingClientRect().right
    };

    if (this.state.filterPositions[filterType].bottom !== boundingClientRect.bottom ||
      this.state.filterPositions[filterType].right !== boundingClientRect.right) {
      this.setState({
        filterPositions: _.merge(this.state.filterPositions, {
          [filterType]: _.merge({}, boundingClientRect)
        })
      });
    }
  }

  componentDidUpdate() {
    if (!this.hasSetScrollPosition) {
      this.tbodyElem.scrollTop = this.props.pdfList.scrollTop;

      if (this.lastReadIndicatorElem) {
        const lastReadBoundingRect = this.lastReadIndicatorElem.getBoundingClientRect();
        const tbodyBoundingRect = this.tbodyElem.getBoundingClientRect();
        const lastReadIndicatorIsInView = tbodyBoundingRect.top <= lastReadBoundingRect.top &&
          lastReadBoundingRect.bottom <= tbodyBoundingRect.bottom;

        if (!lastReadIndicatorIsInView) {
          const rowWithLastRead = _.find(
            this.tbodyElem.children,
            (tr) => tr.querySelector(`#${this.lastReadIndicatorElem.id}`)
          );

          this.tbodyElem.scrollTop += rowWithLastRead.getBoundingClientRect().top - tbodyBoundingRect.top;
        }
      }

      this.hasSetScrollPosition = true;
    }
    this.setFilterIconPositions();
  }

    // eslint-disable-next-line max-statements
  getDocumentColumns = (row) => {
    const sortArrowIcon = this.props.docFilterCriteria.sort.sortAscending ? <SortArrowUp /> : <SortArrowDown />;
    const notSortedIcon = <DoubleArrow />;

    const clearFilters = () => {
      _(Constants.documentCategories).keys().
        forEach((categoryName) => this.props.setCategoryFilter(categoryName, false));
    };

    const clearTagFilters = () => {
      _(this.props.docFilterCriteria.tag).keys().
        forEach((tagText) => this.props.setTagFilter(tagText, false));
    };

    const anyFiltersSet = (filterType) => (
      Boolean(_.some(this.props.docFilterCriteria[filterType]))
    );

    const anyCategoryFiltersAreSet = anyFiltersSet('category');
    const anyTagFiltersAreSet = anyFiltersSet('tag');

    // We have blank headers for the comment indicator and label indicator columns.
    // We use onMouseUp instead of onClick for filename event handler since OnMouseUp
    // is triggered when a middle mouse button is clicked while onClick isn't.
    if (row && row.isComment) {

      return [{
        valueFunction: (doc) => {
          const comments = this.props.annotationsPerDocument[doc.id];
          const commentNodes = comments.map((comment, commentIndex) => {
            return <Comment
              key={comment.uuid}
              id={`comment${doc.id}-${commentIndex}`}
              selected={false}
              page={comment.page}
              onJumpToComment={this.props.onJumpToComment(comment)}
              uuid={comment.uuid}
              horizontalLayout={true}>
                {comment.comment}
              </Comment>;
          });

          return <ul className="cf-no-styling-list" aria-label="Document comments">
            {commentNodes}
          </ul>;
        },
        span: _.constant(NUMBER_OF_COLUMNS)
      }];
    }

    const isCategoryDropdownFilterOpen =
      _.get(this.props.pdfList, ['dropdowns', 'category']);

    const isTagDropdownFilterOpen =
      _.get(this.props.pdfList, ['dropdowns', 'tag']);

    return [
      {
        cellClass: 'last-read-column',
        valueFunction: (doc) => <ConnectedLastReadIndicator docId={doc.id} getRef={this.getLastReadIndicatorRef} />
      },
      {
        cellClass: 'categories-column',
        header: <div
          id="categories-header">
          Categories <FilterIcon
            label="Filter by category"
            idPrefix="category"
            getRef={this.getCategoryFilterIconRef}
            selected={isCategoryDropdownFilterOpen || anyCategoryFiltersAreSet}
            handleActivate={this.toggleCategoryDropdownFilterVisiblity} />

          {isCategoryDropdownFilterOpen &&
            <DropdownFilter baseCoordinates={this.state.filterPositions.category}
              clearFilters={clearFilters}
              name="category"
              isClearEnabled={anyCategoryFiltersAreSet}
              handleClose={this.toggleCategoryDropdownFilterVisiblity}>
              <DocCategoryPicker
                categoryToggleStates={this.props.docFilterCriteria.category}
                handleCategoryToggle={this.props.setCategoryFilter} />
            </DropdownFilter>
          }

        </div>,
        valueFunction: (doc) => <DocumentCategoryIcons doc={doc} />
      },
      {
        cellClass: 'receipt-date-column',
        header: <Button
          name="Receipt Date"
          id="receipt-date-header"
          classNames={['cf-document-list-button-header']}
          onClick={() => this.props.changeSortState('receivedAt')}>
          Receipt Date {this.props.docFilterCriteria.sort.sortBy === 'receivedAt' ? sortArrowIcon : notSortedIcon }
        </Button>,
        valueFunction: (doc) => <span className="document-list-receipt-date">
          <Highlight>
            {formatDateStr(doc.receivedAt)}
          </Highlight>
        </span>
      },
      {
        cellClass: 'doc-type-column',
        header: <Button id="type-header"
        name="Document Type"
        classNames={['cf-document-list-button-header']}
        onClick={() => this.props.changeSortState('type')}>
          Document Type {this.props.docFilterCriteria.sort.sortBy === 'type' ? sortArrowIcon : notSortedIcon }
        </Button>,
        valueFunction: (doc) => <ConnectedDocTypeColumn doc={doc}
          documentPathBase={this.props.documentPathBase}/>
      },
      {
        cellClass: 'tags-column',
        header: <div id="tags-header"
          className="document-list-header-issue-tags">
          Issue Tags <FilterIcon
            label="Filter by tag"
            idPrefix="tag"
            getRef={this.getTagFilterIconRef}
            selected={isTagDropdownFilterOpen || anyTagFiltersAreSet}
            handleActivate={this.toggleTagDropdownFilterVisiblity}
          />
          {isTagDropdownFilterOpen &&
            <DropdownFilter baseCoordinates={this.state.filterPositions.tag}
              clearFilters={clearTagFilters}
              name="tag"
              isClearEnabled={anyTagFiltersAreSet}
              handleClose={this.toggleTagDropdownFilterVisiblity}>
              <DocTagPicker
                tags={this.props.tagOptions}
                tagToggleStates={this.props.docFilterCriteria.tag}
                handleTagToggle={this.props.setTagFilter} />
            </DropdownFilter>
          }
        </div>,
        valueFunction: (doc) => {
          return <TagTableColumn tags={doc.tags} />;
        }
      },
      {
        cellClass: 'comments-column',
        header: <div
          id="comments-header"
          className="document-list-header-comments">
          Comments
        </div>,
        valueFunction: (doc) => <CommentIndicator docId={doc.id} />
      }
    ];
  }

  render() {
    let rowObjects = this.props.documents.reduce((acc, row) => {
      acc.push(row);
      const doc = _.find(this.props.documents, _.pick(row, 'id'));

      if (_.size(this.props.annotationsPerDocument[doc.id]) && doc.listComments) {
        acc.push({
          ...row,
          isComment: true
        });
      }

      return acc;
    }, []);

    return <div>
      <Table
        columns={this.getDocumentColumns}
        rowObjects={rowObjects}
        summary="Document list"
        className="documents-table"
        headerClassName="cf-document-list-header-row"
        bodyClassName="cf-document-list-body"
        rowsPerRowObject={2}
        tbodyId="documents-table-body"
        tbodyRef={this.getTbodyRef}
        getKeyForRow={this.getKeyForRow}
      />
    </div>;
  }
}

DocumentsTable.propTypes = {
  documents: PropTypes.arrayOf(PropTypes.object).isRequired,
  onJumpToComment: PropTypes.func,
  sortBy: PropTypes.string,
  pdfList: PropTypes.shape({
    lastReadDocId: PropTypes.number
  })
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setDocListScrollPosition,
    setTagFilter,
    setCategoryFilter
  }, dispatch),
  changeSortState(sortBy) {
    Analytics.event('Claims Folder', 'sort by', sortBy);
    dispatch(changeSortState(sortBy));
  },
  toggleDropdownFilterVisiblity(filterName) {
    dispatch({
      type: Constants.TOGGLE_FILTER_DROPDOWN,
      payload: {
        filterName
      }
    });
  }
});

const mapStateToProps = (state) => ({
  annotationsPerDocument: getAnnotationsPerDocument(state),
  ..._.pick(state, 'tagOptions'),
  ..._.pick(state.ui, 'pdfList'),
  ..._.pick(state.ui, 'docFilterCriteria')
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(DocumentsTable);
