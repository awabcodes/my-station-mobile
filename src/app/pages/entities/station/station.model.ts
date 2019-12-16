import { BaseEntity } from 'src/model/base-entity';

export class Station implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public gasLevel?: number,
        public benzeneLevel?: number,
        public lastTankFill?: any,
        public city?: string,
        public location?: string,
        public mapUrl?: string,
    ) {
    }
}
