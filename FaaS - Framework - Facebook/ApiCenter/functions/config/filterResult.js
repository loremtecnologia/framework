function Filter(filter, data) {
    console.log('aqui')
    console.log(filter)
    console.log(data)

    return result = new Promise(function (resolve, reject) {
        try {
            var _from = [];
            var _data = [];

            if (data.constructor === Object)
                _data.push(data);
            else
                _data = data;

            //_data.push(data);       
            var path = _data[0];

            if (filter.from && filter.from != "") {
                var level = filter.from.split('.');
                for (var index = 0; index < level.length; index++) {
                    var element = level[index];
                    path = path[element];
                }
            }

            if (path.constructor === Object)
                _from.push(path);
            else
                _from = path;

            var result = linq.from(_from).toArray();
            var _resultWhere = [];

            if (filter.where != "" && filter.where) {
                if (filter.where.indexOf('*=') > -1) {
                    var _obj = filter.where.replace('$', '').replace('.', '').trim();
                    var _objetoIndex = _obj.indexOf('*=');
                    var _objeto = _obj.replace(/\*|=/gi, '').slice(0, _objetoIndex).trim();

                    var _valIndex = filter.where.indexOf('*=');
                    var _val = filter.where.slice(_valIndex, _valIndex.length).replace(/\*|=|'/gi, '').toLowerCase().trim();

                    result.forEach(function (element) {
                        var _element = element;
                        var level = _objeto.trim().split('.');
                        for (var index = 0; index < level.length; index++) {
                            var item = level[index];
                            if (index < (level.length - 1)) {
                                if (_element[item] == undefined)
                                    break;
                                _element = element[item];
                            } else {
                                if (_element[item] == undefined)
                                    break;
                                if (_element[item].toLowerCase().indexOf(_val) > -1) {
                                    _resultWhere.push(element);
                                }
                            }
                        }
                    }, this);

                    result = _resultWhere;
                }
                else
                    result = linq.from(result).where(filter.where).toArray();
            }
            if (filter.select != "" && filter.select)
                result = linq.from(result).select(filter.select).toArray();
            if (filter.orderBy != "" && filter.orderBy)
                result = linq.from(result).orderBy(filter.orderBy).toArray();
            if (filter.orderByDescending != "" && filter.orderByDescending)
                result = linq.from(result).orderByDescending(filter.orderByDescending).toArray();
            if (filter.take > 0 && filter.take)
                result = linq.from(result).take(filter.take).toArray();

            resolve(result[0]);
            //return { result };

        } catch (err) {
            console.log(err)
            //Log.Add('error', null, 'Filter', 'Erro ao aplicar filtro na requisição.', null, { obj: err }, true);
            reject("Error on apply filter");
        }
    });
}


module.exports = Filter;