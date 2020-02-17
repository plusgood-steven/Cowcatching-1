// 定义了一个类 new 够找函数;
// cc.Component 所有组件类的基类;

cc.Class({
    // 扩展继承组件类
    extends: cc.Component,

    // 组件属性, 定义组件的属性
    properties: {
        is_debug: false,
        rope: {
            type: cc.Node,
            default: null,
        },
        cow_prefab: {
            type: cc.Prefab,
            default: null,
        },

        cow_root: {
            type: cc.Node,
            default: null,
        },

        rope_imgs: {
            type: cc.SpriteFrame,
            default: [],
        },
        //手部圖片
		hand_rope:{
			type:cc.SpriteFrame,
			default:[],
		},
		//holdButton Node
		holdButton : {
			type: cc.Node,
            default: null,
		},
		//holdButton image
		holdButton_imgs: {
            type: cc.SpriteFrame,
            default: [],
        },
		//arrowDown image
		arrowDown_imgs: {
            type: cc.SpriteFrame,
            default: [],
        },

        arrow: {
            type: cc.Sprite,
            default: null,
        },

        

        transparent: {
            type: cc.SpriteFrame,
            default: null,
        },
        //丟繩圖片
        rope_out_img: {
            type: cc.SpriteFrame,
            default: [],
        },
        //丟繩後手部改變
        hand_change_b:
        {
            type: cc.Sprite,
            default:null,
        },
        hand_change_f:
        {
            type: cc.Sprite,
            default: null,
        },

        //手部改變圖片
        hand_out_img: {
            type: cc.SpriteFrame,
            default:[],
        },

        betDisplay: {
            type: cc.Label,
            default: null,
        }
    },


    // 开始运行之前  组件实例.start;
    // js 语法 ---》this机制 start---> this  (当前组件实例)
    // Component ---> node 指向了组件实例所在节点:  当前组件实例所在节点,  this.node;
    start () {
		this.holdButton_sp = this.holdButton.getComponent(cc.Sprite);//get holdButton sprite
		this.holdButton_sp.spriteFrame = this.holdButton_imgs[0];//設定holdButton照片
        this.rope.y = -560;
        this.betnumber = 1;
        this.is_throwing = false;
        this.rope_sp = this.rope.getComponent(cc.Sprite);
        this.rope_sp.spriteFrame = this.rope_imgs[0];
        this.gen_one_cow();
        //呼叫手部動畫
        this.anim_hand = this.node.getChildByName("start").addComponent("frame_anim");
        this._set_hand_anim();
		this.anim_arrowDown = this.node.getChildByName("arrow").addComponent("frame_anim");
        // this._set_arrowDown_anim();
    },

    //手部動畫
	_set_hand_anim: function() {
		
        this.anim_hand.sprite_frames = this.hand_rope;
        this.anim_hand.duration = 0.2;
        this.anim_hand.play_loop();
    },
	//arrowDown動畫
	_set_arrowDown_anim: function() {
        this.anim_arrowDown.sprite_frames = this.arrowDown_imgs;
        this.anim_arrowDown.duration = 0.2;
        this.anim_arrowDown.play_loop();
    },

    bet_plus: function () {
        this.betnumber = this.betnumber + 1;
        cc.log(this.betnumber);
        this.betDisplay.string = this.betnumber;
        for (var i = 0; i < this.cow_root.childrenCount; i++) {
            var cow = this.cow_root.children[i];
            var cowtype = cow.getComponent("cow").c_type;
            cow.getChildByName("num").getComponent(cc.Label).string = this.betnumber * cowtype;
        }
    },

    bet_minus: function () {
        if (this.betnumber > 1) {
            this.betnumber = this.betnumber - 1;
        }
        cc.log(this.betnumber);
        this.betDisplay.string = this.betnumber;
        for (var i = 0; i < this.cow_root.childrenCount; i++) {
            var cow = this.cow_root.children[i];
            var cowtype = cow.getComponent("cow").c_type;
            cow.getChildByName("num").getComponent(cc.Label).string = this.betnumber * cowtype;
        }
    },

    gen_one_cow() {
        var cow = cc.instantiate(this.cow_prefab);
        this.cow_root.addChild(cow);
        var cowtype = cow.getComponent("cow").c_type;
        cow.getChildByName("num").getComponent(cc.Label).string = this.betnumber * cowtype;
        cow.setPosition(cc.v2(660, 120));
        var time = 1;
        this.scheduleOnce(this.gen_one_cow.bind(this), time);
    },
    // 每次刷新的时候 组件实例.update 会背调用;
    // dt: 距离上一次update 过去的时间，|----|----|----|--dt--|
    //  100 --->                                       A      B= ??  A + 100 * dt;
    update (dt) {
        // js 语法 ---》this机制 start---> this  (当前组件实例)
        // Component ---> node 指向了组件实例所在节点:  当前组件实例所在节点,  this.node;
        // console.log("update");
    },

    hit_test() {
        for(var i = 0; i < this.cow_root.childrenCount; i ++) {
            var cow = this.cow_root.children[i];
            if (cow.x >= -50 && cow.x <= 50) {
                return cow;
            }
        }

        return null;
    },

    on_throw_click() {
        if (this.is_throwing === true) {
            return;
        }
        this.anim_hand.is_playing = false; //丟出繩索後取消手部動畫
        this.hand_change_f.spriteFrame = this.hand_out_img[0];
        this.hand_change_b.spriteFrame = this.hand_out_img[1];
        this.is_throwing = true;
        this.rope.y = -560;
        this.rope_sp.spriteFrame = this.rope_out_img[0];
        ////this.getChildByName("arrowUp").getComponent(cc.Animation).pause('arrowUp_anim');
        // Action系统 ---> 动作;
        // new Action,  节点运行一个Action
        var m1 = cc.moveTo(0.5, cc.v2(0, 150));
        var mid_func = cc.callFunc(function() {
            var cow = this.hit_test();
            if (cow) {
                //////arrowDown圖片顯示
                this._set_arrowDown_anim();//呼叫arrowDown動畫
                var cow_type = cow.getComponent("cow").c_type;
                this.rope_sp.spriteFrame = this.rope_out_img[0];
                this.rope.y = 160;
				////////holdButton顯示
				this.holdButton.y = -260;
				this.holdButton.x = 430;
                cow.removeFromParent();
            }
        }.bind(this))

        var m2 = cc.moveTo(1, cc.v2(0, -560));
		////////holdButton & arrow跑出螢幕看不到 & 開啟手部動畫& 關閉 arrowDown動畫
        var removeHoldButton = cc.callFunc(function () {
            this.rope.spriteFrame = this.transparent;
            this.hand_change_f.spriteFrame = this.transparent;
            this.hand_change_b.spriteFrame = this.transparent;
            this.holdButton.y = -240;
			this.holdButton.x = 752;
			this.anim_hand.is_playing = true; //開啟手部動畫
            this.anim_arrowDown.is_playing = false; //關閉 arrowDown動畫
            this.arrow.spriteFrame = this.transparent;//變成透明貼圖
        }.bind(this));

        var end_func = cc.callFunc(function() {
            this.is_throwing = false;
        }.bind(this));

        var seq = cc.sequence([m1, mid_func, m2,removeHoldButton, end_func]);

        this.rope.runAction(seq);
        // end 


    },
});
