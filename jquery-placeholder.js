(function($) {
    $.extend({
        palceholder: {
            IsBrowserSupport: function() {
                var browser = navigator.appName;
                var bVersion = navigator.appVersion;
                var version = bVersion.split(";");
                var trimVersion = version[1].replace(/[ ]/g, "");
                if (browser == "Microsoft Internet Explorer" && (trimVersion == "MSIE6.0") || trimVersion == "MSIE7.0" || trimVersion == "MSIE8.0" || trimVersion == "MSIE9.0") {
                    return false;
                }
                return true;
            },
            InitPlaceholder: function() {
                return $("body").find("input[placeholder],textarea[placeholder]").each(function() {
                    if (this.id != "") {
                        $.palceholder.CreatePlaceholder(this);
                        $(this).bind("keyup", function() {
                            if (this.value === "") {
                                $.palceholder.CreatePlaceholder(this);
                            } else {
                                $.palceholder.RemovePlaceholder(this);
                            }
                        });
                        $(this).bind("blur", function() {
                            if (this.value === "") {
                                $.palceholder.CreatePlaceholder(this);
                            } else {
                                $.palceholder.RemovePlaceholder(this);
                            }
                        });
                    }
                });
            },
            CreatePlaceholder: function(matchedInput) {
                if ($("#placeholder_" + matchedInput.id).length == 0) {
                    try {
                        var offsetNode = matchedInput.parentNode;
                        while ($(offsetNode).css("position") !== "absolute" && $(offsetNode).css("position") !== "relative") {
                            offsetNode = offsetNode.parentNode;
                        }
                        var positionInfo = $.palceholder.GetDomPosition(matchedInput, offsetNode);
                        var doc = document;
                        var offsetHeight = matchedInput.offsetHeight;
                        var fontSize = Math.abs(Math.ceil((offsetHeight * 3 / 7)));
                        var margin = Math.abs(Math.ceil((offsetHeight - fontSize) / 2));
                        var placeholder = doc.createElement("label");
                        placeholder.id = "placeholder_" + matchedInput.id;
                        var html = $(matchedInput).attr("placeholder");
                        $(placeholder).html(html).css("color", "#CCCCCC").css("position", "absolute").css("top", positionInfo.topLocation)
                            .css("left", positionInfo.leftLocation).css("margin-left", "2px").css("margin-top", margin + "px").css("font-size", "12px").css("font-family", "宋体");
                        offsetNode.appendChild(placeholder);
                    } catch(e) {
                    }
                }
            },
            RemovePlaceholder: function(matchedInput) {
                var placeholder = $("#placeholder_" + matchedInput.id);
                if (placeholder.length > 0) {
                    placeholder[0].parentNode.removeChild(placeholder[0]);
                }
            },
            GetDomPosition: function(domElement, offsetDomElement) {
                var topLocation = 0;
                var leftLocation = 0;
                var parentDomObject = null;
                var preDomObject = null;
                var domPadding = domElement.style.paddingBottom.replace("px", "");
                domPadding = domPadding.replace("px", "");
                preDomObject = domElement;
                parentDomObject = domElement;
                while (parentDomObject != null && parentDomObject.tagName.toUpperCase() != "BODY" && parentDomObject != offsetDomElement) {
                    parentDomObject = preDomObject.offsetParent;
                    topLocation += preDomObject.offsetTop;
                    leftLocation += preDomObject.offsetLeft;
                    preDomObject = parentDomObject;
                }
                if (domPadding.match(/^[0-9]+$/)) {
                    topLocation += domPadding - 0;
                }
                return { "topLocation": topLocation, "leftLocation": leftLocation };
            }
        }
    });
    if ($.palceholder.IsBrowserSupport() === false) {
        $.palceholder.InitPlaceholder();
    }
})(jQuery)
