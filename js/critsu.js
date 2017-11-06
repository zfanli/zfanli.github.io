/*!
 * Clean Blog v1.0.0 (http://startbootstrap.com)
 * Copyright 2015 Start Bootstrap
 * Licensed under Apache 2.0 (https://github.com/IronSummitMedia/startbootstrap/blob/gh-pages/LICENSE)
 */

// Tooltip Init
$(function() {
    $("[data-toggle='tooltip']").tooltip();
});


// make all images responsive
/* 
 * Unuse by Hux
 * actually only Portfolio-Pages can't use it and only post-img need it.
 * so I modify the _layout/post and CSS to make post-img responsive!
 */
// $(function() {
//     $("img").addClass("img-responsive");
// });

// responsive tables
$(document).ready(function() {
    var $table = $("table");
    $table.wrap("<div class='table-responsive'></div>");
    $table.addClass("table");
});

// responsive embed videos
$(document).ready(function () {
    var $youtube = $('iframe[src*="youtube.com"]'),
        $vimeo = $('iframe[src*="vimeo.com"]');
    $youtube.wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
    $youtube.addClass('embed-responsive-item');
    $vimeo.wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
    $vimeo.addClass('embed-responsive-item');
});

// Navigation Scripts to Show Header on Scroll-Up
jQuery(document).ready(function($) {
    var MQL = 1170;

    //primary navigation slide-in effect
    if ($(window).width() > MQL) {
        var $navbar = $('.navbar-custom'),
            $header = $('.intro-header .container'),
            headerHeight = $navbar.height(),
            bannerHeight  = $header.height();
        $(window).on('scroll', {
                previousTop: 0
            },
            function() {
                var $window = $(window),
                    currentTop = $window.scrollTop(),
                    $catalog = $('.side-catalog'),
                    catalogHeight = $catalog.outerHeight(),
                    footerHeight = $("footer").outerHeight(),
                    subtractHeight = $(".comment").outerHeight(),            // subtract the comment area height
                    catalogTop = $(document).height() - catalogHeight - footerHeight - subtractHeight,
                    temp;
                //check if user is scrolling up
                if (currentTop < this.previousTop) {
                    //if scrolling up...
                    if (currentTop > 0 && $navbar.hasClass('is-fixed')) {
                        $navbar.addClass('is-visible');
                    } else {
                        $navbar.removeClass('is-visible is-fixed');
                    }
                } else {
                    //if scrolling down...
                    $navbar.removeClass('is-visible');
                    if (currentTop > headerHeight && !$navbar.hasClass('is-fixed')) $navbar.addClass('is-fixed');
                }
                this.previousTop = currentTop;

                //adjust the appearance of side-catalog
                $catalog.show();
                if (currentTop >= (catalogTop + 41)) {
                    $catalog.removeClass('fixed');
                    temp = catalogTop - $(".post-container").offset().top;
                    $catalog.css("top", temp + 21);
                } else if (currentTop < (bannerHeight + 41)) {
                    $catalog.removeClass('fixed');
                    $catalog.removeAttr("style");
                } else {
                    $catalog.addClass('fixed');
                    $catalog.removeAttr("style");
                }
            });
    }
});


//img scale show apply
$(document).ready(function() {
    var $post = $(".post-content-page");
    var $body = $("body");
    $post.find("img").on("click",function(){
        var $mask = $body.find(".mask");
        var height = document.documentElement.clientHeight;
        var width = document.documentElement.clientWidth;
        if ($mask.length === 0){
            var mask = $("<div></div>");
            var maskBody = $("<div></div>");
            mask
                .attr("class","mask")
                .attr("onclick","closeMaskAndImg()");
            maskBody
                .attr("class","mask-body");

            $body.append(mask);
            $mask = mask;
            $mask.after(maskBody);
        }
        $mask
            .empty()
            .css("height",height)
            .css("width",width)
            .css("line-height",height + "px");
        var $img = $("<img>");
        $img
            .attr("src",$(this).attr("src"))
            .attr("class","scale-show")
            .attr("onclick","closeMaskAndImg()");
        var imgHeight = $(this)[0].naturalHeight;
        var imgWidth = $(this)[0].naturalWidth;
        // 设置图片显示大小
        if (imgHeight < height && imgWidth < width) {
            $img.css("width", imgWidth);
        } else if (imgWidth > width && imgHeight < height) {
            $img.css("width", width - 20);
        } else if (imgHeight > height && imgWidth < width) {
            $img.css("height", height -20);
        } else {
            var temp = imgWidth / imgHeight;
            $img.css("width", temp * height - 20);
        }

        $mask.append($img);
        $mask.css("display","block");
        $mask.next().css("display","block");
    });
});



//img scale show apply
//global method
function closeMaskAndImg() {
    $(".mask, .mask-body").css("display","none");
}


// loading Animation options
var opts = {
    lines: 9 // The number of lines to draw
    , length: 0 // The length of each line
    , width: 16 // The line thickness
    , radius: 40 // The radius of the inner circle
    , scale: 0.25 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#000' // #rgb or #rrggbb or array of colors
    , opacity: 0.1 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'relative' // Element positioning
};

var spinner = new Spinner(opts);

$(function(){
    $("#load-button").click(function () {
        var path = $(this).val();
        var reg = /[/]$/;
        if (!reg.test(path)) path += "/";
        $.ajax({
            type: "GET",
            timeout: 5000,
            url: path,
            beforeSend: function(){
                $("#load-button").css("display", "none");
                spinner.spin($("#loader")[0]);
            },
            success: function(tar){
                var $tar = $(tar);
                var newPath = $tar.find("#load-button").val();
                $("#post-list").append($tar.find("#post-list").children());
                spinner.spin();
                if (!!newPath) {
                    $("#load-button").val(newPath).html("点击加载更多").fadeIn(300);
                } else {
                    $("#load-button").after($("<div class=\"no-more\"><p>没有更多了哟</p></div>"))
                }
            },
            error: function (event,xhr,options,exc) {
                spinner.spin();
                $("#load-button").html("出了点问题...点击重试").fadeIn(300);
            }
        });
    });
});


