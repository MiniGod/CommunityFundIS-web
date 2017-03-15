/* eslint-disable import/prefer-default-export */
import {
  GRANT_INPUT_CHANGED,
  GRANT_FORM_VALIDATION_ERRORS,
} from '../constants';
import { log, logError } from '../logger';
import { isDev } from '../config';

const validateInput = (field, value) => {
  if (isDev && field === 'googleToken') {
    return null;
  }
  if (!value || value === '') {
    return 'Required';
  }

  if (field === 'date') {
    if (value.unix() < Date.now() / 1000) {
      return 'Past date';
    }
  }

  if (field === 'askAmount' || field === 'totalCost') {
    const valueAsInt = parseInt(value, 10);
    if (!valueAsInt || valueAsInt <= 0) {
      return 'Must be a valid number';
    }
  }

  return null;
};

export function inputChange(field, value) {
  const error = validateInput(field, value);
  return {
    type: GRANT_INPUT_CHANGED,
    payload: {
      field,
      value,
      error,
    },
  };
}

export function showValidationErrors(errors) {
  return {
    type: GRANT_FORM_VALIDATION_ERRORS,
    payload: errors,
  };
}

export function submitGrant() {
  return async (dispatch, getStore, { graphqlRequest }) => {
    const {
      grant,
    } = getStore();

    const values = grant.values || {};
    const {
      name,
      phone,
      email,
      date,
      summary,
      description,
      askAmount,
      totalCost,
      googleToken,
    } = values;

    // @TODO do better validation
    const validationErrors = {};
    [
      'name',
      'phone',
      'email',
      'date',
      'summary',
      'description',
      'askAmount',
      'totalCost',
      'googleToken',
    ].forEach(field => {
      const error = validateInput(field, values[field]);
      if (error) {
        validationErrors[field] = error;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      dispatch(showValidationErrors(validationErrors));
      return false;
    }

    const query = `
      mutation{
        createSubmission(
          name:"${name}",
          phone:"${phone}",
          email:"${email}",
          date:"${date.format('DD/MM/YYYY')}",
          summary:"${summary}",
          description:"${description}",
          askAmount:"${askAmount}",
          totalCost:"${totalCost}",
          googleToken:"${!isDev ? googleToken : ''}",
        ) {
          id
        }
      }
    `;
    log('query is', query);

    try {
      const { data, errors } = await graphqlRequest(query);
      log('got back', data, errors);

      if (errors) {
        return false;
      }
    } catch (e) {
      logError('Failed to mutate ingredient', e);
      // @TODO dispatch failure event
      return false;
    }

    // @TODO dispatch success event
    log('success!');
    return true;
  };
}