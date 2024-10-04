import { formatInfo } from 'src/utils/helpers/format-info';

const INFO = {
  timestamp: '123',
  level: '1',
  message: 'hello',
};

describe('formatInfo', () => {
  it('should return formated info', () => {
    expect(formatInfo(INFO)).toBe('123 1: hello');
  });
});
