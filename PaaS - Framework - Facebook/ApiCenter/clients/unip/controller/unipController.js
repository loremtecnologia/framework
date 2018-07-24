function UnipController() { }

UnipController.prototype.UnidadeProxima = function (req, res, next) {
    var result = {
        elements: []
    };

    const objRequest = {
        url: 'https://www.unip.br/ead/api/servicos/localidades/' + req.body.param.cep + '/polosproximo/?qtd=3',
        method: 'GET'
    };

    request(objRequest, function (err, response) {

        const retorno = JSON.parse(response.body)

        if (response.body != null) {
            retorno.valido = true;

            retorno.forEach(element => {
                let tel = element.Fone.split('/');

                let _linha = {
                    ImageUrl: 'https://storage.googleapis.com/mvpunip/Carrossel_Novo.png',
                    Title: element.Nome,
                    Description: element.Rua + ' - ' + element.Bairro + '\n CEP: ' + element.CEP + '\n' + 'Distância: ' + element.DistanciaKMString,
                    buttons: [
                        {
                            telefone: '+55' + tel[0].replace(/ /g, '').replace('(', '').replace(')', '').replace('-', '')
                        },
                        {
                            local: 'https://www.google.com/maps/dir/' + req.body.param.cep + '/' + element.Latitude + ',' + element.Longitude
                        }
                    ]
                }

                result.elements.push(JSON.parse(JSON.stringify(_linha)));

            });
            //            }
            result.elements = result.elements.slice(0, 10);
        }
        else {
            retorno.valido = false;

            firestore.setLog(req.body.param.pageID, null, {
                level: "warning",
                timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                url: req.originalUrl,
                ip: req.ip,
                file: "unipController.js",
                method: "Polos",
                message: "Erro ao enviar request para unip.",
                senderID: req.body.param.senderID,
                recipientID: req.body.param.pageID,
                meta: { request: objRequest, retorno: retorno, statusCode: response.statusCode }
            })

        }
        if (err) {

            firestore.setLog(req.body.param.pageID, null, {
                level: "error",
                timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                url: req.originalUrl,
                ip: req.ip,
                file: "unipController.js",
                method: "Polos",
                message: "Erro ao enviar request para unip.",
                senderID: req.body.param.senderID,
                recipientID: req.body.param.pageID,
                meta: { request: objRequest, statusCode: 401, error: JSON.stringify(err) }
            })

        }
        res.objRequest = objRequest
        res.retorno = retorno
        next()
        res.json(result)
    });
};

UnipController.prototype.ListarCursos = function (req, res, next) {
    var result = {
        elements: []
    };

    const objRequest = {
        url: 'https://www.unip.br/ead/api/servicos/cursos',
        method: 'GET'
    };

    request(objRequest, function (err, response) {

        const retorno = JSON.parse(response.body)

        if (response.body != null) {
            retorno.valido = true;

            retorno.forEach(element => {
                let tel = element.Fone.split('/');

                let _linha = {
                    ImageUrl: 'https://pronatec2019.com.br/wp-content/uploads/2018/01/Cursos-PRONATEC-UNIP-2019.jpg',
                    Title: element.Nome,
                    Description: 'Vestibular 14/03/2018',
                    buttons: [
                        {
                            telefone: '+55' + tel[0].replace(/ /g, '').replace('(', '').replace(')', '').replace('-', '')
                        }
                    ]
                }

                result.elements.push(JSON.parse(JSON.stringify(_linha)));

            });
            //            }
            result.elements = result.elements.slice(0, 10);
        }
        else {
            retorno.valido = false;

            firestore.setLog(req.body.param.pageID, null, {
                level: "warning",
                timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                url: req.originalUrl,
                ip: req.ip,
                file: "unipController.js",
                method: "Polos",
                message: "Erro ao enviar request para unip.",
                senderID: req.body.param.senderID,
                recipientID: req.body.param.pageID,
                meta: { request: objRequest, retorno: retorno, statusCode: response.statusCode }
            })

        }
        if (err) {

            firestore.setLog(req.body.param.pageID, null, {
                level: "error",
                timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                url: req.originalUrl,
                ip: req.ip,
                file: "unipController.js",
                method: "Polos",
                message: "Erro ao enviar request para unip.",
                senderID: req.body.param.senderID,
                recipientID: req.body.param.pageID,
                meta: { request: objRequest, statusCode: 401, error: JSON.stringify(err) }
            })

        }
        res.objRequest = objRequest
        res.retorno = retorno
        next()
        res.json(result)
    });
};

