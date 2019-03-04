import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import history from '../../common/history';
import * as actions from './redux/actions';

export class TitleBar extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    studios: PropTypes.array.isRequired,
    studioById: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  state = {
    hideDropdown: false,
  };

  handleDoubleClick = () => {
    console.log('double click');
    window.bridge.ipcRenderer.send('call-window-method', 'toggle-maximize');
  };

  handlePrjClick = studio => {
    history.push(`/rekit-studio/${studio.port}`);
    this.setState({ hideDropdown: true }, () => {
      setTimeout(() => this.setState({ hideDropdown: false }), 50);
    });
  };

  render() {
    const studios = this.props.studios.map(id => this.props.studioById[id]);
    const pathname = this.props.router.location.pathname;

    const current = /^\/rekit-studio\/(\w+)$/.test(pathname)
      ? _.find(studios, { port: RegExp.$1 })
      : null;

    const list = _.without(studios, current);
    return (
      <header className="home-title-bar" onDoubleClick={this.handleDoubleClick}>
        {current ? (
          <span className="title-container">
            {current.prjDir}{' '}
            <span className="studio-url">
              (http://localhost:
              {current.port})
            </span>
            {list.length > 0 && <Icon type="caret-down" />}
            {list.length > 0 && (
              <div className={`project-list ${this.state.hideDropdown ? 'hide-dropdown' : ''}`}>
                <ul>
                  {list.map(s => {
                    const arr = s.prjDir.split('/');
                    const name = arr.pop();
                    const dir = arr.join('/');
                    return (
                      <li key={s.prjDir} onClick={() => this.handlePrjClick(s)}>
                        <span className="project">
                          <span className="project-name">{name}</span>
                          <span className="project-dir">{dir} </span>
                        </span>
                        <span className="studio-url">
                          <a href={`http://localhost:${s.port}`} target="_blank" onClick={evt => evt.stopPropagation()}>
                            http://localhost:
                            {s.port}
                          </a>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </span>
        ) : (
          <span>Welcome to Rekit!</span>
        )}
      </header>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    studios: state.home.studios,
    studioById: state.home.studioById,
    router: state.router,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TitleBar);
