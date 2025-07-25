import { render } from '@testing-library/react';
import AnimatedMotor from './AnimatedMotor';

test('renders without crashing', () => {
  render(<AnimatedMotor rpm={1200} />);
});