UnipController.prototype.PendenciasCarrossel = function (req, res, next) {

    return new Promise(function (resolve, reject) {
        CodAluno('1410001', resolve, reject)
    }).then(function (codAluno) {

        var result = {
            elements: []
        };

        const objRequest = {
            url: 'https://demo.lyceum.com.br/AOnline3API/financeiro/274627/alunos/1410001/cobrancas',
            method: 'GET'
        };

        request(objRequest, function (err, response) {

            const retorno = JSON.parse(response.body)

            if (response.body != null) {
                retorno.valido = true;

                var obj = retorno;
                var key = Object.keys(obj)

                var month = new Array();
                month[0] = "Janeiro";
                month[1] = "Fevereiro";
                month[2] = "Março";
                month[3] = "Abril";
                month[4] = "Maio";
                month[5] = "Junho";
                month[6] = "Julho";
                month[7] = "Agosto";
                month[8] = "Setembro";
                month[9] = "Outubro";
                month[10] = "Novembro";
                month[11] = "Dezembro";

                // for (let index = 0; index < key.length; index++) {
                retorno.forEach(element => {
                    let _linha = {
                        ImageUrl: 'https://image.ibb.co/jEOa1x/Teste.jpg',
                        Title: 'Mensalidade ' + month[element.mes],
                        Description: 'Vencimento: ' + element.dataDeVencimento + '\nValor: R$' + element.valor,
                        buttons: [
                            {
                                link: 'http://villaca.com/doc/boleto.pdf'
                            }
                        ]
                    }

                    result.elements.push(JSON.parse(JSON.stringify(_linha)));

                });
                //            }
                result.elements = result.elements.slice(0, 10);

            }
            else {
                retorno.valido = false;

                firestore.setLog(req.body.param.pageID, null, {
                    level: "warning",
                    timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                    url: req.originalUrl,
                    ip: req.ip,
                    file: "unipController.js",
                    method: "Pendencias",
                    message: "Erro ao enviar request para unip.",
                    senderID: req.body.param.senderID,
                    recipientID: req.body.param.pageID,
                    meta: { request: objRequest, retorno: retorno, statusCode: response.statusCode }
                })

            }
            if (err) {

                firestore.setLog(req.body.param.pageID, null, {
                    level: "error",
                    timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                    url: req.originalUrl,
                    ip: req.ip,
                    file: "unipController.js",
                    method: "Pendencias",
                    message: "Erro ao enviar request para unip.",
                    senderID: req.body.param.senderID,
                    recipientID: req.body.param.pageID,
                    meta: { request: objRequest, statusCode: 401, error: JSON.stringify(err) }
                })

            }
            res.objRequest = objRequest
            res.retorno = retorno
            next()
            res.json(result)
        });
    })
};

UnipController.prototype.FaltasLista = function (req, res, next) {

    return new Promise(function (resolve, reject) {
        CodAluno('1410001', resolve, reject)
    }).then(function (codAluno) {

        var result = {
            faltas: ''
        };

        const objRequest = {
            url: 'https://demo.lyceum.com.br/AOnline3API/pessoas/codPessoa/274627/codAluno/1410001/frequencia',
            method: 'GET'
        };

        request(objRequest, function (err, response) {

            const retorno = JSON.parse(response.body)

            if (response.body != null) {
                retorno.valido = true;

                if (retorno.status) {
                    result.faltas += 'Você não possui falta.'
                } else {
                    retorno.forEach(element => {
                        if (element.componenteCurricular) {
                            result.faltas += '- ' + element.componenteCurricular + ': ' + element.numeroFaltas + ' falta(s).\n'
                        }
                    });
                }
            }
            else {
                retorno.valido = false;

                firestore.setLog(req.body.param.pageID, null, {
                    level: "warning",
                    timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                    url: req.originalUrl,
                    ip: req.ip,
                    file: "unipController.js",
                    method: "Pendencias",
                    message: "Erro ao enviar request para unip.",
                    senderID: req.body.param.senderID,
                    recipientID: req.body.param.pageID,
                    meta: { request: objRequest, retorno: retorno, statusCode: response.statusCode }
                })

            }
            if (err) {

                firestore.setLog(req.body.param.pageID, null, {
                    level: "error",
                    timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                    url: req.originalUrl,
                    ip: req.ip,
                    file: "unipController.js",
                    method: "Pendencias",
                    message: "Erro ao enviar request para unip.",
                    senderID: req.body.param.senderID,
                    recipientID: req.body.param.pageID,
                    meta: { request: objRequest, statusCode: 401, error: JSON.stringify(err) }
                })

            }
            res.objRequest = objRequest
            res.retorno = retorno
            next()
            res.json(result)
        });
    })
};

