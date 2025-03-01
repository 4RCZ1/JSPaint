let objects=[],objTimer;
class Rectangle {
    constructor(x,y,w,h,layer,b=false,f=false,index=null){
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
        this.layer=layer;
        this.b=b;
        this.f=f;
        this.index=index;

        objLayerSelect(layer);
        //reversedAllSetter(this.b,this.f,this.w,this.h);

        this.centerPin = new Pinpoint(this.x+this.w/2,this.y+this.h/2);
        this.sizePin = new Pinpoint(this.x+this.w,this.y+this.h);
        clear("cursor");
    }
    draw(){
        clear();
        ctx.beginPath();
        ctx.rect(this.x,this.y,this.w,this.h);
        if(fill){
            ctx.fill();
        }
        if(border){
            ctx.stroke();
        }
    }
    configure(){
        this.sizePin.modify(this.x+this.w,this.y+this.h);
        this.centerPin.modify(this.x+this.w/2,this.y+this.h/2);

        this.centerPin.draw();
        this.sizePin.draw();
        this.centerPin.followOnClick();
        this.sizePin.followOnClick();


        if(this.sizePin.following){
            this.w = mouseX - this.x;
            this.h = mouseY - this.y;
            clear("cursor");
        }else if(this.centerPin.following){
            this.x=mouseX-this.w/2;
            this.y=mouseY-this.h/2;
            clear("cursor");
        }
        this.sizePin.modify(this.x+this.w,this.y+this.h);
        this.centerPin.modify(this.x+this.w/2,this.y+this.h/2);

    }
    save(){
        clear("cursor");

        if(fill){
            this.f=ctx.fillStyle;
        }
        if(border){
            this.b=ctx.strokeStyle;
        }

        if(this.index===null) {
            objects.push(["rect",this.x, this.y, this.w, this.h, this.layer, this.b, this.f, objects.length]);
            addObjectToList("Rectangle")
        }else{
            objects[this.index]=["rect",this.x, this.y, this.w, this.h, this.layer, this.b, this.f, this.index];
        }
    }
    update(changes){
        this.x=changes[0];
        this.y=changes[1];
        this.w=changes[2];
        this.h=changes[3];
    }
    getData(){
        if(this.index===null){
            this.save();
            this.index=objects.length-1;
        }
        return [this.x,this.y,this.w,this.h,this.index];
    }
    debug(){
        console.log("x:",this.x," y:",this.y," w:",this.w," h:",this.h," layer:",this.layer," b:",this.b," f:",this.f);
    }
}

class Circle {
    constructor(x, y, r, layer, b = false, f = false, index = null) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.layer = layer;
        this.b = b;
        this.f = f;
        this.index = index;

        //console.log(layer);
        objLayerSelect(layer);
        //reversedAllSetter(this.b, this.f, false, false, this.r);

        this.centerPin = new Pinpoint(this.x, this.y);
        this.sizePin = new Pinpoint(this.x - this.r * Math.sqrt(2) / 2, this.y - this.r * Math.sqrt(2) / 2);
        clear("cursor");
    }

    draw() {
        clear();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        if (fill) {
            ctx.fill();
        }
        if (border) {
            ctx.stroke();
        }
    }

    configure() {
        this.centerPin.draw();
        this.sizePin.draw();

        this.centerPin.followOnClick();
        this.sizePin.followOnClick();

        if (this.sizePin.following) {
            this.r = Math.sqrt(Math.pow((this.x - mouseX), 2) + Math.pow((this.y - mouseY), 2));
            clear("cursor");
        } else if (this.centerPin.following) {
            this.x = mouseX;
            this.y = mouseY;
            clear("cursor");
        }
        this.sizePin.modify(this.x - this.r * Math.sqrt(2) / 2, this.y - this.r * Math.sqrt(2) / 2)
        this.centerPin.modify(this.x, this.y)

    }

    save() {
        clear("cursor");

        if (fill) {
            this.f = ctx.fillStyle;
        }
        if (border) {
            this.b = ctx.strokeStyle;
        }

        if (this.index === null) {
            objects.push(["circ", this.x, this.y, this.r, this.layer, this.b, this.f, objects.length]);
            addObjectToList("Circle")
        } else {
            objects[this.index] = ["circ", this.x, this.y, this.r, this.layer, this.b, this.f, this.index];
        }
        clearInterval(objTimer);
    }

    update(changes){
        this.x=changes[0];
        this.y=changes[1];
        this.r=changes[2];
    }
    getData(){
        if(this.index===null){
            this.save();
            this.index=objects.length-1;
        }
        return [this.x,this.y,this.r,this.index];
    }

    debug() {
        console.log("x:", this.x, " y:", this.y, " r:", this.r, " layer:", this.layer, " b:", this.b, " f:", this.f);
    }
}

