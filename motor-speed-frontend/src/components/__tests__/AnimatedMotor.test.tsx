import { render } from '@testing-library/react';
import AnimatedMotor from '../AnimatedMotor';

describe('AnimatedMotor', () => {
  it('renders without crashing', () => {
    render(<AnimatedMotor rpm={1000} />);
  });
});
