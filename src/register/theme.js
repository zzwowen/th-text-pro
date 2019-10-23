import jquery from 'jquery';
import {
	store
} from 'utils/';
const env = process.env;
let replaceAllVarColor = (cfg) => {
	if(env['NODE_ENV'] === 'development') {

		let styleDoms = jquery('style').each((item, dom) => {
			if(dom.id !== 'myCustomStyle') {
				let html = dom.innerHTML;
				if(html.includes('var')) {
					for(let o in cfg) {
						let keys = 'var(' + o + ')';
						html = html.replace(keys, cfg[o]);
						dom.innerHTML = html;

					}
				}
			}
		});

	} else {
		let styleDoms = jquery('link').each((item, dom) => {
			let href = dom.href;
			console.log(href)
			jquery.ajax({
				url: href,
				type: 'get', //GET
				async: false, //或false,是否异步
				data: {},
				timeout: 5000, //超时时间
				dataType: 'json', //返回的数据格式：
				complete: function(data) {
					let html = data.responseText;
					if(html.includes('var')) {
						for(let o in cfg) {
							let keys = 'var(' + o + ')';
							html = html.replace(keys, cfg[o]);
						}
						var style = document.createElement('style');
						style.type = 'text/css';
						style.innerHTML = html;
						style.id = 'over_style_' + item;
						let has = jquery('#' + 'over_style_' + item).length;
						if(has) {
							jquery('#' + 'over_style_' + item).html(html);
						} else {
							document.getElementsByTagName('HEAD').item(0).appendChild(style);
						}

					}
				}
			});
		});
	}

}
let setThemeValue = (cfg) => {
	let allStyle = cfg;
	let str = '';
	for(let x in allStyle) {
		str += x + ':' + allStyle[x] + ';'
	}
	var style = document.createElement('style');
	style.id = 'myCustomStyle';
	style.type = 'text/css';
	style.innerHTML = ':root {' + str + '}';
	let has = jquery('#myCustomStyle').length;
	if(has) {
		jquery('#myCustomStyle').html(':root {' + str + '}');
	} else {
		document.getElementsByTagName('HEAD').item(0).appendChild(style);
	}

	replaceAllVarColor(cfg);
}
export default function setTheme() {
	let appTheme = store.get('appTheme');
	if(appTheme) {
		store.set('appTheme', appTheme);
		setThemeValue(appTheme);
	} else {

		let allStyle = {};
		import("../config/Theme.json").then((cfg) => {
			allStyle = cfg;
			store.set('appTheme', cfg);
			setThemeValue(cfg);
		}).catch((err) => {
			console.error(err);
		});

	}
}