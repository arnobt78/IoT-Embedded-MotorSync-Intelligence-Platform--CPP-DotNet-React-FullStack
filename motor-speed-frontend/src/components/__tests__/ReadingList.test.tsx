import { render } from '@testing-library/react';
import ReadingList from '../ReadingList';

describe('ReadingList', () => {
  it('renders grouped readings', () => {
    render(<ReadingList readings={[]} />);
  });
});