UnipController.prototype.NotasLista = function (req, res, next) {

    return new Promise(function (resolve, reject) {
        CodAluno('1410001', resolve, reject)
    }).then(function (codAluno) {
        var result = {
            notas: ''
        };

        const objRequest = {
            url: 'https://demo.lyceum.com.br/AOnline3API/pessoas/274627/alunos/1410001/boletim',
            method: 'GET'
        };

        request(objRequest, function (err, response) {

            const retorno = JSON.parse(response.body)

            if (response.body != null) {
                retorno.valido = true;

                if (retorno.status) {
                    result.notas += 'Você não possui nota.'
                }
                else {
                    retorno.forEach(element => {
                        if (element.media != null) {
                            result.notas += '- ' + element.nomeDisciplina + ': ' + element.media + '\n'
                        }
                    });
                }

                if (result.notas == '') {
                    result.notas += 'Você não possui nota.'
                }
            }
            else {
                retorno.valido = false;

                firestore.setLog(req.body.param.pageID, null, {
                    level: "warning",
                    timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                    url: req.originalUrl,
                    ip: req.ip,
                    file: "unipController.js",
                    method: "Pendencias",
                    message: "Erro ao enviar request para unip.",
                    senderID: req.body.param.senderID,
                    recipientID: req.body.param.pageID,
                    meta: { request: objRequest, retorno: retorno, statusCode: response.statusCode }
                })

            }
            if (err) {

                firestore.setLog(req.body.param.pageID, null, {
                    level: "error",
                    timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                    url: req.originalUrl,
                    ip: req.ip,
                    file: "unipController.js",
                    method: "Pendencias",
                    message: "Erro ao enviar request para unip.",
                    senderID: req.body.param.senderID,
                    recipientID: req.body.param.pageID,
                    meta: { request: objRequest, statusCode: 401, error: JSON.stringify(err) }
                })

            }
            res.objRequest = objRequest
            res.retorno = retorno
            next()
            res.json(result)
        });
    })
};

UnipController.prototype.VerificarAtendente = function (req, res, next) {
    const objRequest = {
        url: 'https://graph.facebook.com/v2.6/' + req.body.param.senderID + '?access_token=' + req.body.param.page_access_token + '',
        method: 'GET'
    };

    request(objRequest, function (err, response) {
        const retorno = JSON.parse(response.body)

        if (response.statusCode == 200) {
            retorno.valido = true;

            if (retorno.gender == 'male') {
                retorno.imagem = 'https://storage.googleapis.com/mvpunip/pedro.png';
                retorno.apresentacao = 'Eu sou o Lucas seu assistente virtual da UNIP.'
            } else if (retorno.gender == 'female') {
                retorno.imagem = 'https://storage.googleapis.com/mvpunip/amanda.png';
                retorno.apresentacao = 'Eu sou a Amanda sua assistente virtual da UNIP.'
            } else {
                retorno.imagem = 'https://storage.googleapis.com/mvpunip/pedro.png';
                retorno.apresentacao = 'Eu sou o Lucas seu assistente virtual da UNIP.'
            }
        }
        else {
            retorno.valido = false;

            firestore.setLog(req.body.param.pageID, null, {
                level: "warning",
                timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                url: req.originalUrl,
                ip: req.ip,
                file: "facebookController.js",
                method: "Login",
                message: "Erro ao enviar request para o facebook.",
                senderID: req.body.param.senderID,
                recipientID: req.body.param.pageID,
                meta: { request: objRequest, retorno: retorno, statusCode: response.statusCode }
            })

        }
        if (err) {

            firestore.setLog(req.body.param.pageID, null, {
                level: "error",
                timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                url: req.originalUrl,
                ip: req.ip,
                file: "facebookController.js",
                method: "Login",
                message: "Erro ao enviar request para o facebook.",
                senderID: req.body.param.senderID,
                recipientID: req.body.param.pageID,
                meta: { request: objRequest, statusCode: 401, error: JSON.stringify(err) }
            })

        }
        res.objRequest = objRequest
        res.retorno = retorno
        next()
        res.json(retorno)
    });
};

function CodAluno(ra, resolve, reject) {

    // const objRequest = {
    //     url: 'https://demo.lyceum.com.br/AOnline3API/pessoas/cod_aluno/1410001/obtemPessoaAluno',
    //     method: 'GET'
    // };

    // request(objRequest, function (err, response) {

    //     const retorno = JSON.parse(response.body)

    //     if (response.body != null) {
    //         retorno.valido = true;
    //     }
    //     else {
    //         retorno.valido = false;
    //     }

        resolve()
   // });
};

module.exports = new UnipController();