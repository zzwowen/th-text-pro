import { AESUtil } from '../AES.js';
const _key = '3clearlz';
const _iv = 'AES_3CLEARLZ';
class Store {
	constructor() {
		this.store = window.localStorage;
		this.prefix = '3clearlz_' //gbs.db_prefix;
	}
	set(key, value, fn) {
//		key = AESUtil.encrypt(this.prefix + key, _key, _iv);
		try {
			value = JSON.stringify(value);
		} catch(e) {
			value = value;
		}
//		value = AESUtil.encrypt(value, _key, _iv);

		this.store.setItem(key, value);

		fn && fn();
	}
	get(key, fn) {
//		key = AESUtil.encrypt(this.prefix + key, _key, _iv);
		if(!key) {
			throw new Error('没有找到key。');
			return;
		}
		if(typeof key === 'object') {
			throw new Error('key不能是一个对象。');
			return;
		}
		var value = this.store.getItem(key);
		if(value !== null) {
			try {
//				value = AESUtil.decrypt(value, _key, _iv);
				value = JSON.parse(value);
				
			} catch(e) {
				value = value;
//				value = AESUtil.decrypt(value, _key, _iv);
			}
		}

		return value;
	}
	remove(key) {
//		key = AESUtil.encrypt(this.prefix + key, _key, _iv);
		this.store.removeItem(key);
	}
}
export default new Store();