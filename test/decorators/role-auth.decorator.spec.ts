import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from 'src/assets/constants/roles';
import { Role } from 'src/utils/decorators/role-auth.decorator';

describe('Role Decorator', () => {
  it('should set the correct role metadata', () => {
    const testRole = 'admin';

    class TestClass {
      @Role(testRole) 
      testMethod() {}
    }

    const reflector = new Reflector();

    const roleMetadata = reflector.get<string>(
      ROLE_KEY,
      TestClass.prototype.testMethod,
    );

    expect(roleMetadata).toBe(testRole);
  });
});
