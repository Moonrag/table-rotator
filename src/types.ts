export interface OptionsArgs {
    way?: 'right' | 'left',
    times?: number,
}

export type Header = [
    'id',
    'json',
];

export type Row = {
    id: string,
    json: string,
};

export type Table = number[];