class Bezier{
    constructor(startX,startY,cp1x,cp1y,cp2x,cp2y,endX,endY,layer,b=false,f=false,lw=false,index=null){
        this.startX=startX;
        this.startY=startY;
        this.cp1x=cp1x;
        this.cp1y=cp1y;
        this.cp2x=cp2x;
        this.cp2y=cp2y;
        this.endX=endX;
        this.endY=endY;
        this.layer=layer;
        this.b=b;
        this.f=f;
        this.lw=lw;
        this.index=index;

        //console.log(layer);
        objLayerSelect(layer);
        //reversedAllSetter(this.b,this.f,false,false,false,this.lw);
        this.startPin=new Pinpoint(startX,startY);
        this.cp1Pin=new Pinpoint(cp1x,cp1y);
        this.cp2Pin=new Pinpoint(cp2x,cp2y);
        this.endPin=new Pinpoint(endX,endY);
        clear("cursor");
    }
    draw(){
        clear();
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.endX, this.endY);
        if(fill){
            ctx.fill();
        }
        if(border){
            ctx.stroke();
        }

    }
    configure(){
        //points
        this.startPin.draw();
        this.cp1Pin.draw();
        this.cp2Pin.draw();
        this.endPin.draw();
        //control lines
        ctxCursor.lineWidth=1;
        ctxCursor.strokeStyle="rgba(0,0,0,0.3)"
        ctxCursor.beginPath();
        ctxCursor.moveTo(this.startX, this.startY);
        ctxCursor.lineTo(this.cp1x, this.cp1y);
        ctxCursor.stroke();
        ctxCursor.beginPath();
        ctxCursor.moveTo(this.endX, this.endY);
        ctxCursor.lineTo(this.cp2x, this.cp2y);
        ctxCursor.stroke();
        borderColorSetter();
        lWidthSetter();

        this.startPin.followOnClick();
        this.cp1Pin.followOnClick();
        this.cp2Pin.followOnClick();
        this.endPin.followOnClick();
        if(this.startPin.following){
            this.startX=mouseX;
            this.startY=mouseY;
            clear("cursor");
        }else if(this.cp1Pin.following){
            this.cp1x=mouseX;
            this.cp1y=mouseY;
            clear("cursor");
        }else if(this.cp2Pin.following){
            this.cp2x=mouseX;
            this.cp2y=mouseY;
            clear("cursor");
        }else if(this.endPin.following){
            this.endX=mouseX;
            this.endY=mouseY;
            clear("cursor");
        }
        this.startPin.modify(this.startX, this.startY);
        this.cp1Pin.modify(this.cp1x, this.cp1y);
        this.cp2Pin.modify(this.cp2x, this.cp2y);
        this.endPin.modify(this.endX, this.endY);

    }
    save(){
        clear("cursor");

        if (fill) {
            this.f = ctx.fillStyle;
        }
        if (border) {
            this.b = ctx.strokeStyle;
        }

        if (this.index === null) {
            objects.push(["bez", this.startX, this.startY, this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.endX, this.endY, this.layer, this.b, this.f, objects.length]);
            addObjectToList("Bezier")
        } else {
            objects[this.index] = ["bez", this.startX, this.startY, this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.endX, this.endY, this.layer, this.b, this.f, this.index];
        }
        clearInterval(objTimer);
    }

    update(changes){
        this.startX=changes[0];
        this.startY=changes[1];
        this.cp1x=changes[2];
        this.cp1y=changes[3];
        this.cp2x=changes[4];
        this.cp2y=changes[5];
        this.endX=changes[6];
        this.endY=changes[7];
    }
    getData(){
        if(this.index===null){
            this.save();
            this.index=objects.length-1;
        }
        return [this.startX, this.startY, this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.endX, this.endY,this.index];
    }

    debug(){
        console.log("startX:",this.startX," startY:", this.startY," cp1x:", this.cp1x," cp1y:", this.cp1y," cp2x:", this.cp2x," cp2y:", this.cp2y," endX:", this.endX," endY:", this.endY," layer:", this.layer," b:", this.b," f:", this.f);
    }
}

class Polygon{
    constructor(points,layer,b=false,f=false,lw=false,index=null){
        this.points=points;
        this.layer=layer;
        this.b=b;
        this.f=f;
        this.lw=lw;
        this.index=index;
        this.pins=[];
        this.following=false;
        this.noFollower=false;

        //console.log(layer);
        objLayerSelect(layer);
        //reversedAllSetter(this.b,this.f,false,false,false,this.lw);
        clear("cursor");
        for(let i=0;i<this.points.length;i+=2){
            this.initializePoint(this.points[i],this.points[i+1]);
        }
    }
    draw(){
        clear();
        ctx.beginPath();
        ctx.moveTo(this.points[0],this.points[1]);
        for (let i=2;i<this.points.length;i+=2){
            ctx.lineTo(this.points[i],this.points[i+1]);
        }
        if(fill){
            ctx.fill();
        }
        if(border){
            ctx.stroke();
        }
    }

