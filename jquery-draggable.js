/*Settings:
        DragContainer:仅在该Dom区域内允许拖拽   
        DragDirection{"Both":允许x/y轴方向拖拽,"Vertical":允许y轴方向拖拽,"Horizontal":允许x轴方向拖拽}  
*/

jQuery.draggable = {
    Register: [],
    Init: function (settings) {
        this.each(function () {
            this.dragSettings = jQuery.extend({
                DragContainer: $("body"),
                DragDirection: "Both"
            }, settings || {});
            jQuery.draggable.MakeDraggable(this);
            jQuery.draggable.Register.push(this);
        });
        document.onmouseup = function () { jQuery.draggable.DragDisabled(); };
        return this;
    },
    MakeDraggable: function (draggableObj) {
        draggableObj.onmousedown = function (e) {
            jQuery.draggable.DragEnabled(draggableObj, e);
            jQuery.draggable.StopBubble(e);
        };
        draggableObj.style.position = "absolute";
    },
    DragEnabled: function (draggableObj, e) {
        draggableObj.canMove = true;
        var event = e || window.event;
        var xcoordinates = event.clientX > 0 ? event.clientX : 0;
        var ycoordinates = event.clientY > 0 ? event.clientY : 0;
        var xcurrentPosition = $(draggableObj).css("left");
        var ycurrentPosition = $(draggableObj).css("top");
        xcurrentPosition = xcurrentPosition == "auto" ? "0" : xcurrentPosition.replace("px", "");
        ycurrentPosition = ycurrentPosition == "auto" ? "0" : ycurrentPosition.replace("px", "");
        draggableObj.xcompansation = xcoordinates - xcurrentPosition;
        draggableObj.ycompansation = ycoordinates - ycurrentPosition;

        var topLimitationMin = 0;
        var topLimitationMax = draggableObj.dragSettings.DragContainer.height()-$(draggableObj).height();
        var leftLimitationMin = 0;
        var leftLimitationMax = draggableObj.dragSettings.DragContainer.width()-$(draggableObj).width();
        var limitationConfig= {
            TopLimitationMin: topLimitationMin,
            TopLimitationMax: topLimitationMax,
            LeftLimitationMin: leftLimitationMin,
            LeftLimitationMax: leftLimitationMax,
        }
        document.onmousemove = function (e) { jQuery.draggable.DragExcuting(draggableObj,limitationConfig, e); };
    },
    DragDisabled: function () {
        if (jQuery.draggable.Register.length > 0) {
            var length = jQuery.draggable.Register.length;
            for (var index = 0; index < length; index++) {
                jQuery.draggable.Register[index].canMove = false;
            }
        }
        document.onmousemove = function (e) {
            jQuery.draggable.StopBubble(e);
        };
    },
    DragExcuting: function (draggableObj,limitationConfig, e) {
        var event = e || window.event;
        var xcoordinates = event.clientX > 0 ? event.clientX : 0;
        var ycoordinates = event.clientY > 0 ? event.clientY : 0;
        var left = xcoordinates - draggableObj.xcompansation;
        var top = ycoordinates - draggableObj.ycompansation;
        if (draggableObj.canMove && draggableObj.canMove == true) {
            switch (draggableObj.dragSettings.DragDirection) {
                case "Both":
                    if (limitationConfig.LeftLimitationMin < left && left < limitationConfig.LeftLimitationMax) {
                        draggableObj.style.left = left + "px";
                    }
                    if (limitationConfig.TopLimitationMin < top && top < limitationConfig.TopLimitationMax) {
                        draggableObj.style.top = top + "px";
                    }
                    break;
                case "Vertical":
                    if (limitationConfig.TopLimitationMin < top && top < limitationConfig.TopLimitationMax) {
                        draggableObj.style.top = ycoordinates - draggableObj.ycompansation + "px";
                    }
                    break;
                case "Horizontal":
                    if (limitationConfig.LeftLimitationMin < left && left < limitationConfig.LeftLimitationMax) {
                        draggableObj.style.left = left + "px";
                    }
                    break;
                default:
                    break;
            }
        }
    },
    StopBubble: function (e) {
        if (e) {
            e.stopPropagation();
        } else if (window.event) {
            event.cancelBubble = true;
        }
    }
};
jQuery.fn.extend({
    draggable: jQuery.draggable.Init
});
