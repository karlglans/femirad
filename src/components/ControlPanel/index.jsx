import React from 'react';

const ControlPanel = props => {
  const setButtonText = props.isAllowingNextStep ? 'step' : 'wait'; 
  const bgColor = props.isAllowingNextStep ?
    props.currentPlayer === 1? 'red': 'blue' : 
    props.currentPlayer === 1? 'red': 'blue';
  return (
    <div className={!props.isAllowingNextStep ? 'animate-flicker' : null}
      style={{ position:'absolute', height: 100, width: 100, right: -110, top: 0, backgroundColor: bgColor }}
    >
      <button style={{marginTop: 20}} disabled={!props.isAllowingNextStep} onClick={props.handleStep}> {setButtonText} </button>
    </div>
  );
};

export default ControlPanel;