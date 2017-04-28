// actions
//
export const UPDATE_PROGRESS_BAR = 'UPDATE_PROGRESS_BAR';
export const CHANGE_VBMS_HEARING_DOCUMENT = 'CHANGE_VBMS_HEARING_DOCUMENT';
export const CHANGE_TYPE_OF_FORM9 = 'CHANGE_TYPE_OF_FORM9';
export const CHANGE_TYPE_OF_HEARING = 'CHANGE_TYPE_OF_HEARING';

export const CHANGE_REPRESENTATIVE_NAME = 'CHANGE_REPRESENTATIVE_NAME';
export const CHANGE_REPRESENTATIVE_TYPE = 'CHANGE_REPRESENTATIVE_TYPE';
export const CHANGE_OTHER_REPRESENTATIVE_TYPE = 'CHANGE_OTHER_REPRESENTATIVE_TYPE';

export const CHANGE_SIGN_AND_CERTIFY_FORM = 'CHANGE_SIGN_AND_CERTIFY_FORM';

export const CERTIFICATION_UPDATE_REQUEST = 'CERTIFICATION_UPDATE_REQUEST';
export const CERTIFICATION_UPDATE_FAILURE = 'CERTIFICATION_UPDATE_FAILURE';
export const CERTIFICATION_UPDATE_SUCCESS = 'CERTIFICATION_UPDATE_SUCCESS';

export const ON_CONTINUE_CLICK_FAILED = 'ON_CONTINUE_CLICK_FAILED';
export const ON_CONTINUE_CLICK_SUCCESS = 'ON_CONTINUE_CLICK_SUCCESS';

export const RESET_STATE = 'RESET_STATE';

// types of hearings
//
// TODO:
// on the backend, NO_HEARING_DESIRED
// should result in VIDEO being written to VACOLS,
// and HEARING_CANCELLED should result in a cancellation
// checkbox being checked, but the original hearing type
// should be undisturbed.
export const hearingPreferences = {
  VIDEO: 'VIDEO',
  TRAVEL_BOARD: 'TRAVEL_BOARD',
  WASHINGTON_DC: 'WASHINGTON_DC',
  HEARING_TYPE_NOT_SPECIFIED: 'HEARING_TYPE_NOT_SPECIFIED',
  NO_HEARING_DESIRED: 'NO_HEARING_DESIRED',
  HEARING_CANCELLED: 'HEARING_CANCELLED',
  NO_BOX_SELECTED: 'NO_BOX_SELECTED'
};

// form9 values
export const form9Types = {
  FORMAL_FORM9: 'FORMAL_FORM9',
  INFORMAL_FORM9: 'INFORMAL_FORM9'
};

// representation for the appellant
export const representativeTypes = {
  ATTORNEY: 'ATTORNEY',
  AGENT: 'AGENT',
  ORGANIZATION: 'ORGANIZATION',
  NONE: 'NONE',
  // TODO: should "Other be a real type"?
  OTHER: 'OTHER'
};

// was a hearing document found in VBMS?
export const vbmsHearingDocument = {
  FOUND: 'FOUND',
  NOT_FOUND: 'NOT_FOUND'
};

export const progressBarSections = {
  CHECK_DOCUMENTS: 'CHECK_DOCUMENTS',
  CONFIRM_CASE_DETAILS: 'CONFIRM_CASE_DETAILS',
  CONFIRM_HEARING: 'CONFIRM_HEARING',
  SIGN_AND_CERTIFY: 'SIGN_AND_CERTIFY'
};

export const certifyingOfficialTitles = {
  DECISION_REVIEW_OFFICER: 'DECISION_REVIEW_OFFICER',
  RATING_SPECIALIST: 'RATING_SPECIALIST',
  VETERANS_SERVICE_REPRESENTATIVE: 'VETERANS_SERVICE_REPRESENTATIVE',
  CLAIMS_ASSISTANT: 'CLAIMS_ASSISTANT',
  OTHER: 'OTHER'
};
