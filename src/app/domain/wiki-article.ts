export class WikiArticle{
    constructor(
        public id: number,
        public title: string,
        public averageViews: number,
        public description = ""
    ) {}
}