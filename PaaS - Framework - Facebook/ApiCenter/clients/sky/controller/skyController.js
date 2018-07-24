function SkyController() { }

SkyController.prototype.Carrossel = function (req, res, next) {

    var result = {
        elements: []
    };

    return new Promise(function (resolve, reject) {
        return firestore.select('SKY', req.body.param.id, resolve, reject)
    }).then(function (retorno) {
        //console.log(retorno)
        return new Promise(function (resolve, reject) {
            var obj = retorno;
            var key = Object.keys(obj)

            for (let index = 0; index < key.length; index++) {

                if (retorno[key[index]].IsVisible == true) {
                    retorno[key[index]].sku.forEach(element => {
                        if (element.IsActive == true) {
                            let SkuName = Util.ClearString(element.SkuName);
                            let qtd = Util.ClearString(req.body.param.qtd);

                            if (!req.body.param.canais || req.body.param.canais == "null") {
                                if (SkuName.indexOf(qtd) > -1) {

                                    let _linha = {
                                        ImageUrl: element.ImageUrl,
                                        NameComplete: element.NameComplete,
                                        ProductDescription: retorno[key[index]].ProductDescription,
                                        buttons: [
                                            {
                                                SkuId: element.SkuId
                                            },
                                            {
                                                SkuId: element.SkuId
                                            }
                                        ]
                                    }

                                    result.elements.push(JSON.parse(JSON.stringify(_linha)));
                                }
                            }
                            else if (req.body.param.id == '5') {
                                let canais = Util.ClearString(req.body.param.canais)
                                if (SkuName.indexOf(qtd) > -1 && SkuName.indexOf(canais) > -1) {
                                    let _linha = {
                                        ImageUrl: element.ImageUrl,
                                        NameComplete: element.NameComplete,
                                        ProductDescription: retorno[key[index]].ProductDescription,
                                        buttons: [
                                            {
                                                SkuId: element.SkuId
                                            },
                                            {
                                                SkuId: element.SkuId
                                            }
                                        ]
                                    }

                                    result.elements.push(JSON.parse(JSON.stringify(_linha)));
                                }
                            }

                        }
                    })
                }
            }
            resolve('ok')
        }).then(function (retorno) {
            // console.log('acabou --------------------')
            // console.log(retorno)
            return retorno
        })

    }).then(function (retorno) {
        // console.log('fim --------------------')
        result.elements = result.elements.slice(0, 10);
        //console.log(result)
        res.json(result)
    })




}

SkyController.prototype.SkuPrePago = function (req, res, next) {

    var result = {
        quick_replies: []
    };

    return new Promise(function (resolve, reject) {
        return firestore.select('SKY', req.body.param.id, resolve, reject)
    }).then(function (retorno) {
        //console.log(retorno)

        return new Promise(function (resolve, reject) {
            var obj = retorno;
            var key = Object.keys(obj)

            for (let index = 0; index < key.length; index++) {
                if (retorno[key[index]].IsVisible == true) {
                    retorno[key[index]].sku.forEach(element => {
                        //console.log(element.SkuName)
                        if (element.IsActive == true) {
                            let _linha = {
                                SkuName: element.SkuName.toLowerCase().replace('recarga', '').trim()
                            }

                            let _item = result.quick_replies.filter(e => e.SkuName == _linha.SkuName);

                            if (!_item.length > 0)
                                result.quick_replies.push(JSON.parse(JSON.stringify(_linha)));
                        }
                    })
                }
            }
            resolve('ok')
        }).then(function (retorno) {
            //console.log('acabou --------------------')
            //console.log(retorno)
            return retorno
        })

    }).then(function (retorno) {
        //console.log('fim --------------------')
        //console.log(result)
        res.json(result)
    })




}

SkyController.prototype.SkuCatalog = function (req, res, next) {

    return new Promise(function (resolve, reject) {
        Catalog(req, resolve, reject)
    }).then(function (retorno) {
        res.json(retorno)
    })
}


Produtos = []

SkyController.prototype.GetProductSkus = function (req, res, next) {
    next();

    return new Promise(function (resolve, reject) {
        var categorias = [4, 5]
        Categoria(categorias, req, resolve, reject)
    }).then(function (retorno) {
        //console.log("acabo")
    })
}

function Categoria(lista, req, resolve, reject) {

    var id = lista.shift()

    //console.log("categoria ", id)

    const objRequest = {
        url: 'http://' + req.headers.accountname + '.' + req.headers.environment +
            '.com.br/api/catalog_system/pvt/products/GetProductAndSkuIds?categoryId=' + id + '&_from=1&_to=50',
        method: 'GET',
        headers: {
            'X-VTEX-API-AppKey': req.headers.appkey,
            'X-VTEX-API-AppToken': req.headers.apptoken,
            'Content-Type': 'application/json'
        }
    };
    request(objRequest, function (err, response) {
        var obj = JSON.parse(response.body);
        var key = Object.keys(obj.data)
        //key = ['5']//aqui

        return new Promise(function (resolve, reject) {
            Product(key, req, resolve, reject)
        }).then(function (retorno) {
            //console.log("acabo um lista de produtos, ", retorno)
            Produtos = []
            if (lista.length == 0) {
                resolve(retorno)
            } else {
                Categoria(lista, req, resolve, reject);
            }
        })
    })
}

