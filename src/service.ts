import { get, post } from './common/request'
import { PlainObject, ResData } from './type';

type Res<T> = Promise<ResData<T>>;
type PromiseFn<P, T> = (arg: P) => Res<T>;

export const check: () => Res<any> = () => get('/check')
export const login: PromiseFn<{ name: string; password: string }, PlainObject> = arg => post('/login', arg)
export const logout: () => Res<any> = () => get('/logout');
export const getList: PromiseFn<PlainObject, PlainObject[]> = arg => get('/list', arg)
// export const download = (arg: string) => `${api}/download?ids=${arg}`