import { Registry } from ".";

enum UserRole {
  NORMAL,
  ADMIN,
}

class User {
  constructor(
    public readonly userName: string,
    public readonly password: string,
    public readonly role: UserRole,
  ) {}
}

describe('AppController', () => {
  let registry: Registry<User>;

  let uuidTom: string;
  let uuidHerbert: string;
  let uuidAdmin: string;

  beforeEach(() => {
    registry = new Registry<User>();
    uuidTom = registry.insert(new User('Tom', 'MyVeryStrongPassword', UserRole.NORMAL));
    uuidHerbert = registry.insert(new User('Herbert', 'ThisIsVerySecure', UserRole.ADMIN));
    uuidAdmin = registry.insert(new User('admin', 'admin', UserRole.ADMIN));
  });

  it('insert user', () => {
    const uuid: string = registry.insert(new User('TestUser', '123', UserRole.NORMAL ));
    expect(uuid).not.toBeUndefined();
    expect(uuid).toMatch(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/);
  });

  it('find first user', () => {
    const tom: User | undefined = registry.findOne();
    expect(tom).not.toBeUndefined();
    expect(tom).toEqual(new User('Tom', 'MyVeryStrongPassword', UserRole.NORMAL));
  });

  it('find user by uuid', () => {
    const tom: User | undefined = registry.findOne({ uuid: uuidTom });
    expect(tom).not.toBeUndefined();
    expect(tom).toEqual(new User('Tom', 'MyVeryStrongPassword', UserRole.NORMAL));
  });

  it('find user by username', () => {
    const herbert: User | undefined = registry.findOne({ where: { userName: 'Herbert' } });
    expect(herbert).not.toBeUndefined();
    expect(herbert).toEqual(new User('Herbert', 'ThisIsVerySecure', UserRole.ADMIN));
  });

  it('find user by username and password', () => {
    const admin: User | undefined = registry.findOne({ where: { userName: 'admin', password: 'admin' } });
    expect(admin).not.toBeUndefined();
    expect(admin).toEqual(new User('admin', 'admin', UserRole.ADMIN));
  });

  it('find all users', () => {
    const users: User[] | undefined = registry.find();
    expect(users).not.toBeUndefined();
    expect(users).toEqual([
      new User('Tom', 'MyVeryStrongPassword', UserRole.NORMAL),
      new User('Herbert', 'ThisIsVerySecure', UserRole.ADMIN),
      new User('admin', 'admin', UserRole.ADMIN)
    ]);
  });

  it('find users by role', () => {
    const users: User[] | undefined = registry.find({ where: { role: UserRole.ADMIN } });
    expect(users).not.toBeUndefined();
    expect(users?.length).toEqual(2);
    expect(users).toEqual([
      new User('Herbert', 'ThisIsVerySecure', UserRole.ADMIN),
      new User('admin', 'admin', UserRole.ADMIN)
    ]);
  });

  it('find uuid by find options', () => {
    const uuid: string | undefined = registry.findUuid({ where: { userName: 'Herbert' } });
    expect(uuid).not.toBeUndefined();
    expect(uuid).toEqual(uuidHerbert);
  });

  it('find uuid by uuid', () => {
    const uuid: string | undefined = registry.findUuid({ uuid: uuidHerbert });
    expect(uuid).not.toBeUndefined();
    expect(uuid).toEqual(uuidHerbert);
  });

  it('delete user with uuid', () => {
    const response: boolean = registry.delete({ uuid: uuidTom });
    const tom: User | undefined = registry.findOne({ uuid: uuidTom });
    expect(response).toEqual(true);
    expect(tom).toBeUndefined();
  });

  it('delete user with find options', () => {
    const response: boolean = registry.delete({ where: { userName: 'Tom' } });
    const tom: User | undefined = registry.findOne({ where: { userName: 'Tom' } });
    expect(response).toEqual(true);
    expect(tom).toBeUndefined();
  });

  it(`return false because user doesn't exists (delete)`, () => {
    const response: boolean = registry.delete({ where: { userName: 'NotExistingUser' } });
    const tom: User | undefined = registry.findOne({ where: { userName: 'Tom' } });
    expect(response).toEqual(false);
    expect(tom).toBeDefined();
  });

  it('return undefined if registry empty (findOne)', () => {
    registry = new Registry<User>();
    const user: User | undefined = registry.findOne();
    expect(user).toBeUndefined();
  });

  it('return "invalid-uuid" if options missing (findUuid)', () => {
    const uuid: string | undefined = registry.findUuid({});
    expect(uuid).toEqual('invalid-uuid');
  });

});
