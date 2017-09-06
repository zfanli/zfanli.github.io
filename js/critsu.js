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
