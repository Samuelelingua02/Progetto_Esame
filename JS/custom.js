/*
 Template Name: FoodEque
 File Name: custom.js
 Author Name: ThemeVault
 Author URI: http://www.themevault.net/
 License URI: http://www.themevault.net/license/
 */

$(document).ready(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });
    $('#back-to-top').click(function () {
        $("html, body").animate({scrollTop: 0}, 600);
        return false;
    });

});

$(function () {
    var $searchlink = $('#searchtoggl i');
    var $searchbar = $('#searchbar');

    $('#searchtoggl').on('click', function (e) {
        e.preventDefault();

        if ($(this).attr('id') == 'searchtoggl') {
            if (!$searchbar.is(":visible")) {
                // if invisible we switch the icon to appear collapsable
                $searchlink.removeClass('fa-search').addClass('fa-search-minus');
            } else {
                // if visible we switch the icon to appear as a toggle
                $searchlink.removeClass('fa-search-minus').addClass('fa-search');
            }

            $searchbar.slideToggle(300, function () {
                // callback after search bar animation
            });
        }
    });

    $('#searchform').submit(function (e) {
        e.preventDefault(); // stop form submission
    });
});

$(document).ready(function () {
    var myButton = $('#mybutton');
    var userFeed = new Instafeed({
        get: 'user',
        userId: '4828631159',
        accessToken: '4828631159.1677ed0.79cec29b3ab94404ad45f640b87dc4ef',
        limit: '12',
        sortBy: 'most-recent',
        after: function () {
            var images = $("#instafeed").find('a');
            $.each(images, function (index, image) {
                var delay = (index * 75) + 'ms';
                $(image).css('-webkit-animation-delay', delay);
                $(image).css('-moz-animation-delay', delay);
                $(image).css('-ms-animation-delay', delay);
                $(image).css('-o-animation-delay', delay);
                $(image).css('animation-delay', delay);
                $(image).addClass('animated flipInX');
            });

        },
        template: ' <div class="col-md-4 col-sm-6 col-xs-6 width-100 mb-15"> <div class="blog-img"><a href="{{link}}" target="_blank"><img src="{{image}}" /><div class="likes">&hearts; {{likes}}</div></a></div></div>'
    });
    userFeed.run();
});

