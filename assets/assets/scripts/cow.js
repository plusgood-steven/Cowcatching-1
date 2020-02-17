var cow_skin = cc.Class({
    name: "cow_skin",
    properties: {
        cow_anim: {
            default: [],
            type: cc.SpriteFrame,
        }, 
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        
        cow_skin_set: {
            default: [],
            type: cow_skin,
        },
		
		cow_num: {
            type: cc.Node,
			default: null,
        },
    },
	
    // use this for initialization
    onLoad: function () {
        this.anim_com = this.node.getChildByName("anim").addComponent("frame_anim");
        this.c_type = Math.random() * 6 + 1;
        this.c_type = Math.floor(this.c_type);
        this.cow_num.color = new cc.color(255, 255, 255, 0);//設定牛數值顏色
        this._set_cow_anim();
        this.speed = - 200;
    },
    
    _set_cow_anim: function() {
        this.anim_com.sprite_frames = this.cow_skin_set[this.c_type - 1].cow_anim;
        this.anim_com.duration = 0.2;
        this.anim_com.play_loop();
    },
    // called every frame, uncomment this function to activate update callback
    // 每个机器update 次数，运行的时候不一样，dt;
    // 不同机器，就可以抛出一样的效果出来;
    
    update: function (dt) {
        var s = this.speed * dt;
        this.node.x += s;
        if (this.node.x <= -740) {
            this.node.removeFromParent();
        }
    },
});
