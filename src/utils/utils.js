import _ from 'lodash'
//utils
import FileSaver from 'file-saver';
import {dateUtils} from "utils/dateUtils";
import lib__ from 'underscore';

const GRADE_COLORS = ["#B5B5B5",
    "#00e400",
    "#FFFF00",
    "#ff7e00",
    "#FF0000",
    "#99004c",
    "#7e0023"];
export let utils = {
    getGradeInfo: function (aqi) {
        let level = "-";
        let color = "";
        let grade = 0;

        if (aqi === "-999" || aqi === "-999.0" || aqi === "-999.00" || aqi === undefined || aqi === null || aqi === "--" || aqi === "-" || aqi === "" || aqi === -999) {
            color = GRADE_COLORS[0];
            aqi = '-';
            grade = 0;
        } else if (aqi <= 50 && aqi >= 0) {
            level = "优";
            color = GRADE_COLORS[1];
            grade = 1;
        } else if (aqi > 50 && aqi <= 100) {
            level = "良";
            color = GRADE_COLORS[2];
            grade = 2;
        } else if (aqi > 100 && aqi <= 150) {
            level = "轻度污染";
            color = GRADE_COLORS[3];
            grade = 3;
        } else if (aqi > 150 && aqi <= 200) {
            level = "中度污染";
            color = GRADE_COLORS[4];
            grade = 4;
        } else if (aqi > 200 && aqi <= 300) {
            level = "重度污染";
            color = GRADE_COLORS[5];
            grade = 5;
        } else {
            level = "严重污染";
            color = GRADE_COLORS[6];
            grade = 6;
        }
        return {
            level: level,
            color: color,
            aqi: aqi,
            grade: grade
        };
    },

    /*通过浓度值获取指定污染物的分指数
    *pol污染物
    * density 浓度值
    * */
    getAqiByPollutant: function (pol, density) {
        if (!pol || !density || density === "-" || density === "")
            return '-';
        let IAQI = [0, 50, 100, 150, 200, 300, 400, 500];
        let POLLUTANT = {
            pm25: [0, 35, 75, 115, 150, 250, 350, 500],
            pm10: [0, 50, 150, 250, 350, 420, 500, 600],
            so2: [0, 50, 150, 475, 800, 1600, 2100, 2620],
            no2: [0, 40, 80, 180, 280, 565, 750, 940],
            co: [0, 2, 4, 14, 24, 36, 48, 60],
            o3_1h: [0, 160, 200, 300, 400, 800, 1000, 1200],
            o3_8h: [0, 100, 160, 215, 265, 800, 1000, 1200]
        };
        let polArr = POLLUTANT[pol.toLowerCase()];
        let idx = 7;
        for (let i = 0; i < polArr.length; i++) {
            if (polArr[i] >= density) {
                idx = i;
                break;
            }
        }
        if (idx === 7)
            return 500;
        else if (idx === 0)
            return 0;
        else
            return Math.ceil((IAQI[idx] - IAQI[idx - 1]) / (polArr[idx] - polArr[idx - 1]) * (density - polArr[idx - 1]) + IAQI[idx - 1]);
    },

    /**
     * 获取指定浓度的超标倍数
     * @param pollutantStr  污染物类型(pm25，pm10，so2，no2，co，o3)
     * @param potency  指定污染物的浓度
     * @returns {*} 超标倍数
     */
    getPotencyExceedTimes: function (pollutantStr, potency, dateType) {
        if (pollutantStr === "" || potency === "" || potency < 0||potency===undefined||potency===null) return "-";
        else {
            let secondStandard = {
                pm25: dateType === "day" ? 75 : 35,
                pm10: dateType === "day" ? 150 : 70,
                so2: dateType === "day" ? 150 : 60,
                no2: dateType === "day" ? 80 : 40,
                co: 4,
                o3: 160
            };
            if (potency < secondStandard[pollutantStr]) return "";
            else
                return Number(((potency - secondStandard[pollutantStr]) / secondStandard[pollutantStr]).toFixed(2));
        }
    }
    ,

    /*通过iaqi获取指定污染物的浓度
    *iaqi 分指数
    *pollutant 污染物
    */
    getPotency: function (iaqi, pollutant) {
        iaqi = parseInt(iaqi);
        if (iaqi <= 0) {
            return 0;
        }
        let aqi = [0, 50, 100, 150, 200, 300, 400, 500]
        let pPotencys = {
            'so2': [0, 50, 150, 475, 800, 1600, 2100, 2620],
            'no2': [0, 40, 80, 180, 280, 565, 750, 940],
            'pm10': [0, 50, 150, 250, 350, 420, 500, 600],
            'co': [0, 2, 4, 14, 24, 36, 48, 60],
            'o3': [0, 100, 160, 215, 265, 800, 1000, 1200],
            'pm25': [0, 35, 75, 115, 150, 250, 350, 500]
        };
        let pPotency = pPotencys[pollutant];
        if (!pPotency) {
            return 0;
        }
        let iaqimin, iaqimax;
        let pmin, pmax;
        let index = -1;
        for (let i = 1; i < aqi.length; i++) {
            if (iaqi > aqi[i - 1] && iaqi <= aqi[i]) {
                index = i;
                break;
            }
        }
        if (index < 0) {
            index = aqi.length - 1;
            return pPotency[index];
        }
        iaqimin = aqi[index - 1];
        iaqimax = aqi[index];
        pmin = pPotency[index - 1];
        pmax = pPotency[index];
        let param = (iaqimax - iaqimin) / (pmax - pmin);
        let potency = (iaqi - iaqimin) / param + pmin;
        let digit = 0;
        if (pollutant.toLowerCase() === 'co') {
            digit = 1;
        }
        potency = Math.round(potency * Math.pow(10, digit)) / Math.pow(10, digit);
        return potency;

    }
    ,

    deepCopy: function (obj) {
        // return JSON.parse(JSON.stringify(obj))
        if (typeof obj === "object") {
            if (_.isArray(obj)) {
                let newArr = [];
                for (let i = 0; i < obj.length; i++) newArr.push(obj[i]);
                return newArr;
            } else {
                let newObj = {};
                for (let key in obj) {
                    newObj[key] = this.deepCopy(obj[key]);
                }
                return newObj;
            }
        } else {
            return obj;
        }
    }
    ,
    //配合数组自带的sort进行按照数组中对象的属性进行自定义排序，支持多个属性排序
    sortByProps: function (item1, item2) {
        var props = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            props[_i - 2] = arguments[_i];
        }

        var cps = []; // 存储排序属性比较结果。
        // 如果未指定排序属性，则按照全属性升序排序。
        var asc = true;
        if (props.length < 1) {
            for (var p in item1) {
                if (item1[p] > item2[p]) {
                    cps.push(1);
                    break; // 大于时跳出循环。
                } else if (item1[p] === item2[p]) {
                    cps.push(0);
                } else {
                    cps.push(-1);
                    break; // 小于时跳出循环。
                }
            }
        } else {
            for (var i = 0; i < props.length; i++) {
                var prop = props[i];
                for (var o in prop) {
                    asc = prop[o] === "asc";
                    if (item1[o] > item2[o]) {
                        cps.push(asc ? 1 : -1);
                        break; // 大于时跳出循环。
                    } else if (item1[o] === item2[o]) {
                        cps.push(0);
                    } else {
                        cps.push(asc ? -1 : 1);
                        break; // 小于时跳出循环。
                    }
                }
            }
        }

        for (var j = 0; j < cps.length; j++) {
            if (cps[j] === 1 || cps[j] === -1) {
                return cps[j];
            }
        }
        return 0;
    }
    ,

    addSubToLabel: function (label) {
        let pol = label.toUpperCase();
        let flg = false;
        if (pol.indexOf("NO2") !== -1) {
            flg = true;
            pol = pol.replace(/NO2/g, "NO<sub>2</sub>");
        }
        if (pol.indexOf("SO2") !== -1) {
            flg = true;
            pol = pol.replace(/SO2/g, "SO<sub>2</sub>");
        }
        if (pol.indexOf("O3") !== -1) {
            flg = true;
            pol = pol.replace("O3", "O<sub>3</sub>");
        }
        if (pol.indexOf("PM2.5") !== -1) {
            flg = true;
            pol = pol.replace("PM2.5", "PM<sub>2.5</sub>");
        }
        if (pol.indexOf("PM25") !== -1) {
            flg = true;
            pol = pol.replace("PM25", "PM<sub>2.5</sub>");
        }
        if (pol.indexOf("PM10") !== -1) {
            flg = true;
            pol = pol.replace("PM10", "PM<sub>10</sub>");
        }
        if (pol.indexOf("CO") !== -1) {
            flg = true;
        }
        if (flg)
            return pol;
        else
            return label;
    }
    ,

    /*墨卡托转经纬度*/
    mercatorToLatLon: function (Point) {

        let templat = Point.y / (6378137 * Math.PI) * 180;
        return {
            lng: Point.x / (6378137 * Math.PI) * 180,
            lat: 180 / Math.PI * (2 * Math.atan(Math.exp(templat * Math.PI / 180)) - Math.PI / 2)
        };
    }
    ,

    /*经纬度转墨卡托*/
    latLonToMercator: function (latlon) {

        return [
            latlon[0] * 6378137 * Math.PI / 180,
            Math.log(Math.tan((90 + latlon[1]) * Math.PI / 360)) * 6378137
        ];
    }
    ,

    /**
     *  获取当前时刻应该加载图片的信息
     * @param pDate 产品时间
     * @param qDate 查询时间
     * @param timeRes 时间分辨率 几小时一个数据
     * @param figureRes 图片分辨率 一张图片代表个时刻的数据
     * @param dateType
     * @returns {{t: number, model: number, figure1Name: (*|string), figure2Name: (*|string)}}
     * @private
     */
    getCurrFigureInfo: function (pDate, qDate, timeRes, figureRes, dateType) {
        let dType = dateType || 'hour';
        let format = dType === 'hour' ? 'yyyy-MM-dd 20:00:00' : 'yyyy-MM-dd 00:00:00';
        let intervalType = dType === 'hour' ? 'h' : 'd';
        let interNum = dType === 'hour' ? 1 : 24;
        const INTERVAL_NUM = timeRes;//时间分辨率
        const TIME_INTERVAL_NUM = figureRes;//图片分辨率（一张图片包含几个时刻的数据)
        let pDateStr = dateUtils.dateToStr(format, pDate);
        let pDateTime = dateUtils.strToDate(pDateStr);
        let yyyyMMddHH = dateUtils.dateToStr('yyyyMMdd20', pDate);
        let diff = dateUtils.dateDiff(intervalType, pDateTime, qDate);
        diff = dType === 'hour' ? diff : diff - 1;
        let interval = parseInt(diff / INTERVAL_NUM);
        let pNum = parseInt(interval / TIME_INTERVAL_NUM);
        let num = pNum * (TIME_INTERVAL_NUM * INTERVAL_NUM);
        num = dType === 'hour' ? num : num + 1;
        let currFigureDate = dateUtils.dateAdd(intervalType, num, pDateTime);
        let currFigureName = dateUtils.dateToStr('yyyyMMddHH', currFigureDate);
        let figureNum = dateUtils.dateDiff(intervalType, currFigureDate, qDate);

        let figure1Name = currFigureName;
        let figure2Name = currFigureName;
        let t = 0;
        let model = 0;

        if (figureNum / INTERVAL_NUM <= 1) {//仅需一张图片
            model = 0;
            t = figureNum / INTERVAL_NUM;
        } else {//需请求两种图片
            model = 1;
            t = (figureNum - INTERVAL_NUM) / INTERVAL_NUM;
            currFigureDate = dateUtils.dateAdd('h', TIME_INTERVAL_NUM * INTERVAL_NUM, currFigureDate);
            figure2Name = dateUtils.dateToStr('yyyyMMddHH', currFigureDate);
        }
        console.log({
            t, model, figure1Name, figure2Name
        });
        return {
            t, model, figure1Name, figure2Name
        }
    }
    ,
    /**
     *  导出表格
     * 参数dataOption  Object类型
     * 属性：
     *    ws_val:[] 表格数据，Array
     *  ws_name:'' 表格名字，String
     *  ws_type:'' 表格格式，String   "xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
     *    ws_merge:[] 合并单元格的数组 Array
     *    cellStyle:{} 单元格样式 Object
     *  cellfilter:function (cell,C,R)自定义单元格函数 对单元格进行过滤 返回cell表示当前单元格信息 ，C表示当前单元格所在的列的索引，R表示行的索引
     * @private
     */
    toExcel: function (dataOption) {
        let cell_s = {
            alignment: {
                horizontal: 'center',
                vertical: 'center'
            },
            font: {
                name: '微软雅黑',
                sz: 12,
                color: {
                    rgb: "222222"
                }

            },
            fill: {
                fgColor: {
                    rgb: "f6f6f6"
                }
            },
            border: {
                right: {
                    style: 'thin',
                    color: {
                        rgb: '222222'
                    }
                },
                bottom: {
                    style: 'thin',
                    color: {
                        rgb: '222222'
                    }
                },
                left: {
                    style: 'thin',
                    color: {
                        rgb: '222222'
                    }
                },
                top: {
                    style: 'thin',
                    color: {
                        rgb: '222222'
                    }
                }
            }

        };
        let defaultOption = {
            ws_val: [],//表格数据
            ws_name: "表格",//初始化表名
            ws_type: "xlsx",//初始化格式"xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
            ws_merge: [],//初始化合并的数组
            cellStyle: cell_s,//表格初始化样式
            ws_sheetName:[],
            exportType:'single',//single单个sheet multiple多个sheet
            dateFormat: "YYYY-MM-DD",
            cellfilter: (cell, C, R) => {
                return cell
            }


        };

        function Workbook() {
            if (!(this instanceof Workbook)) return new Workbook();
            this.SheetNames = [];
            this.Sheets = {};
        };

        function datenum(v, date1904) {
            if (date1904) v += 1462;
            var epoch = Date.parse(v);
            return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
        }

        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        };
        /* convert state to workbook */
        let data = [];
        let objs = {};

        for (let x in defaultOption) {
            if (dataOption && dataOption[x]) {
                objs[x] = dataOption[x];
            } else {
                objs[x] = defaultOption[x];
            }
        }

        const wb = new Workbook();
		if(objs.exportType==='multiple'){
			let newData=objs['ws_val'];

			for(let n=0;n<newData.length;n++){
				let new_ws=sheet_from_array_of_arrays(newData[n], objs);
				new_ws['!merges'] = objs['ws_merge'][n];
				let sheetName=objs['ws_sheetName'][n]?objs['ws_sheetName'][n]:('sheet_'+n);
				wb.SheetNames.push(sheetName);
        wb.Sheets[sheetName] = new_ws;
			}

		}else{
        data = objs['ws_val'];
        const ws = sheet_from_array_of_arrays(data, objs);
        let ws_sheetName=objs['ws_sheetName'][0]?objs['ws_sheetName'][0]:objs['ws_name'];

        ws['!merges'] = objs['ws_merge'];



        var ws_name = ws_sheetName;
        wb.SheetNames.push(ws_name);
        wb.Sheets[ws_name] = ws;
       }
		let wsTitle = objs['ws_name'] + "." + objs['ws_type'];
        /* generate XLSX file */
        const wbout = XLSX.write(wb, {
            type: "binary",
            bookType: objs['ws_type']

        });
        /* send to client */
        FileSaver.saveAs(new Blob([s2ab(wbout)], {
            type: "application/octet-stream"
        }), wsTitle);

        function sheet_from_array_of_arrays(data, opts) {

            var ws = {};
            ws['!cols'] = [];
            var range = {
                s: {
                    c: 10000000,
                    r: 10000000
                },
                e: {
                    c: 0,
                    r: 0
                }
            };
            for (var R = 0; R != data.length; ++R) {
                for (var C = 0; C != data[R].length; ++C) {
                    if (range.s.r > R) range.s.r = R;
                    if (range.s.c > C) range.s.c = C;
                    if (range.e.r < R) range.e.r = R;
                    if (range.e.c < C) range.e.c = C;
                    var cell = {
                        v: data[R][C]
                    };

                    if (cell.v == null) continue;
                    var cell_ref = XLSX.utils.encode_cell({
                        c: C,
                        r: R
                    });

                    if (typeof cell.v === 'number') cell.t = 'n';
                    else if (typeof cell.v === 'boolean') cell.t = 'b';
                    else if (cell.v instanceof Date) {
                        cell.t = 's';

                        cell.v = dateUtils.dateToStr(opts.dateFormat, cell.v);

                        ws['!cols'][C] = {
                            wpx: 150
                        }
                    } else {


                        cell.t = 's';
                        ws['!cols'][C] = {wpx: 100};
//							if(cell.v.length){
//								let w=cell.v.length*8;
//								if(ws['!cols'][C]!==undefined&&ws['!cols'][C]['wpx']){
//									if(ws['!cols'][C]['wpx']<w){
//										ws['!cols'][C]={wpx:w};
//									}
//								}else{
//									if(w<100) w=70;
//									ws['!cols'][C]={wpx:w};
//								}
//
//							}

                    }


                    if (opts.cellStyle) {
                        cell.s = opts.cellStyle;
                    } else {
                        cell.s = defaultOption['cellStyle'];
                    }
                    if (opts.cellfilter) {
                        cell = opts.cellfilter(_.cloneDeep(cell), C, R);

                    }

                    ws[cell_ref] = cell;


                }
            }
            if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
            return ws;
        }
    }
    ,
    keepWeaTargetDecimal: function (value, target) {
        ///value气象要素值，target是气象要素的字段
        ///气象要素保留小数位数， 温度、降水、风保留一位小数    气压、湿度整数
        if (typeof value === 'number' && target) {
            if (target.indexOf('tem') > -1 || target.indexOf('rain') > -1 || target.indexOf('windspeed') > -1 || target.indexOf("dewpoint") > -1) {
                value = parseInt(value) !== value ? value.toFixed(1) : value.toFixed(0);
                if (String(value).split(".").length > 1 && String(value).split(".")[1] === "0") {
                    value = parseInt(value);
                }
            } else if (target.indexOf('pressure') > -1 || target.indexOf('hum') > -1) {
                value = parseInt(value);
            }
        }
        return value
    }
    ,
    getFigurePath: function (figureType, obj,prj) {
        let basePath = 'figure_lz';
        if(prj==1){
            basePath = 'figure_ll';
        }
        let figurePath;
        let tpl = lib__.template;
        switch (figureType) {

            case "mPol"://污染实测分布图  figure_gis/figure_lz/figure_gis/ObsPol/ConcSpa/hourly/AQI/2018/2018020700/AQI_d01_z1_Observation_2018020714_2.png
                basePath += '/figure_gis/ObsPol/ConcSpa';
                figurePath = tpl("<%= dateType %>/<%= name %>/<%= year%>/<%= currtDate%>/<%=target%>_<%= domain%>_<%=zIndex%>_<%= model%>_<%= time%>_2.png");
                break;
            case "mWea"://气象实测分布图 figure_gis/figure_lz/figure_gis/ObsMet/ConcSpa/hourly/RAIN3/2018/2018020700/RAIN3_d03_z1_Observation_2018020708_2.png
                basePath += '/figure_gis/ObsMet/ConcSpa';
                figurePath = tpl("<%= dateType %>/<%= name %>/<%= year%>/<%= currtDate%>/<%=target%>_<%= domain%>_<%=zIndex%>_<%= model%>_<%= time%>_2.png");
                break;
            case "mJson"://实测json figure_gis/figure_lz/figure_gis/ObsMet/ConcSpa/hourly/RAIN3/2018/2018020700/RAIN3_d03_z1_Observation_2018020708_2.json
                basePath += '/figure_gis/ObsMet/ConcSpa';
                figurePath = tpl("<%= dateType %>/<%= name %>/<%= year%>/<%= currtDate%>/<%=target%>_<%= domain%>_<%=zIndex%>_<%= model%>_<%= time%>.json");
                break;
            case "fPol"://污染预报分布图 V:\post\figure_lz\figure_gis\Pol\ConcSpa\hourly\AQI\2018\2018020420\AQI_d01_z1_CMAQ_2018020500_2.png
                basePath += '/figure_gis/Pol/ConcSpa';
                figurePath = tpl("<%= dateType %>/<%= name %>/<%= year%>/<%=pDate%>/<%=target%>_<%=domain%>_<%=zIndex%>_<%=model%>_<%=time%>_2.png");
                break;
            case "fWeaSpa"://气象预报分布图  V:\post\figure_lz\figure_gis\Met\MetSpa\hourly\AOD\2018\2018020420\AOD_d01_z1_NAQPMS_2018020500_2.png
                basePath += '/figure_gis/Met/MetSpa';
                figurePath = tpl("<%= dateType %>/<%= name %>/<%= year%>/<%=pDate%>/<%=target%>_<%=domain%>_<%=zIndex%>_<%=model%>_<%=time%>_2.png");
                break;
            case "fWeaChart"://气象预报分布图 V:\post\figure_lz\figure_gis\Met\WeaChart\hourly\P500\2018\2018020420\P500rh_d01_z12_WRF_2018021408_2.png
                basePath += '/figure_gis/Met/WeaChart';
                figurePath = tpl("<%= dateType %>/<%= name %>/<%= year%>/<%=pDate%>/<%=target%>_<%=domain%>_<%=zIndex%>_<%=model%>_<%=time%>_2.png");
                break;
            case "fJson"://预报json  V:\post\figure_lz\figure_gis\Met\WeaChart\hourly\P500\2018\2018020420\P500height_d01_z12_WRF_2018020707.json
                basePath += '/figure_gis/Met/WeaChart';
                figurePath = tpl("<%= dateType %>/<%= name %>/<%= year%>/<%=pDate%>/<%=target%>_<%=domain%>_<%=zIndex%>_<%=model%>_<%=time%>.json");
                break;
            case "gJson"://GFS json V:\post\figure_gis\figure_gfs\MetPic\1p00\2018\2018010120\gfs_1p00_press_z1_2018020723.json
                basePath += '/figure_gfs/MetJson';
                figurePath = tpl("<%= deg %>/<%= year %>/<%= pdate%>/<%=type%>_<%=deg%>_<%=target%>_<%=zIndex%>_<%= time%>.json");
                break;
            case "gWea"://GFS分布图 V:\post\figure_gis\figure_gfs\MetPic\1p00\2018\2018010120\gfs_1p00_wind_z1_2018010420_2.png
                basePath += '/figure_gfs/MetPic';
                figurePath = tpl("<%= deg %>/<%= year %>/<%= pdate%>/<%=type%>_<%=deg%>_<%=target%>_<%=zIndex%>_<%= time%>_2.png");
                break;
            default:
                break;
        }
        if (!figurePath)
            return '';
        else
            return basePath + '/' + figurePath(obj);

    },
    /**
     *  根据当前登录的用户把当前市在树状图中设置首位
     * @param jsonData 树状列表数据
     * @param citycode 当前登录的城市code
     * @param isCBox 是否是多选
     * @param type    树类型  城市/站点
     * @returns{treeData:[],checked:[],curData:[]}
     * treeData是站点树数据，checked选择节点code，curData选中节点的对象
     *
     */
    formatTreeDataByCityCode: function (jsonData, citycode, isCBox, type) {
        if (citycode && citycode !== null) {
            let checked = [];
            let expend = [];
            let newObj;
            let curData = [];
            let newData = _.cloneDeep(jsonData);
            for (let i = 0; i < newData.length; i++) {
                let codeType = newData[i].type;
                if (codeType === 'city' && citycode === newData[i].code) {
                    newObj = _.cloneDeep(newData[i]);
                    if (type === "city") {
                        checked = [citycode];
                        curData = [newObj];
                        if (isCBox) {
                            for (let a = 0; a < newData.length; a++) {
                                if (checked.indexOf(newData[a].code) < 0) {
                                    checked.push(newData[a].code);
                                    curData.push(newData[a]);
                                    // if (checked.length === 3) {
                                    //     break;
                                    // }
                                }

                            }
                        }
                    } else if (type === "station") {
                        if (newData[i].children && newData[i].children.length > 0) {
                            if (isCBox) {
                                for (let o = 0; o < newData[i].children.length; o++) {
                                    if (o <= 5) {
                                        checked.push(newData[i].children[o].code);
                                        curData.push(newData[i].children[o]);
                                    }
                                }
                            } else {
                                checked = [newData[i].children[0].code];
                                curData = [newData[i].children[0]];
                            }
                        }
                    }
                    newData.splice(i, 1);
                    newData.unshift(newObj);
                    break
                } else if (codeType === "province" && newData[i].children) {
                    for (let p = 0; p < newData[i].children.length; p++) {
                        let res = utils.formatTreeDataByCityCode(newData[i].children, citycode, isCBox, type);
                        newData[i].children = res.treeData;
                        if (res.checked.length > 0) {
                            checked = res.checked;
                            curData = res.curData;
                            break
                        }
                    }
                }
            }
            return {
                treeData: newData,
                checked: checked,
                curData: curData
            }
        }

    },

    /**
     * 根据一组颜色和分级个数生成渲染GIS图所需颜色数组
     * @param hexColors hex格式的颜色数组 ["#00FFFF", "#FF00FF", "#FFFF00"]
     * @param colorNum  分级个数
     *
     */
    generateRenderColor: function (hexColors, colorNum) {
        if (hexColors.length > 1) {
            let step = parseInt(colorNum / (hexColors.length - 1));
            let m = colorNum % (hexColors.length - 1);
            let colorArr = [];
            for (let i = 0; i < hexColors.length - 1; i++) {
                let num = i < m ? step + 1 : step;
                let tmpArr = this.gradientColor(hexColors[i], hexColors[i + 1], num, true);
                colorArr = colorArr.concat(tmpArr);
            }
            return colorArr;
        } else {
            let colors = [];
            if (hexColors[0]) {
                let rgb = this.colorHex2Rgb(hexColors[0]);
                colors.push([rgb[0], rgb[1], rgb[2], 255]);
            }
            return colors;
        }
    },


    gradientColor: function (startColor, endColor, step, isRenderColor) {
        let startRGB = this.colorHex2Rgb(startColor);//转换为rgb数组模式
        let startR = startRGB[0];
        let startG = startRGB[1];
        let startB = startRGB[2];

        let endRGB = this.colorHex2Rgb(endColor);
        let endR = endRGB[0];
        let endG = endRGB[1];
        let endB = endRGB[2];

        let sR = (endR - startR) / step;
        let sG = (endG - startG) / step;
        let sB = (endB - startB) / step;

        let colorArr = [];
        for (let i = 0; i < step; i++) {
            if (isRenderColor) {//分布图渲染用的颜色
                colorArr.push(parseInt((sR * i + startR)), parseInt((sG * i + startG)), parseInt((sB * i + startB)), 255);
            } else {
                //计算每一步的hex值
                let hex = this.colorRgb2Hex('rgb(' + parseInt((sR * i + startR)) + ',' + parseInt((sG * i + startG)) + ',' + parseInt((sB * i + startB)) + ')');
                colorArr.push(hex);
            }

        }
        return colorArr;
    },

    // 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
    colorHex2Rgb: function (color) {
        let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        let sColor = color.toLowerCase();
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                let sColorNew = "#";
                for (let i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            let sColorChange = [];
            for (let i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            return sColorChange;
        } else {
            return sColor;
        }
    },

    // 将rgb表示方式转换为hex表示方式
    colorRgb2Hex: function (rgb) {
        let _this = rgb;
        let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        if (/^(rgb|RGB)/.test(_this)) {
            let aColor = _this.replace(/(?:(|)|rgb|RGB)*/g, "").split(",");
            let strHex = "#";
            for (let i = 0; i < aColor.length; i++) {
                let hex = Number(aColor[i]).toString(16);
                hex = hex < 10 ? 0 + '' + hex : hex;// 保证每个rgb的值为2位
                if (hex === "0") {
                    hex += hex;
                }
                strHex += hex;
            }
            if (strHex.length !== 7) {
                strHex = _this;
            }
            return strHex;
        } else if (reg.test(_this)) {
            let aNum = _this.replace(/#/, "").split("");
            if (aNum.length === 6) {
                return _this;
            } else if (aNum.length === 3) {
                let numHex = "#";
                for (let i = 0; i < aNum.length; i += 1) {
                    numHex += (aNum[i] + aNum[i]);
                }
                return numHex;
            }
        } else {
            return _this;
        }
    },
    getCookie: function (name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }


};
