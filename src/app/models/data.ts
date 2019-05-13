export class Data {

    public effects: Array<any>     = [ {title: 'None' , effect : '' } , {title: '1977', effect : 'filter-1977' },  
                                       {title: 'Brooklyn', effect : 'filter-brooklyn' },  {title: 'Crema', effect : 'filter-crema' },  
                                       {title: 'Moon', effect : 'filter-moon' } , {title: 'Gingham', effect : 'filter-gingham' } ,
                                       {title: 'Hudson', effect : 'filter-hudson' } , {title: 'Skyline', effect : 'filter-skyline' } , ];

    public _effects: Array<any>     = [ { title: 'None', effect : ''}, { title: 'Gray', effect : 'gray-effect'}, { title: 'Blur', effect : 'blur-effect'}, { title: 'Sepia', effect : 'sepia-effect'} , { title: 'Brightness', effect : 'brightness-effect'}];                                   
    public sizes :  Array<any>     = ['Small', 'Large', 'Wide' , 'Tall'];
    public colos:   Array<any>     = ['#fff', , '#000' , '#FF5733', '#B4A817' , '#4259EA' , '#AB5ED5'];
    public font_family:   Array<any>     = ['Arial', 'Georgia' , 'Helvetica', 'Sans Serif' , 'Comic Sans']
    public font_styles: Array<any> = ['Normal', 'Italic', 'Oblique'];
    public font_weights: Array<any> = ['Normal', 'Bold', 'Bolder', 'Lighter', 100, 200 , 300 , 400 , 500 , 600 , 700, 800 , 900]
    public font_sizes:  Array<any> = [8 , 10 , 12, 16, 18, 22, 26, 28, 32, 36, 40, 44, 48 , 52];
    public colors: Array<any> = ['rgb(0, 255, 255)', 'rgb(240, 255, 255)', 'rgb(245, 245, 220)','rgb(0, 0, 0)','rgb(0, 0, 255)',
                                'rgb(165, 42, 42)', 'rgb(0, 255, 255)', 'rgb(0, 0, 139)', 'rgb(0, 139, 139)','rgb(169, 169, 169)',
                                'rgb(0, 100, 0)'  , 'rgb(189, 183, 107)', 'rgb(139, 0, 139)', 'rgb(85, 107, 47)','rgb(255, 140, 0)',
                                'rgb(153, 50, 204)','rgb(139, 0, 0)','rgb(233, 150, 122)', 'rgb(148, 0, 211)', 'rgb(255, 0, 255)',
                                'rgb(255, 215, 0)', 'rgb(0, 128, 0)', 'rgb(75, 0, 130)', 'rgb(240, 230, 140)', 'rgb(173, 216, 230)',
                                'rgb(224, 255, 255)','rgb(144, 238, 144)','rgb(211, 211, 211)','rgb(255, 182, 193)','rgb(255, 255, 224)',
                                'rgb(0, 255, 0)', 'rgb(255, 0, 255)', 'rgb(128, 0, 0)', 'rgb(0, 0, 128)', 'rgb(128, 128, 0)',
                                'rgb(255, 165, 0)','rgb(255, 192, 203)', 'rgb(128, 0, 128)', 'rgb(128, 0, 128)','rgb(255, 0, 0)',
                                'rgb(192, 192, 192)','rgb(255, 255, 255)','rgb(255, 255, 0)','rgb(255, 255, 255)'
                            ];

    public colorNames: Array<any> = ['Aqua', 'Azure' ,'Beige' , 'Black' , 'Blue' , 'Brown' , 'Cyan' , 'Darkblue' , 'Darkcyan' , 'Darkgrey' , 'Darkgreen' , 'Darkkhaki' , 'Darkmagenta' , 'Darkolivegreen' , 'Darkorange' , 'Darkorchid' , 'Darkred'
    , 'Darksalmon' , 'Darkviolet' , 'Fuchsia' , 'Gold' , 'Green' , 'Indigo' , 'Khaki' , 'Lightblue' , 'Lightcyan' , 'Lightgreen' , 'Lightgrey' , 'Lightpink' , 'Lightyellow' , 'Lime' , 'Magenta' , 'Maroon' , 'Navy' , 'Olive' , 'Orange' , 'Pink' ,
     'Purple' , 'Violet' , 'Red' , 'Silver' , 'White', 'Yellow' , 'Transparent'];

    public stroke_styles: Array<any> = this.colors;
    
    public canvasSizes: Array<any> = [{src: 'assets/_images/two-squares-v.svg' , title: 'Tall'}, {src: 'assets/_images/two-squares-h.svg', title: 'Wide'} ,{src: 'assets/_images/four-squares.svg' , title: 'Large'}, {src: 'assets/_images/one-squares.svg' , title: 'Small'}];
    
    public shadowBlurs: Array<any> = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30];
    
    public text_align: Array<any> = ['Left', 'Right', 'Center'];
    
    constructor(){}
}