function Product(lista, req, resolve, reject) {

    var id = lista.shift()
    //console.log("Product ", id)

    const objRequest = {
        url: 'http://' + req.headers.accountname + '.' + req.headers.environment +
            '.com.br/api/catalog_system/pvt/products/ProductGet/' + id,
        method: 'GET',
        headers: {
            'X-VTEX-API-AppKey': req.headers.appkey,
            'X-VTEX-API-AppToken': req.headers.apptoken,
            'Content-Type': 'application/json'
        }
    };

    request(objRequest, function (err, response) {
        //console.log(response.statusCode)
        if (response.statusCode == 200) {

            retorno = JSON.parse(response.body)

            let Produto = {
                CategoryId: retorno.CategoryId,
                ProductId: retorno.Id,
                ProductName: retorno.Name,
                ProductDescription: retorno.Description,
                IsVisible: retorno.IsVisible,
                //ImageUrl: '',
                sku: []
            }
            return new Promise(function (resolve, reject) {
                ProductVariations(Produto, req, resolve, reject)
            }).then(function (retorno) {
                if (retorno != null) {
                    Produtos.push(retorno)
                    //GRAVAR BANCO
                    const data = {
                        [retorno.ProductId]: retorno
                    }

                    firestore.upd('SKY', retorno.CategoryId.toString(), data)
                }

                if (lista.length == 0) {
                    resolve(Produtos)
                } else {
                    Product(lista, req, resolve, reject)
                }
            })
        }
    })
}

function ProductVariations(Produto, req, resolve, reject) {

    var id = Produto.ProductId
    //console.log("ProductVariations ", id)

    const objRequest = {
        url: 'http://' + req.headers.accountname + '.' + req.headers.environment +
            '.com.br/api/catalog_system/pub/products/variations/' + id,
        method: 'GET',
        headers: {
            'X-VTEX-API-AppKey': req.headers.appkey,
            'X-VTEX-API-AppToken': req.headers.apptoken,
            'Content-Type': 'application/json'
        }
    };
    request(objRequest, function (err, response) {
        //console.log(response.statusCode)
        const retorno = JSON.parse(response.body);
        if (response.statusCode == 200 && retorno.skus) {
            return new Promise(function (resolve, reject) {
                var itemProductSku = 0
                ProductSku(retorno.skus, itemProductSku, Produto, req, resolve, reject)
            }).then(function (retorno) {
                resolve(retorno)
            })
        }
        else {
            resolve(null);
        }
    });
}

function ProductSku(lista, itemProductSku, Produto, req, resolve, reject) {

    var skus = lista[itemProductSku]

    if (skus == undefined) {
        resolve(Produto)
    } else {

        var id = skus.sku

        //console.log("ProductSku ", id)

        const objRequest = {
            url: 'http://' + req.headers.accountname + '.' + req.headers.environment +
                '.com.br/api/catalog_system/pvt/sku/stockkeepingunitbyid/' + id,
            method: 'GET',
            headers: {
                'X-VTEX-API-AppKey': req.headers.appkey,
                'X-VTEX-API-AppToken': req.headers.apptoken,
                'Content-Type': 'application/json'
            }
        };

        request(objRequest, function (err, response) {
            //console.log(response.statusCode)
            if (response.statusCode == 200 && response.body) {
                const retorno = JSON.parse(response.body);

                let sku = {
                    SkuId: skus.sku,
                    listPriceFormated: skus.listPriceFormated,
                    taxFormated: skus.taxFormated,
                    bestPriceFormated: skus.bestPriceFormated,

                    SkuName: retorno.SkuName,
                    NameComplete: retorno.NameComplete,
                    IsActive: retorno.IsActive
                    //ImageUrl: retorno.ImageUrl
                    //ProductSpecifications: retorno.ProductSpecifications
                }
                Produto.sku.push(sku)

                //TODO: PRECISA GRAVAR OU BUSCAR OS CANAIS POR SKU
                // const canais = {
                //     [skus.sku]: retorno.ProductSpecifications
                // }

                // firestore.upd('SKY', 'CANAIS', canais)

            }
            itemProductSku = itemProductSku + 1
            ProductSku(lista, itemProductSku, Produto, req, resolve, reject)
        });
    }
}

function Catalog(req, resolve, reject) {

    const objRequest = {
        url: 'http://' + req.headers.accountname + '.' + req.headers.environment +
            '.com.br/api/catalog_system/pvt/sku/stockkeepingunitbyid/' + req.body.sku,
        method: 'GET',
        headers: {
            'X-VTEX-API-AppKey': req.headers.appkey,
            'X-VTEX-API-AppToken': req.headers.apptoken,
            'Content-Type': 'application/json'
        }
    };
    request(objRequest, function (err, response) {
        resolve(JSON.parse(response.body))
    })
}

module.exports = new SkyController();