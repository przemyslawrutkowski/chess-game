export default class Score {
    lightScore;
    darkScore;
    constructor(lightScore, darkScore) {
        this.lightScore = lightScore;
        this.darkScore = darkScore;
    }
    getLightScore() {
        return this.lightScore;
    }
    getDarkScore() {
        return this.darkScore;
    }
    increaseLightScore(score) {
        this.lightScore += score;
    }
    increaseDarkScore(score) {
        this.darkScore += score;
    }
}
