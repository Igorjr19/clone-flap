import { dia } from '@joint/core';

export const useEvents = (
  paper: dia.Paper,
  setsSelected: React.Dispatch<React.SetStateAction<dia.CellView | null>>,
) => {
  paper.on('cell:pointerdown', (cellView) => {
    setsSelected(cellView);
    cellView.highlight();
  });

  paper.on('blank:pointerdown', () => {
    setsSelected(null);
    paper.model.getCells().forEach((cell) => {
      paper.findViewByModel(cell)?.unhighlight();
    });
  });
};
