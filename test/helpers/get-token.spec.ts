import { UnauthorizedException } from '@nestjs/common';
import { getToken } from 'src/utils/helpers/get-token/get-token';

const VALID_TOKEN = 'Bearer validtoken';
const INVALID_TOKEN = 'invalidtoken';

describe('getToken', () => {
  it('should return token with valid header', () => {
    expect(getToken(VALID_TOKEN, 'Error')).toBe('validtoken');
  });

  it('should throw error with invalid header', () => {
    expect(() => getToken(INVALID_TOKEN, 'Error')).toThrow(
      UnauthorizedException,
    );
  });
});
