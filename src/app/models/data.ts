export class Data {

    public effects: Array<any>     = [ {title: 'None' , effect : '' } , {title: '1977', effect : 'filter-1977' },  
                                       {title: 'Brooklyn', effect : 'filter-brooklyn' },  {title: 'Crema', effect : 'filter-crema' },  
                                       {title: 'Moon', effect : 'filter-moon' } , {title: 'Gingham', effect : 'filter-gingham' } ,
                                       {title: 'Hudson', effect : 'filter-hudson' } , {title: 'Skyline', effect : 'filter-skyline' } , ];
    public sizes :  Array<any>     = ['Small', 'Large', 'Wide' , 'Tall'];
    public colos:   Array<any>     = ['#fff', , '#000' , '#FF5733', '#B4A817' , '#4259EA' , '#AB5ED5'];
    public fonts:   Array<any>     = ['Arial', 'Georgia' , 'Helvetica', 'Sans Serif']
    public font_styles: Array<any> = ['Normal', 'Italic', 'Oblique'];
    public font_weights: Array<any> = ['Normal', 'Bold', 'Bolder', 'Lighter', 100, 200 , 300 , 400 , 500 , 600 , 700, 800 , 900]
    public font_sizes:  Array<any> = [8 , 10 , 12, 16, 18, 22, 26, 28, 32, 36, 40, 44, 48 , 52];
    public colors: Array<any> =['#ffffff',
                                '#000105',
                                '#3e6158',
                                '#3f7a89',
                                '#96c582',
                                '#b7d5c4',
                                '#bcd6e7',
                                '#7c90c1',
                                '#9d8594',
                                '#dad0d8',
                                '#4b4fce',
                                '#4e0a77',
                                '#a367b5',
                                '#ee3e6d',
                                '#d63d62',
                                '#c6a670',
                                '#f46600',
                                '#cf0500',
                                '#efabbd',
                                '#8e0622',
                                '#f0b89a',
                                '#f0ca68',
                                '#62382f',
                                '#c97545',
                                '#c1800b'
                            ];

    
    public canvasSizes: Array<any> = [{src: 'assets/_images/two-squares-v.svg' , title: 'Tall'}, {src: 'assets/_images/two-squares-h.svg', title: 'Wide'} ,{src: 'assets/_images/four-squares.svg' , title: 'Large'}, {src: 'assets/_images/one-squares.svg' , title: 'Small'}];
    
    public shadowBlurs: Array<any> = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30];
    
    constructor(){}
}