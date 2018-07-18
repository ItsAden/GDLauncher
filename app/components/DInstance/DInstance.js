// @flow
import React, { Component } from 'react';
import { Button, Icon, Progress, message } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from './DInstance.css';
import launchCommand from '../../utils/MCLaunchCommand';

type Props = {
  name: string,
  installingQueue: Object,
  userData: Object
};

export default class DIcon extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.percentage = this.updatePercentage();
  }

  componentDidUpdate = (prevProps, prevState) => {
    this.percentage = this.updatePercentage();
  }

  updateInstallingStatus() {
    if (this.props.installingQueue[this.props.name]) {
      switch (this.props.installingQueue[this.props.name].status) {
        case 'Queued':
          return true;
        case 'Downloading':
          return true;
        case 'Completed':
          return false;
        default:
          return true;
      }
    } else {
      return false;
    }
  }

  updatePercentage() {
    if (this.props.installingQueue[this.props.name]) {
      switch (this.props.installingQueue[this.props.name].status) {
        case 'Queued':
          return 0;
        case 'Downloading':
          /* TODO: Fix NaN. It is caused by 0 / 0 division while waiting for usable data from the worker */
          return Math.floor(
            (this.props.installingQueue[this.props.name].downloaded * 100)
            / this.props.installingQueue[this.props.name].totalToDownload);
        case 'Completed':
          return 100;
        default:
          return 0;
      }
    } else {
      return 0;
    }
  }


  handleClickPlay = async () => {
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    try {
      const name = await exec(await launchCommand(this.props.name, this.props.userData));
    } catch(error) {
      message.error("There was an error while starting the instance");
      console.error(error);
    }
  }
  render() {
    return (
      <div className={styles.icon}>
        <div className={styles.icon__upContainer}>
          {!this.updateInstallingStatus() &&
            <div className={styles.icon_playText} onClick={this.handleClickPlay}>
              Play
              </div>}
          {this.updateInstallingStatus() &&
            <div className={styles.icon__installing}>
              <Progress type="circle" percent={this.percentage} width={80} />
            </div>}
          <div
            className={styles.icon__image}
            style={{ filter: this.updateInstallingStatus() ? 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale")' : '' }}
          />
        </div>
        <div className={styles.icon__text}>
          {this.props.name}
        </div>
      </div>
    );
  }
}