import { getArgs } from './args';

let mockExit: jest.SpyInstance = null!;
beforeEach(() => {
  mockExit = jest.spyOn(process, 'exit').mockImplementation((number) => { throw new Error(`process.exit: ${number}`); });
});

afterEach(() => {
  mockExit.mockRestore();
});

function doTest(...args: string[]) {
  try {
    const input = [process.argv[0] as string, process.argv[1] as string, ...args];
    return getArgs(input);
  } catch (e) {
    return { $exit: mockExit.mock.lastCall[0] };
  }
}

describe('args', () => {
  it('--port', () => {
    const res = doTest('--port', '300');
    expect(res).toMatchObject({ port: 300 });
  });
  it('--port NG', () => {
    const res = doTest('--port', '3X00');
    expect(res).toEqual({ $exit: 1 });
  });
  it('--ejs', () => {
    const res = doTest('--ejs', 'list.ejs');
    expect(res).toMatchObject({ ejs: 'list.ejs' });
  });
  it('--version', () => {
    const res = doTest('--version');
    expect(res).toEqual({ $exit: 0 });
  });
});
