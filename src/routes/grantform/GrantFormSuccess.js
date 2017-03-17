import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import s from './GrantFormSuccess.css';
import Link from '../../components/Link';

const GrantFormSuccess = ({ email }) => {
  const steps = [
    `We've sent an email to ${email} that contains this information.`,
    'Our team has received the details of your application and will begin voting as soon as possible.',
    "Finally, we'll send you an email when we've decided on your submission.",
  ];
  return (
    <div className={s.container}>
      <div className={s.content}>
        <h1>Thank you for your application!</h1>
        <h2 className={s.subHeading}>What will happen now?</h2>
        <ul className={s.nextSteps}>
          {steps.map((stepText, i) => (
            <li key={i} className={s.step}>{stepText}</li>
          ))}
        </ul>
        <p>
          <Link to="/">Back to front page</Link>
        </p>
      </div>
    </div>
  );
};
GrantFormSuccess.propTypes = {
  email: PropTypes.string,
};

export default connect(
  (state /* , props */) => ({
    ...state.grant.submission,
  }),
  {},
)(withStyles(s)(GrantFormSuccess));