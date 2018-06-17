import db from '../../models/db';
import load from './load';

const getAnswer = (data, id) => {
    for (let i = 0; i < data.length; i++){
        if(data[i].id === id){
            return data[i].answers;
        }
    }
    return null;
};

export default (data, success, error) => {
    load(data.id, item => {
        let points = 0, totalPoints = 0;
        for(let i = 0; i < item.questions.length; i++){
            let q = item.questions[i];
            totalPoints += q.weight;
            const a = getAnswer(data.answers, q.id);
            if(!a) continue;
            let aPoints = 0;
            let correct = 0;
            for (let j = 0; j < q.answers.length; j++) {
                let answer = q.answers[j];
                if(answer.correct) correct++;
                if(a.indexOf(answer.id) >= 0){
                    aPoints += answer.correct ? 1 : -1;
                }
            }
            points += aPoints > 0 ? aPoints / correct * q.weight : 0;
        }
        points = Math.round(points * 100) / 100;
        success({
            points,
            totalPoints,
            pct: Math.round(points / totalPoints * 100)
        });
    }, err => {
        error(err);
    });
}