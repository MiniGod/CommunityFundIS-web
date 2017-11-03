import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Link from '../Link';

class Header extends React.Component {
  static propTypes = {
    style: PropTypes.shape()
  };
  render() {
    return (
      <div className={s.container} style={this.props.style || null}>
        <Link to="/">
          <img
            className={s.logo}
            src="/logos/transparent_logo.png"
            alt="logo"
          />
        </Link>
        {/* <Link to="/about" className={s.link}>About us</Link>
        <Link to="/guidelines" className={s.link}>Guidelines</Link>
        <Link to="/Team" className={s.link}>Team</Link> */}
      </div>
    );
  }
}

export default withStyles(s)(Header);