    //warto by ten kod opisać troszkę
    configure(){
        this.noFollower=true;
        for(let i=0;i<this.pins.length;i++){
            this.pins[i].draw();
            this.pins[i].followOnClick();
            if (this.pins[i].following) {
                this.following = true;
                this.noFollower = false;
                this.points[i * 2] = mouseX;
                this.points[i * 2 + 1] = mouseY;
                this.pins[i].modify(mouseX, mouseY);
                clear("cursor");
            } else if(mousedown)
                { if (this.equation(i, mouseX) < mouseY + 3 && this.equation(i, mouseX) > mouseY - 3 && !this.following) {
                    console.log("dodano punkt");
                    this.points.splice(i * 2 + 2, 0, mouseX, mouseY);
                    this.initializePoint(mouseX, mouseY, i + 1);
                }
            }
        }
        if(this.noFollower){
            this.following=false;
        }
    }
    //checks if you click on line between points
    //(początekY-koniecY)/(początekX-koniecX)*(x-koniecX)+koniecY
    equation(i,x){
        i=i*2;
        if(this.points[i]===this.points[i+2]){
            return mouseY;
        }else {
            return ((this.points[i + 1] - this.points[i + 3]) / (this.points[i] - this.points[i + 2]) * (x - this.points[i + 2]) + this.points[i + 3]);
        }
    }

    initializePoint(x,y,index=false){
        if(index){
            this.pins.splice(index,0,new Pinpoint(x,y));
        }else {
            this.pins.push(new Pinpoint(x, y));
        }
    }

    save(mode=""){
        clear("cursor");

        if (fill) {
            this.f = ctx.fillStyle;
        }
        if (border) {
            console.log(ctx.strokeStyle);
            this.b = ctx.strokeStyle;
        }

        if (this.index === null) {
            objects.push(["poly", this.points, this.layer, this.b, this.f, objects.length]);
            addObjectToList("Polygon")
        } else {
            objects[this.index] = ["poly", this.points, this.layer, this.b, this.f, this.index];
        }
        clearInterval(objTimer);
    }

    update(changes){
        this.points=changes[0];
        this.pins=[];

        for(let i=0;i<this.points.length;i+=2){
            this.initializePoint(this.points[i],this.points[i+1]);
        }
    }
    getData(){
        if(this.index===null){
            this.save();
            this.index=objects.length-1;
        }
        return [this.points, this.index];
    }

    debug(){
        console.log("Points:",this.points," layer:", this.layer, " b:", this.b, " f:", this.f)
    }
}

class Gradient{
    constructor(startX,startY,endX,endY,layer,grd=false,index=null){
        this.startX=startX;
        this.startY=startY;
        this.endX=endX;
        this.endY=endY;
        this.layer=layer;
        this.grd=grd;
        this.index=index;

        objLayerSelect(layer);
        //reversedAllSetter(this.b,this.f,this.w,this.h);

        this.startPin = new Pinpoint(this.startX,this.startY);
        this.endPin = new Pinpoint(this.endX,this.endY);
        clear("cursor");
    }
    draw(){
        clear();
        ctx.fillStyle = this.grd;
        ctx.fillRect(0, 0, 500, 500);
    }
    configure(){
        this.startPin.draw();
        this.endPin.draw();

        this.startPin.followOnClick();
        this.endPin.followOnClick();

        if(this.startPin.following){
            this.startPin.modify(mouseX,mouseY);
            clear("cursor");
        }else if(this.endPin.following){
            this.endPin.modify(mouseX,mouseY);
            clear("cursor");
        }

        this.grd=ctx.createLinearGradient(this.startPin.position()[0], this.startPin.position()[1], this.endPin.position()[0], this.endPin.position()[1]);
        this.grd.addColorStop(0, document.getElementById("fillColor").value);
        this.grd.addColorStop(1, ctx.strokeStyle);

        this.startPin.draw();
        this.endPin.draw();

    }
    save(){
        clear("cursor");

        if(this.index===null) {
            objects.push(["grad",this.startX, this.startY, this.endX, this.endY, this.layer, this.grd, objects.length]);
            addObjectToList("Gradient")
        }else{
            objects[this.index]=["grad",this.startX, this.startY, this.endX, this.endY, this.layer, this.grd, this.index];
        }
    }
    update(changes){
        this.startX=changes[0];
        this.startY=changes[1];
        this.endX=changes[2];
        this.endY=changes[3];
        this.grd=changes[4];
    }
    getData(){
        if(this.index===null){
            this.save();
            this.index=objects.length-1;
        }
        return [this.startX,this.startY,this.endX,this.endY,this.grd,this.index];
    }
    debug(){
        console.log("startX:",this.startX," startY:",this.startY," endX:",this.endX," endY:",this.endY," layer:",this.layer," grd:",this.grd);
    }
}
