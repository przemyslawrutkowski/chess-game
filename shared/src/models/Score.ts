export default class Score {
    private lightScore: number;
    private darkScore: number;

    constructor(lightScore: number, darkScore: number) {
        this.lightScore = lightScore;
        this.darkScore = darkScore;
    }

    public getLightScore(): number {
        return this.lightScore;
    }

    public getDarkScore(): number {
        return this.darkScore;
    }

    public increaseLightScore(score: number) {
        this.lightScore += score;
    }

    public increaseDarkScore(score: number) {
        this.darkScore += score;
    }
}