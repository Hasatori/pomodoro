import { UserTodosFilterPipe } from './user-todos-filter.pipe';

describe('UserTodosFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new UserTodosFilterPipe();
    expect(pipe).toBeTruthy();
  });
});
