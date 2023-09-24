import {LocalStoreService, SessionStoreService, StoreService} from './store.service';

export function SessionStored(id?: string) {
  const sessionService: SessionStoreService = new SessionStoreService();
  return (target: any, key: string) => {
    const value = {data: undefined};
    sessionService.getUserId$().subscribe((uid: string | null) => {
      defineProperty(sessionService, value, uid, target, key, NaN, id);
    });
  };
}

export function LocalStored(version: number, id?: string) {
  const localService: LocalStoreService = new LocalStoreService();
  return (target: any, key: string) => {
    const value = {data: undefined};
    localService.getUserId$().subscribe((uid: string | null) => {
      defineProperty(localService, value, uid, target, key, version, id);
    });
  };
}


function defineProperty(storeService: LocalStoreService | SessionStoreService, value: { data: any },
                        uid: string | null, target: any, key: string, version: number, id?: string) {
  const innerValue = value;
  const ident = StoreService.getId(uid, target, key, id);
  Object.defineProperty(target, key, {
    configurable: true,
    set: (val: any) => {
      innerValue.data = storeService.loadCfg({...val, id: ident, version});
    },
    get: () => {
      return innerValue.data;
    }
  });
}
