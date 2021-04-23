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

module.exports = {
    getCompetitionInfo
}
