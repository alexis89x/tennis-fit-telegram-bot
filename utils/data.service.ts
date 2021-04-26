import { ICompetition } from "../models/ICompetition";
const axios = require('axios');

const cacheValidityMS = 60 * 60 * 1000; // in milliseconds
const store = {
    competitions: {}
};

const API_URL: string = 'https://dp-fit-prod-function.azurewebsites.net/api/v3/puc/competition/detail';

const getCompetitionInfo = (competitionid: string | number): Promise<ICompetition> => {
    console.log('Competition ID: ' + competitionid);
    return new Promise<ICompetition>((res, rej) => {
        if (store.competitions[competitionid]) {
            const now = (new Date()).getTime();
            if (now - store.competitions[competitionid].timestamp < cacheValidityMS) {
                console.log('Loaded from Cache');
                return res(store.competitions[competitionid].data);
            }
        }

        axios
            .post(API_URL, {
                competitionid
            })
            .then(resp => {
                if (resp.statusCode === 500) {
                    return rej();
                }
                console.log(`statusCode: ${resp.statusCode}`);
                console.log(resp.data);
                store.competitions[competitionid] = {
                    data: resp.data,
                    timestamp: (new Date()).getTime()
                };
                res(resp.data as ICompetition);
            })
            .catch(error => {
                console.error(error);
                return rej();
            });
    });
}

const getTournaments = () => {
        return new Promise((res, rej) => {
            axios
                .post('https://dp-fit-prod-function.azurewebsites.net/api/v3/integration/puc/list', {"guid":"","profilazione":"","freetext":"Milano","id_regione":null,"id_provincia":null,"id_stato":null,"id_disciplina":4332,"sesso":null,"data_inizio":"16/04/2021","data_fine":null,"tipo_competizione":null,"categoria_eta":null,"classifica":null,"massimale_montepremi":null,"id_area_regionale":null,"ambito":null,"rowstoskip":0,"fetchrows":25,"sortcolumn":"data_inizio","sortorder":"asc"})
                .then(resp => {
                    if (resp.statusCode === 500) {
                        return rej();
                    }
                    console.log('CIAO');
                    console.log(resp);
                    console.log(`statusCode: ${resp.statusCode}`);
                    console.log(resp.data);
                    res(resp.data);
                })
                .catch(error => {
                    console.error(error);
                    return rej();
                });
        });
}

module.exports = {
    getCompetitionInfo,
    getTournaments
}
