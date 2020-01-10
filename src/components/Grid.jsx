import React from 'react';

const style = { 
  flex: -1,
  width: 36,
  height: 36,
  backgroundColor: '#99af11', 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 24,
  borderWidth: 1.5,
  cursor: 'pointer',
  color: '#fff'
}

function GridCell (props) {
  return (
    <div
      style={{ ...style, 
        backgroundColor: props.cellState === 1 ? 'red' : props.cellState === 2 ? 'blue' : '#aaa' }}
      onClick={() => props.clickhandler(props.cellIdx)} >
      {props.flicker? null : props.cellState}
    </div>
  );
}

// className={'animate-flicker'}

class Grid extends React.Component {
  render() {
    return (
      <div style={{ display:'flex', flexFlow: 'row wrap', height: 600, width: 600 }}>
        {
          [...this.props.gameBoard].map((cellState, i) => (
            <GridCell
              key={i}
              cellIdx={i}
              clickhandler={this.props.handleClickCell}
              cellState={cellState}
              flicker={this.props.lastChangedCellIdx === i}
            />
          ))
        }
      </div>
    );
  }
}

export default Grid;