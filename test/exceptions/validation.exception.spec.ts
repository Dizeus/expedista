import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationException } from 'src/utils/exceptions/validation.exception';

describe('ValidationException', () => {
  it('should be defined', () => {
    const exception = new ValidationException(['Validation failed']);
    expect(exception).toBeDefined();
    expect(exception).toBeInstanceOf(HttpException);
  });

  it('should have the correct status code and response', () => {
    const messages = ['Validation failed'];
    const exception = new ValidationException(messages);

    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    expect(exception.getResponse()).toEqual(messages);
  });

  it('should have the default status code if not provided', () => {
    const exception = new ValidationException(['Validation failed']);

    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });
});
